import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  COURSE_FIELDS, PAGE_SIZE, catalogQueryParams, parseCourseId,
  parseCoursePage, projectCourse, readCatalogFilters,
} from "./catalogContract";
import { catalogPreviewEnabled, localCatalogApiAllowed } from "./catalogPreviewRoutes";
import {
  syntheticCatalogPage, syntheticCatalogDetail, syntheticCourses,
} from "./catalogFixtures";
import { fetchCatalogDetail, fetchCatalogPage } from "./catalogApi";
import CatalogPreviewPage from "./CatalogPreviewPage";
import CatalogDetailPreviewPage from "./CatalogDetailPreviewPage";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const filters = {
  search: "", category: "", is_online: "", limit: PAGE_SIZE, offset: 0,
};

function showPreview(path = "/__preview/catalog") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/__preview/catalog" element={<CatalogPreviewPage />} />
        <Route path="/__preview/catalog/:id" element={<CatalogDetailPreviewPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("candidate contract and privacy projection", () => {
  it("exposes exactly five public fields and discards unknown internal fields", () => {
    expect(COURSE_FIELDS).toEqual(["id", "name", "summary", "category", "is_online"]);
    const projected = projectCourse({
      id: 1, name: "آموزش", summary: null, category: "قرآن", is_online: true,
      approval_status: "approved", archived_at: null, teacher_phone: "private",
      price: 10000, published_at: "2026-01-01",
    });
    expect(Object.keys(projected)).toEqual(COURSE_FIELDS);
    expect(JSON.stringify(projected)).not.toContain("private");
    expect(JSON.stringify(projected)).not.toContain("published_at");
  });

  it("rejects invalid records, identifiers and malformed pages", () => {
    expect(parseCourseId("01")).toBeNull();
    expect(parseCourseId("-1")).toBeNull();
    expect(parseCourseId("abc")).toBeNull();
    expect(parseCourseId("9007199254740992")).toBeNull();
    expect(parseCourseId("91001")).toBe(91001);
    expect(() => projectCourse({ id: 1, name: "x" })).toThrow();
    expect(() => parseCoursePage({ items: [], limit: 0, offset: 0 })).toThrow();
    expect(() => parseCoursePage({ items: [{ id: -1 }], limit: 12, offset: 0 })).toThrow();
  });

  it("parses bounded URL filters and serializes exact API parameters", () => {
    const parsed = readCatalogFilters(
      new URLSearchParams("search=%D9%82%D8%B1%D8%A2%D9%86&is_online=no&offset=99999")
    );
    expect(parsed.search).toBe("قرآن");
    expect(parsed.is_online).toBe("");
    expect(parsed.offset).toBe(0);
    const query = catalogQueryParams({ ...filters, search: "قرآن", is_online: "false" });
    expect(query.get("search")).toBe("قرآن");
    expect(query.get("is_online")).toBe("false");
    expect(query.get("limit")).toBe("12");
    expect(query.get("offset")).toBe("0");
  });
});

describe("route and source isolation", () => {
  it("disables preview routes outside development or without explicit opt-in", () => {
    expect(catalogPreviewEnabled({ dev: false, flag: "true" })).toBe(false);
    expect(catalogPreviewEnabled({ dev: true, flag: undefined })).toBe(false);
    expect(catalogPreviewEnabled({ dev: true, flag: "false" })).toBe(false);
    expect(catalogPreviewEnabled({ dev: true, flag: "true" })).toBe(true);
    expect(localCatalogApiAllowed({
      dev: true, routeFlag: "true", apiFlag: "false",
    })).toBe(false);
    expect(localCatalogApiAllowed({
      dev: true, routeFlag: "true", apiFlag: "true",
    })).toBe(true);
  });

  it("keeps a valid synthetic page entirely offline", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const page = syntheticCatalogPage(filters);
    expect(page.items).toHaveLength(PAGE_SIZE);
    expect(page.items[0].id).toBe(91001);
    expect(syntheticCatalogDetail(91001)?.id).toBe(91001);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("synthetic search and pagination", () => {
  it("filters name, category and modality without generating a total count", () => {
    const searched = syntheticCatalogPage({ ...filters, search: "روخوانی" });
    expect(searched.items.length).toBeGreaterThan(0);
    expect(searched.items.every((course) => course.name.includes("روخوانی"))).toBe(true);
    const category = syntheticCatalogPage({ ...filters, category: "تجوید" });
    expect(category.items.length).toBeGreaterThan(0);
    expect(category.items.every((course) => course.category === "تجوید")).toBe(true);
    const modality = syntheticCatalogPage({ ...filters, is_online: "false" });
    expect(modality.items.every((course) => !course.is_online)).toBe(true);
    const nextPage = syntheticCatalogPage({ ...filters, offset: PAGE_SIZE });
    expect(nextPage.items).toHaveLength(PAGE_SIZE);
    expect(nextPage.items[0].id).not.toBe(91001);
    expect(syntheticCourses.length).toBeGreaterThan(PAGE_SIZE * 2);
    expect(Object.keys(nextPage).sort()).toEqual(["items", "limit", "offset"]);
  });

  it("renders the Persian listing and supports next-page navigation", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    showPreview();
    expect(await screen.findByRole("heading", { name: "دوره‌های آموزشی" })).toBeTruthy();
    expect(await screen.findAllByRole("link", { name: /مشاهده جزئیات/ })).toHaveLength(12);
    fireEvent.click(screen.getByRole("button", { name: "صفحه بعد" }));
    await waitFor(() => {
      expect(screen.getByLabelText("شماره صفحه").textContent).toContain("۲");
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.getByText(/داده‌های مصنوعی/)).toBeTruthy();
  });

  it("searches using the URL-backed form, then resets the filters", async () => {
    showPreview();
    await screen.findAllByRole("link", { name: /مشاهده جزئیات/ });
    fireEvent.change(screen.getByRole("textbox", { name: "جستجوی نام دوره" }), {
      target: { value: "وقف و ابتدا" },
    });
    fireEvent.click(screen.getByRole("button", { name: "جستجو" }));
    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: /مشاهده جزئیات/ })).toHaveLength(1);
    });
    fireEvent.click(screen.getByRole("button", { name: "پاک کردن فیلترها" }));
    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: /مشاهده جزئیات/ })).toHaveLength(12);
    });
  });

  it("renders accessible Persian details and a back link", async () => {
    showPreview("/__preview/catalog/91001?category=%D9%82%D8%B1%D8%A2%D9%86");
    expect(await screen.findByRole("heading", { name: /روخوانی قرآن/ })).toBeTruthy();
    const back = screen.getByRole("link", { name: "بازگشت به فهرست دوره‌ها" });
    expect(back.getAttribute("href")).toContain("category=");
    expect(screen.queryByRole("button", { name: /ثبت‌نام|پرداخت/ })).toBeNull();
  });

  it("rejects invalid IDs before any API request and handles missing IDs", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const view = showPreview("/__preview/catalog/not-an-id?source=api");
    expect(await screen.findByText("شناسه دوره معتبر نیست.")).toBeTruthy();
    expect(fetchSpy).not.toHaveBeenCalled();
    view.unmount();
    showPreview("/__preview/catalog/999999");
    expect(await screen.findByText("دوره موردنظر پیدا نشد.")).toBeTruthy();
  });
});

describe("opt-in API adapter", () => {
  it("makes only same-origin GET requests with omitted credentials", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: async () => ({ items: [syntheticCourses[0]], limit: 12, offset: 0 }),
    });
    vi.stubGlobal("fetch", mockFetch);
    const result = await fetchCatalogPage({ ...filters, search: "قرآن" });
    expect(result.items).toHaveLength(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toMatch(/^\/api\/v2\/catalog\/courses\?/);
    expect(url).toContain("search=");
    expect(options).toMatchObject({ method: "GET", credentials: "omit" });
    expect(options.headers.Accept).toBe("application/json");
  });

  it("maps detail 404 to null and rejects invalid responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    expect(await fetchCatalogDetail(999999)).toBeNull();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ id: 1, teacher_phone: "private" }),
    }));
    await expect(fetchCatalogDetail(1)).rejects.toThrow("پاسخ دوره معتبر نیست.");
  });

  it("supports abort signals without swallowing cancellation", async () => {
    const aborted = new DOMException("Aborted", "AbortError");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(aborted));
    await expect(fetchCatalogPage(filters)).rejects.toMatchObject({ name: "AbortError" });
  });
});
