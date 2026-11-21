import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { r19CourseDetail, r19CourseId } from "./r19DetachedCatalog";
import R21DetachedCatalogPreview from "./R21DetachedCatalogPreview";
import {
  createR21SyntheticTransport, r21SyntheticCourses,
} from "./r21SyntheticCatalogTransport";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const reply = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const show = (transport, options = {}) =>
  render(<R21DetachedCatalogPreview transport={transport} {...options} />);

describe("R21 synthetic UUID source (no real network)", () => {
  it("contains 25 fabricated sorted canonical UUID/title-only rows", () => {
    expect(r21SyntheticCourses).toHaveLength(25);
    expect(r21SyntheticCourses.every((row) =>
      Object.keys(row).sort().join(",") === "id,title" &&
      r19CourseId(row.id) === row.id
    )).toBe(true);
    expect(r21SyntheticCourses[0].title).toContain("۱");
    expect(r21SyntheticCourses.at(-1).title).toContain("۲۵");
  });

  it("simulates exact keyset and generic hidden/missing detail", async () => {
    const transport = createR21SyntheticTransport();
    const opts = { method: "GET", credentials: "omit" };
    const page1 = await transport("/api/v2/courses?limit=12", opts);
    const body1 = await page1.json();
    expect(body1.items).toHaveLength(12);
    expect(body1.next_after_id).toBe(r21SyntheticCourses[11].id);
    const page2 = await transport(
      "/api/v2/courses?limit=12&after_id=" + body1.next_after_id, opts
    );
    expect((await page2.json()).items[0].id).toBe(r21SyntheticCourses[12].id);
    const detail = await transport(
      "/api/v2/courses/" + r21SyntheticCourses[0].id, opts
    );
    expect(await detail.json()).toEqual(r21SyntheticCourses[0]);
    const missing = await transport(
      "/api/v2/courses/ffffffff-ffff-4fff-8fff-ffffffffffff", opts
    );
    expect(missing.status).toBe(404);
    expect(await missing.json()).toEqual({ detail: "Not found" });
  });

  it("rejects credentials, scope injection, duplicates, offset and integer IDs", async () => {
    const transport = createR21SyntheticTransport();
    const opts = { method: "GET", credentials: "omit" };
    for (const path of [
      "/api/v2/courses?limit=12&institution_id=secret",
      "/api/v2/courses?limit=12&limit=12",
      "/api/v2/courses?limit=12&offset=12",
      "/api/v2/courses?limit=0",
      "/api/v2/courses?limit=51",
      "/api/v2/courses?limit=12&after_id=91001",
    ]) {
      expect((await transport(path, opts)).status).toBe(422);
    }
    expect((await transport("/api/v2/courses?limit=12", {
      ...opts, credentials: "include",
    })).status).toBe(422);
    expect((await transport("/api/v2/courses/91001", opts)).status).toBe(404);
    expect(() => createR21SyntheticTransport([
      r21SyntheticCourses[0], r21SyntheticCourses[0],
    ])).toThrow();
    expect(() => createR21SyntheticTransport([
      { ...r21SyntheticCourses[0], phone: "private" },
    ])).toThrow();
  });
});

describe("R21 detached RTL list/detail UI", () => {
  it("has an explicit disconnected state and never calls browser fetch", async () => {
    const network = vi.fn();
    vi.stubGlobal("fetch", network);
    show(undefined);
    expect(await screen.findByText(/به هیچ سرویس واقعی متصل نیست/)).toBeTruthy();
    expect(screen.getByRole("region", {
      name: "پیش‌نمایش جداگانهٔ کاتالوگ UUID",
    }).getAttribute("dir")).toBe("rtl");
    expect(network).not.toHaveBeenCalled();
  });

  it("shows public titles and navigates forward/backward by UUID, without offsets", async () => {
    const network = vi.fn();
    vi.stubGlobal("fetch", network);
    const transport = vi.fn(createR21SyntheticTransport());
    show(transport);
    expect(await screen.findAllByRole("button", { name: /مشاهده جزئیات/ }))
      .toHaveLength(12);
    expect(screen.getByText(r21SyntheticCourses[0].title)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "صفحه بعد" }));
    await screen.findByText(r21SyntheticCourses[12].title);
    expect(screen.queryByText(r21SyntheticCourses[0].title)).toBeNull();
    expect(screen.getByLabelText("شماره صفحه").textContent).toContain("۲");
    expect(transport.mock.calls.some(([path]) =>
      path === "/api/v2/courses?limit=12&after_id=" + r21SyntheticCourses[11].id
    )).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "صفحه قبل" }));
    await screen.findByText(r21SyntheticCourses[0].title);
    expect(network).not.toHaveBeenCalled();
    expect(transport.mock.calls.every(([path, options]) =>
      !path.includes("offset") && options.credentials === "omit"
    )).toBe(true);
  });

  it("opens and closes the matching title-only detail by UUID", async () => {
    const transport = vi.fn(createR21SyntheticTransport());
    show(transport);
    const buttons = await screen.findAllByRole("button", {
      name: /مشاهده جزئیات/,
    });
    fireEvent.click(buttons[0]);
    await waitFor(() => {
      expect(screen.getByRole("region", { name: "جزئیات دوره" })).toBeTruthy();
      expect(screen.getAllByText(r21SyntheticCourses[0].title)).toHaveLength(2);
    });
    expect(transport.mock.calls.some(([path]) =>
      path === "/api/v2/courses/" + r21SyntheticCourses[0].id
    )).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "بستن جزئیات" }));
    await waitFor(() =>
      expect(screen.queryByRole("region", { name: "جزئیات دوره" })).toBeNull()
    );
  });

  it("uses the same safe missing message and never reveals upstream errors", async () => {
    const fake = createR21SyntheticTransport();
    const transport = async (path, options) =>
      path.startsWith("/api/v2/courses/") ? reply(404, { detail: "private" })
        : fake(path, options);
    show(transport);
    fireEvent.click((await screen.findAllByRole("button", {
      name: /مشاهده جزئیات/,
    }))[0]);
    expect(await screen.findByText("دوره در دسترس نیست.")).toBeTruthy();
    expect(screen.queryByText("private")).toBeNull();
  });

  it("fails closed on bad private list fields, without displaying them", async () => {
    const forbidden = { ...r21SyntheticCourses[0], student_phone: "secret" };
    show(async () => reply(200, { items: [forbidden], next_after_id: null }));
    expect(await screen.findByText(/فهرست دوره‌ها در دسترس نیست/)).toBeTruthy();
    expect(screen.queryByText("secret")).toBeNull();
    expect(screen.queryByRole("button", { name: /مشاهده جزئیات/ })).toBeNull();
  });

  it("rejects a detail body whose id differs from the requested UUID", async () => {
    await expect(r19CourseDetail(r21SyntheticCourses[0].id, {
      transport: async () => reply(200, r21SyntheticCourses[1]),
    })).rejects.toThrow("پاسخ عمومی دوره معتبر نیست");
    const fake = createR21SyntheticTransport();
    const transport = async (path, options) =>
      path.startsWith("/api/v2/courses/") ? reply(200, r21SyntheticCourses[1])
        : fake(path, options);
    show(transport);
    fireEvent.click((await screen.findAllByRole("button", {
      name: /مشاهده جزئیات/,
    }))[0]);
    expect(await screen.findByText("دریافت جزئیات دوره ممکن نیست.")).toBeTruthy();
    const detailRegion = screen.getByRole("region", { name: "جزئیات دوره" });
    expect(within(detailRegion).queryByText(r21SyntheticCourses[1].title)).toBeNull();
  });

  it("ignores an obsolete in-flight result when transport changes", async () => {
    let resolveOld;
    const oldRequest = new Promise((resolve) => { resolveOld = resolve; });
    const oldTransport = vi.fn(() => oldRequest);
    const { rerender } = show(oldTransport);
    expect(await screen.findByText(/در حال آماده‌سازی فهرست/)).toBeTruthy();
    const nextTransport = vi.fn(createR21SyntheticTransport());
    rerender(<R21DetachedCatalogPreview transport={nextTransport} />);
    expect(await screen.findByText(r21SyntheticCourses[0].title)).toBeTruthy();
    resolveOld(reply(200, {
      items: [{ ...r21SyntheticCourses[0], title: "دادهٔ منسوخ" }],
      next_after_id: null,
    }));
    await oldRequest;
    await waitFor(() =>
      expect(screen.queryByText("دادهٔ منسوخ")).toBeNull()
    );
    expect(screen.getByText(r21SyntheticCourses[0].title)).toBeTruthy();
  });

  it("shows an empty list and disables forward navigation when exhausted", async () => {
    show(createR21SyntheticTransport([]));
    expect(await screen.findByText("دوره‌ای برای نمایش وجود ندارد.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "صفحه بعد" }).disabled).toBe(true);
  });
});
