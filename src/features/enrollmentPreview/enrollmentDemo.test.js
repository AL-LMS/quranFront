import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  createDemoRequest, listDemoRequests, parseDemoRequest, reviewDemoRequest,
} from "./enrollmentDemoApi";
import { enrollmentPreviewEnabled } from "./enrollmentPreviewGate";
import DemoRequestAction from "./DemoRequestAction";
import EnrollmentPreviewPage from "./EnrollmentPreviewPage";

const record = {
  id: 1, course_id: 91001,
  course_name: "آموزش روخوانی قرآن",
  status: "pending", requested_at: "2026-11-06T20:00:00Z", reviewed_at: null,
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function withRouter(element) {
  return render(<MemoryRouter>{element}</MemoryRouter>);
}

describe("synthetic enrollment gating and contract", () => {
  it("requires all four explicit development switches", () => {
    const flags = {
      dev: true, catalogFlag: "true", apiFlag: "true", enrollmentFlag: "true",
    };
    expect(enrollmentPreviewEnabled(flags)).toBe(true);
    expect(enrollmentPreviewEnabled({ ...flags, dev: false })).toBe(false);
    expect(enrollmentPreviewEnabled({ ...flags, apiFlag: "false" })).toBe(false);
    expect(enrollmentPreviewEnabled({ ...flags, enrollmentFlag: undefined })).toBe(false);
    expect(enrollmentPreviewEnabled({ ...flags, catalogFlag: "false" })).toBe(false);
  });

  it("projects demo fields and rejects invalid or private payloads", () => {
    expect(parseDemoRequest({ ...record, student_phone: "private" })).toEqual(record);
    expect(() => parseDemoRequest({ ...record, status: "enrolled" })).toThrow();
    expect(() => parseDemoRequest({ ...record, requested_at: 42 })).toThrow();
    expect(() => parseDemoRequest({ ...record, id: -1 })).toThrow();
  });

  it("uses same-origin demo paths with no authentication credentials", async () => {
    const mock = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 201, json: async () => record })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [record] })
      .mockResolvedValueOnce({
        ok: true, status: 200, json: async () => ({
          ...record, status: "approved", reviewed_at: "2026-11-06T20:01:00Z",
        }),
      });
    vi.stubGlobal("fetch", mock);

    expect((await createDemoRequest(91001)).status).toBe("pending");
    expect(await listDemoRequests()).toHaveLength(1);
    expect((await reviewDemoRequest(1, "approve")).status).toBe("approved");
    expect(mock.mock.calls[0][0]).toBe("/api/v2/__demo/enrollment/requests");
    expect(mock.mock.calls[1][0]).toBe("/api/v2/__demo/enrollment/requests");
    expect(mock.mock.calls[2][0]).toBe("/api/v2/__demo/enrollment/admin/requests/1");
    expect(mock.mock.calls[0][1]).toMatchObject({
      method: "POST", credentials: "omit",
    });
    expect(mock.mock.calls[2][1].body).toBe('{"action":"approve"}');
  });

  it("fails closed on invalid user actions and backend conflicts", async () => {
    const mock = vi.fn().mockResolvedValue({ ok: false, status: 409 });
    vi.stubGlobal("fetch", mock);
    await expect(createDemoRequest(91001)).rejects.toThrow("قبلاً ثبت");
    await expect(reviewDemoRequest(1, "delete")).rejects.toThrow("معتبر نیست");
    await expect(createDemoRequest(0)).rejects.toThrow("شناسه دوره");
    expect(mock).toHaveBeenCalledTimes(1);
  });
});

describe("request and review screens", () => {
  it("creates one pending request and shows a status link", async () => {
    const mock = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, status: 201, json: async () => record });
    vi.stubGlobal("fetch", mock);
    withRouter(<DemoRequestAction courseId={91001} />);
    const button = await screen.findByRole("button", { name: "ثبت درخواست آزمایشی" });
    fireEvent.click(button);
    expect(await screen.findByText(/در انتظار بررسی/)).toBeTruthy();
    expect(button.disabled).toBe(true);
    expect(screen.getByRole("link", { name: "مشاهده درخواست‌های من" }).getAttribute("href"))
      .toBe("/__preview/requests");
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it("shows student request status without any enrollment grant action", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => [record],
    }));
    withRouter(<EnrollmentPreviewPage />);
    expect(await screen.findByText("آموزش روخوانی قرآن")).toBeTruthy();
    expect(screen.getByText("در انتظار بررسی")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "تأیید آزمایشی" })).toBeNull();
    expect(screen.getByText(/دسترسی آموزشی ایجاد نمی‌کند/)).toBeTruthy();
  });

  it("lets the fictional admin approve one pending request only", async () => {
    const updated = {
      ...record, status: "approved", reviewed_at: "2026-11-06T20:01:00Z",
    };
    const mock = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [record] })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => updated });
    vi.stubGlobal("fetch", mock);
    withRouter(<EnrollmentPreviewPage admin />);
    const button = await screen.findByRole("button", { name: "تأیید آزمایشی" });
    fireEvent.click(button);
    expect(await screen.findByText("تأییدشده (فقط آزمایشی)")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "تأیید آزمایشی" })).toBeNull();
    expect(mock.mock.calls[1][0]).toBe("/api/v2/__demo/enrollment/admin/requests/1");
  });

  it("renders an empty state and allows navigation back to catalog", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => [],
    }));
    render(
      <MemoryRouter initialEntries={["/__preview/requests"]}>
        <Routes>
          <Route path="/__preview/requests" element={<EnrollmentPreviewPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText("هنوز درخواستی ثبت نشده است.")).toBeTruthy();
    expect(screen.getByRole("link", { name: "بازگشت به دوره‌ها" }).getAttribute("href"))
      .toBe("/__preview/catalog?source=api");
    await waitFor(() => expect(screen.queryByText("در حال بارگذاری درخواست‌ها…")).toBeNull());
  });
});
