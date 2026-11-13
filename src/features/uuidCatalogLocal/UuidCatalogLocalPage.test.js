import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UuidCatalogLocalPage from "./UuidCatalogLocalPage";

const ID = "00000000-0000-0000-0000-00000000a001";
const COURSE = { id: ID, title: "آموزش روخوانی قرآن" };
const header = { get: (key) => key === "X-AL-LMS-Data-Scope" ? "synthetic-only" : null };
function json(body, status = 200) {
  return { status, ok: status >= 200 && status < 300, headers: header, json: async () => body };
}
function view(path = "/__preview/m5-uuid") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/__preview/m5-uuid" element={<UuidCatalogLocalPage />} />
        <Route path="/__preview/m5-uuid/:courseId" element={<UuidCatalogLocalPage />} />
      </Routes>
    </MemoryRouter>
  );
}
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("RTL local UUID catalog", () => {
  it("lists and opens canonical UUID detail with a synthetic-only notice", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(json({ items: [COURSE], limit: 6, offset: 0 }))
      .mockResolvedValueOnce(json(COURSE));
    vi.stubGlobal("fetch", fetcher);
    const { container } = view();
    expect(container.querySelector("[dir=rtl][lang=fa]")).toBeTruthy();
    expect(await screen.findByText("آموزش روخوانی قرآن")).toBeTruthy();
    expect(screen.getByText("فقط آزمایش محلی • دادهٔ ساختگی")).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: /مشاهده جزئیات آموزش روخوانی قرآن/ }));
    expect(await screen.findByText("این یک دورهٔ ساختگی است و هیچ دسترسی واقعی به محتوای آموزشی ندارد."))
      .toBeTruthy();
    expect(screen.getByText("UUID: " + ID)).toBeTruthy();
    expect(fetcher.mock.calls[1][0]).toBe("/__demo/m5-uuid/courses/" + ID);
  });

  it("shows indistinguishable non-public/not-found detail", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json(null, 404)));
    view("/__preview/m5-uuid/" + ID);
    expect(await screen.findByText(/دوره پیدا نشد یا برای نمایش/)).toBeTruthy();
  });

  it("does not fetch a legacy integer course ID", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    view("/__preview/m5-uuid/91001");
    expect(await screen.findByText(/دوره پیدا نشد یا برای نمایش/)).toBeTruthy();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("shows safe retry when the local backend is unavailable", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(json({ error: "private server details" }, 503))
      .mockResolvedValueOnce(json({ items: [COURSE], limit: 6, offset: 0 }));
    vi.stubGlobal("fetch", fetcher);
    view();
    expect(await screen.findByText("دریافت اطلاعات آزمایشی ناموفق بود.")).toBeTruthy();
    expect(screen.queryByText("private server details")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /تلاش دوباره/ }));
    expect(await screen.findByText("آموزش روخوانی قرآن")).toBeTruthy();
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("shows a second page without converting UUIDs into old IDs", async () => {
    const second = { id: "00000000-0000-0000-0000-00000000a007", title: "روان‌خوانی سطح دوم" };
    const firstPage = Array.from({ length: 6 }, (_, i) => ({
      id: "00000000-0000-0000-0000-" + (40961 + i).toString(16).padStart(12, "0"),
      title: "دوره شماره " + (i + 1),
    }));
    const fetcher = vi.fn()
      .mockResolvedValueOnce(json({ items: firstPage, limit: 6, offset: 0 }))
      .mockResolvedValueOnce(json({ items: [second], limit: 6, offset: 6 }));
    vi.stubGlobal("fetch", fetcher);
    view();
    expect(await screen.findByText("دوره شماره 1")).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: "صفحه بعد" }));
    expect(await screen.findByText("روان‌خوانی سطح دوم")).toBeTruthy();
    expect(fetcher.mock.calls[1][0]).toContain("offset=6");
  });
});
