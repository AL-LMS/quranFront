import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CatalogPreviewPage from "./CatalogPreviewPage";
import CatalogDetailPreviewPage from "./CatalogDetailPreviewPage";

const publicCourse = {
  id: 91001,
  name: "آموزش روخوانی قرآن",
  summary: "آشنایی با حروف و تمرین خواندن آیات ساده.",
  category: "قرآن",
  is_online: true,
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function enableLocalApi() {
  vi.stubEnv("VITE_ENABLE_CATALOG_UI_PREVIEW", "true");
  vi.stubEnv("VITE_ALLOW_CATALOG_LOCAL_API", "true");
}

function view(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/__preview/catalog" element={<CatalogPreviewPage />} />
        <Route path="/__preview/catalog/:id" element={<CatalogDetailPreviewPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Catalog-06: local V2 API preview integration", () => {
  it("requests the real candidate endpoint through a same-origin browser path", async () => {
    enableLocalApi();
    const response = {
      items: [{ ...publicCourse, approval_status: "approved", private_teacher: "not public" }],
      limit: 12,
      offset: 0,
    };
    const fetcher = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => response,
    });
    vi.stubGlobal("fetch", fetcher);

    view("/__preview/catalog?source=api");
    expect(await screen.findByRole("link", { name: /مشاهده جزئیات آموزش روخوانی قرآن/ })).toBeTruthy();
    expect(screen.getByText("حالت آزمایشی API محلی")).toBeTruthy();

    const [url, options] = fetcher.mock.calls[0];
    expect(url).toMatch(/^\/api\/v2\/catalog\/courses\?/);
    expect(url).toContain("limit=12");
    expect(url).toContain("offset=0");
    expect(options).toMatchObject({ method: "GET", credentials: "omit" });
    expect(screen.queryByText("not public")).toBeNull();
    expect(screen.queryByText("approved")).toBeNull();
  });

  it("keeps API mode disabled when its second opt-in is not present", async () => {
    vi.stubEnv("VITE_ENABLE_CATALOG_UI_PREVIEW", "true");
    vi.stubEnv("VITE_ALLOW_CATALOG_LOCAL_API", "false");
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);

    view("/__preview/catalog?source=api");
    expect(await screen.findAllByRole("link", { name: /مشاهده جزئیات/ })).toHaveLength(12);
    expect(fetcher).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "API محلی" })).toBeNull();
  });

  it("shows an explicit retry when the disposable API is offline", async () => {
    enableLocalApi();
    const fetcher = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({
        ok: true, status: 200,
        json: async () => ({ items: [publicCourse], limit: 12, offset: 0 }),
      });
    vi.stubGlobal("fetch", fetcher);

    view("/__preview/catalog?source=api");
    expect(await screen.findByText("دریافت اطلاعات دوره ناموفق بود.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "تلاش مجدد" }));
    expect(await screen.findByRole("link", { name: /مشاهده جزئیات آموزش روخوانی قرآن/ })).toBeTruthy();
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("returns 404 and hides synthetic-only detail data when API is selected", async () => {
    enableLocalApi();
    const fetcher = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    vi.stubGlobal("fetch", fetcher);
    view("/__preview/catalog/999999?source=api");
    expect(await screen.findByText("دوره موردنظر پیدا نشد.")).toBeTruthy();
    expect(fetcher.mock.calls[0][0]).toBe("/api/v2/catalog/courses/999999");
  });

  it("rejects an invalid detail ID before making any HTTP request", async () => {
    enableLocalApi();
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    view("/__preview/catalog/invalid?source=api");
    expect(await screen.findByText("شناسه دوره معتبر نیست.")).toBeTruthy();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("sends category filtering only as bounded parameters", async () => {
    enableLocalApi();
    const fetcher = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: async () => ({ items: [publicCourse], limit: 12, offset: 0 }),
    });
    vi.stubGlobal("fetch", fetcher);
    view("/__preview/catalog?source=api&category=%D9%82%D8%B1%D8%A2%D9%86&is_online=true");
    await waitFor(() => expect(fetcher).toHaveBeenCalled());
    const [url] = fetcher.mock.calls[0];
    expect(new URL(url, "http://localhost").searchParams.get("category")).toBe("قرآن");
    expect(new URL(url, "http://localhost").searchParams.get("is_online")).toBe("true");
  });
});
