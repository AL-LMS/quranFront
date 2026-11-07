import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import CatalogPreviewPage from "./CatalogPreviewPage";
import AuthContext from "../../context/AuthContext";
import Login from "../../pages/site/Login";
import Navbar from "../../layouts/site/Navbar";
import Sidebar from "../../layouts/site/Sidebar";
import { getCatalogVisual } from "./catalogVisuals";
import { syntheticCourses } from "./catalogFixtures";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function showCatalog(path = "/__preview/catalog") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/__preview/catalog" element={<><CatalogPreviewPage /><CurrentPath /></>} />
      </Routes>
    </MemoryRouter>
  );
}

function CurrentPath() {
  const location = useLocation();
  return (
    <>
      <output data-testid="current-path">{location.pathname}</output>
      <output data-testid="current-search">{location.search}</output>
    </>
  );
}

function showNavbar(user = null, initialPath = "/") {
  return render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Navbar />
        <CurrentPath />
      </MemoryRouter>
    </AuthContext.Provider>
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
    expect(new URLSearchParams(screen.getByTestId("current-search").textContent).get("category")).toBe("تجوید");
    fireEvent.click(screen.getByRole("button", { name: "حضوری" }));
    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: /مشاهده جزئیات/ })).toHaveLength(5);
    });
    const activeFilters = new URLSearchParams(screen.getByTestId("current-search").textContent);
    expect(activeFilters.get("is_online")).toBe("false");
    fireEvent.click(screen.getByRole("button", { name: "پاک کردن فیلترها" }));
    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: /مشاهده جزئیات/ })).toHaveLength(12);
    });
    expect(network).not.toHaveBeenCalled();
  });

  it("keeps search, pagination and detail return state in the URL", async () => {
    showCatalog("/__preview/catalog?search=%D9%82%D8%B1%D8%A2%D9%86");
    const links = await screen.findAllByRole("link", { name: /مشاهده جزئیات/ });
    expect(links[0].getAttribute("href")).toContain("search=");

    fireEvent.click(screen.getByRole("button", { name: "پاک کردن فیلترها" }));
    await waitFor(() => expect(screen.getAllByRole("link", { name: /مشاهده جزئیات/ })).toHaveLength(12));
    fireEvent.click(screen.getByRole("button", { name: "صفحه بعد" }));
    await waitFor(() => {
      expect(new URLSearchParams(screen.getByTestId("current-search").textContent).get("offset")).toBe("12");
    });
    fireEvent.click(screen.getByRole("button", { name: "صفحه قبل" }));
    await waitFor(() => expect(screen.getByTestId("current-path").textContent).toBe("/__preview/catalog"));
  });

  it("has semantic search and a clear course navigation target", async () => {
    showCatalog();
    expect(await screen.findByRole("heading", { name: "دوره‌های آموزشی" })).toBeTruthy();
    expect(screen.getByRole("searchbox", { name: "جستجوی نام دوره" })).toBeTruthy();
    const links = await screen.findAllByRole("link", { name: /مشاهده جزئیات/ });
    expect(links[0].getAttribute("href")).toMatch(/^\/__preview\/catalog\/91001/);
    expect(await screen.findAllByText("نمونه نمایشی")).toHaveLength(12);
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

  it("routes guest login and signup links to their public pages", async () => {
    showNavbar();
    const login = screen.getByRole("link", { name: "ورود" });
    const signup = screen.getByRole("link", { name: "همکاری" });
    expect(login.getAttribute("href")).toBe("/login");
    expect(signup.getAttribute("href")).toBe("/signup");

    fireEvent.click(login);
    await waitFor(() => expect(screen.getByTestId("current-path").textContent).toBe("/login"));
    fireEvent.click(signup);
    await waitFor(() => expect(screen.getByTestId("current-path").textContent).toBe("/signup"));
  });

  it.each(["student", "teacher"])(
    "routes an authenticated %s to the existing dashboard",
    async (role) => {
      showNavbar({ role, first_name: "مریم", last_name: "رضایی" });
      const dashboard = screen.getByRole("link", { name: "مریم رضایی" });
      expect(dashboard.getAttribute("href")).toBe("/panel/dashboard");
      expect(screen.queryByRole("link", { name: "همکاری" })).toBeNull();
      fireEvent.click(dashboard);
      await waitFor(() => expect(screen.getByTestId("current-path").textContent).toBe("/panel/dashboard"));
    }
  );

  it("keeps the existing password-to-OTP route available without sending a request", () => {
    render(
      <AuthContext.Provider value={{ user: null }}>
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByRole("link", { name: "ورود با پیامک" }).getAttribute("href")).toBe("/send-otp");
  });

  it.each([
    [null, ["ورود", "ثبت‌نام"], false],
    [{ role: "student", first_name: "مریم", last_name: "رضایی" }, ["مریم رضایی"], true],
    [{ role: "teacher", first_name: "علی", last_name: "نمونه" }, ["علی نمونه"], true],
    [{ role: "admin", first_name: "کاربر" }, ["ورود", "ثبت‌نام"], false],
  ])("shows account links appropriate to the current user", (user, expectedLinks, canOpenDashboard) => {
    render(
      <AuthContext.Provider value={{ user }}>
        <MemoryRouter initialEntries={["/"]}>
          <Sidebar sidebar setSidebar={vi.fn()} />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    const renderedLinks = expectedLinks.map((label) => screen.getByRole("link", { name: label }));
    const expectedHrefs = expectedLinks.map((label) =>
      label === "ورود" ? "/login" : label === "ثبت‌نام" ? "/signup" : "/panel/dashboard"
    );
    expect(renderedLinks.map((link) => link.getAttribute("href"))).toEqual(expectedHrefs);
    expect(Boolean(screen.queryByRole("link", { name: "ورود" }))).toBe(!canOpenDashboard);
    expect(Boolean(screen.queryByRole("link", { name: "ثبت‌نام" }))).toBe(!canOpenDashboard);
  });

  it("opens the mobile menu with a keyboard-focusable control and closes it explicitly", async () => {
    showNavbar();
    const openButton = screen.getByRole("button", { name: "باز کردن فهرست" });
    expect(openButton.tabIndex).toBe(0);
    expect(openButton.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(openButton);
    expect(await screen.findByRole("navigation", { name: "ناوبری موبایل" })).toBeTruthy();
    expect(openButton.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "بستن فهرست" }));
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "ناوبری موبایل" })).toBeNull());
  });
});
