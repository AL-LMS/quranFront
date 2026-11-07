import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

const auth = vi.hoisted(() => ({ current: { user: null } }));
vi.mock("../../hooks/useAuth", () => ({ default: () => auth.current }));

afterEach(() => {
  cleanup();
  auth.current = { user: null };
});

function renderNavbar(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  );
}

describe("site navigation compatibility", () => {
  it("sends a guest to the real login route and keeps signup available", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: "ورود" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "همکاری" })).toHaveAttribute("href", "/signup");
  });

  it.each([
    ["student", "سارا دانشجو"],
    ["teacher", "علی آموزگار"],
  ])("shows the %s identity and dashboard without guest links", (role, name) => {
    auth.current = { user: { role, first_name: name.split(" ")[0], last_name: name.split(" ")[1] } };
    renderNavbar();
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", "/panel/dashboard");
    expect(screen.queryByRole("link", { name: "همکاری" })).not.toBeInTheDocument();
  });

  it("preserves the signup and OTP recovery cross-links", () => {
    renderNavbar("/send-otp");
    expect(screen.getByRole("link", { name: "ثبت‌نام" })).toHaveAttribute("href", "/signup");
    cleanup();
    renderNavbar("/signup");
    expect(screen.getByRole("link", { name: "ورود" })).toHaveAttribute("href", "/send-otp");
  });

  it("opens the right-anchored RTL drawer and closes it by Escape", async () => {
    renderNavbar();
    const trigger = screen.getByRole("button", { name: "باز کردن فهرست" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(await screen.findByRole("navigation", { name: "ناوبری موبایل" })).toBeInTheDocument();
    expect(screen.getByRole("presentation")).toHaveAttribute("aria-label", "فهرست ناوبری");
    expect(screen.getByRole("link", { name: "ورود" })).toHaveAttribute("href", "/login");
    fireEvent.keyDown(screen.getByRole("presentation"), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "ناوبری موبایل" })).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
  });

  it("closes after selecting a link and gives authenticated users a dashboard link", async () => {
    auth.current = { user: { role: "teacher", first_name: "علی", last_name: "آموزگار" } };
    renderNavbar();
    fireEvent.click(screen.getByRole("button", { name: "باز کردن فهرست" }));
    const dashboardLink = await screen.findByRole("link", { name: "علی آموزگار" });
    expect(dashboardLink).toHaveAttribute("href", "/panel/dashboard");
    expect(screen.queryByRole("link", { name: "ثبت‌نام" })).not.toBeInTheDocument();
    fireEvent.click(dashboardLink);
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "ناوبری موبایل" })).not.toBeInTheDocument());
  });
});
