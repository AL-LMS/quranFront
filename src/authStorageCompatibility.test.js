import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import "./api/axios";
import AuthContext from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./layouts/dashboard/Navbar";

function CurrentPath() {
  const location = useLocation();
  return <output data-testid="current-path">{location.pathname}</output>;
}

function AuthSnapshot() {
  const { auth, user, role } = React.useContext(AuthContext);
  return (
    <output data-testid="auth-snapshot">
      {JSON.stringify({ auth, user, role })}
    </output>
  );
}

const responseErrorHandler = () =>
  axios.interceptors.response.handlers.at(-1).rejected;

describe("authentication storage behavior", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", JSON.stringify("synthetic-token"));
    localStorage.setItem(
      "user",
      JSON.stringify({ first_name: "Synthetic", last_name: "Learner", role: "student" })
    );
    localStorage.setItem("role", JSON.stringify({ name: "student" }));
    localStorage.setItem("phone", JSON.stringify("0000000000"));
    localStorage.setItem("time", "90");
    localStorage.setItem("dnq", "synthetic-date");
    localStorage.setItem("dtab", "1");
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("logs out, resets all auth context values, preserves feature data, and navigates to OTP", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/panel/dashboard"]}>
          <Routes>
            <Route
              path="/panel/dashboard"
              element={<Navbar setSidebar={() => {}} />}
            />
            <Route path="/send-otp" element={<div>OTP entry</div>} />
          </Routes>
          <AuthSnapshot />
          <CurrentPath />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Synthetic Learner" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "خروج" }));

    expect(screen.getByText("OTP entry")).toBeTruthy();
    expect(screen.getByTestId("current-path").textContent).toBe("/send-otp");
    expect(screen.getByTestId("auth-snapshot").textContent).toBe(
      JSON.stringify({ auth: null, user: null, role: null })
    );
    ["token", "user", "role", "phone"].forEach((key) =>
      expect(localStorage.getItem(key)).toBeNull()
    );
    expect(localStorage.getItem("time")).toBe("90");
    expect(localStorage.getItem("dnq")).toBe("synthetic-date");
    expect(localStorage.getItem("dtab")).toBe("1");
  });

  it("preserves the existing global 401 cleanup and reload policy", async () => {
    const reload = vi.fn();
    vi.stubGlobal("window", { location: { reload } });
    const error = { response: { status: 401 } };

    await expect(responseErrorHandler()(error)).rejects.toBe(error);

    ["token", "user", "role", "phone"].forEach((key) =>
      expect(localStorage.getItem(key)).toBeNull()
    );
    expect(localStorage.getItem("time")).toBe("90");
    expect(reload).toHaveBeenCalledOnce();
  });

  it.each([
    ["403 responses", { response: { status: 403 } }],
    ["network errors", { request: {} }],
  ])("does not clear auth or reload on %s", async (_label, error) => {
    const reload = vi.fn();
    vi.stubGlobal("window", { location: { reload } });

    await expect(responseErrorHandler()(error)).rejects.toBe(error);

    expect(localStorage.getItem("token")).toBe(JSON.stringify("synthetic-token"));
    expect(localStorage.getItem("user")).toBe(
      JSON.stringify({ first_name: "Synthetic", last_name: "Learner", role: "student" })
    );
    expect(localStorage.getItem("role")).toBe(JSON.stringify({ name: "student" }));
    expect(reload).not.toHaveBeenCalled();
  });

  it("retains the existing global behavior for a public 401 without an auth token", async () => {
    const reload = vi.fn();
    vi.stubGlobal("window", { location: { reload } });
    ["token", "user", "role", "phone"].forEach((key) =>
      localStorage.removeItem(key)
    );
    const error = { response: { status: 401 }, config: { url: "/public/catalog" } };

    await expect(responseErrorHandler()(error)).rejects.toBe(error);

    expect(reload).toHaveBeenCalledOnce();
    expect(localStorage.getItem("time")).toBe("90");
  });
});
