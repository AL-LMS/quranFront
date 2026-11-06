import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CatalogPreviewPage from "./CatalogPreviewPage";
import Sidebar from "../../layouts/site/Sidebar";
import { getCatalogVisual } from "./catalogVisuals";
import { syntheticCourses } from "./catalogFixtures";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function showCatalog() {
  return render(
    <MemoryRouter initialEntries={["/__preview/catalog"]}>
      <Routes>
        <Route path="/__preview/catalog" element={<CatalogPreviewPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("catalog discovery UX", () => {
  it("uses distinct, accessible category themes without fake image URLs", () => {
    const quran = getCatalogVisual("قرآن");
    const tajweed = getCatalogVisual("تجوید");
    const meanings = getCatalogVisual("مفاهیم");
    expect(new Set([quran.accent, tajweed.accent, meanings.accent]).size).toBe(3);
    expect(getCatalogVisual("other").accent).toMatch(/^#/);
    expect(syntheticCourses.some((course) => course.summary === null)).toBe(true);
    expect(new Set(syntheticCourses.map((course) => course.summary)).size).toBeGreaterThan(10);
    expect(syntheticCourses.every((course) => !course.name.startsWith("نمونه آموزشی —"))).toBe(true);
  });

  it("switches category and modality with one tap and resets both filters", async () => {
    const network = vi.fn();
    vi.stubGlobal("fetch", network);
    showCatalog();
    expect(await screen.findAllByRole("link", { name: /مشاهده جزئیات/ })).toHaveLength(12);
    fireEvent.click(screen.getByRole("button", { name: "تجوید" }));
    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: /مشاهده جزئیات/ })).toHaveLength(8);
    });
    fireEvent.click(screen.getByRole("button", { name: "حضوری" }));
    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: /مشاهده جزئیات/ })).toHaveLength(5);
    });
    fireEvent.click(screen.getByRole("button", { name: "پاک کردن فیلترها" }));
    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: /مشاهده جزئیات/ })).toHaveLength(12);
    });
    expect(network).not.toHaveBeenCalled();
  });

  it("has semantic search and a clear course navigation target", async () => {
    showCatalog();
    expect(await screen.findByRole("heading", { name: "دوره‌های آموزشی" })).toBeTruthy();
    expect(screen.getByRole("searchbox", { name: "جستجوی نام دوره" })).toBeTruthy();
    const links = await screen.findAllByRole("link", { name: /مشاهده جزئیات/ });
    expect(links[0].getAttribute("href")).toMatch(/^\/__preview\/catalog\/91001/);
    expect(screen.queryByText(/پرداخت آنلاین/)).toBeNull();
  });
});

describe("mobile navigation", () => {
  it("renders usable menu links and offers an explicit close action", () => {
    const closeMenu = vi.fn();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Sidebar sidebar={true} setSidebar={closeMenu} />
      </MemoryRouter>
    );
    expect(screen.getByRole("navigation", { name: "ناوبری موبایل" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "صفحه اصلی" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "سوالات پرتکرار" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "ورود" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "بستن فهرست" }));
    expect(closeMenu).toHaveBeenCalledWith(false);
  });
});
