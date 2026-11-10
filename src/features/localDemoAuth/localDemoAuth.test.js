import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LocalDemoAuthRoutes from "./LocalDemoAuthRoutes";

const apiUrl = "/api/local-demo/auth/v1";
const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
const noContent = () => new Response(null, { status: 204 });

function renderRoutes(path = "/local-demo/login") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/local-demo/*" element={<LocalDemoAuthRoutes />} />
      </Routes>
    </MemoryRouter>
  );
}

function unauthorizedSession() {
  return vi.fn(async (url) => {
    if (url === `${apiUrl}/me`) return jsonResponse({ detail: "unauthorized" }, 401);
    throw new Error("unexpected request");
  });
}

describe("local-demo authentication flow", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", unauthorizedSession());
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("logs in a synthetic student with same-origin cookie credentials", async () => {
    const fetchMock = vi.fn(async (url) => {
      if (url === `${apiUrl}/me`) return jsonResponse({ detail: "unauthorized" }, 401);
      if (url === `${apiUrl}/login`) return jsonResponse({ alias: "student-01", role: "student" });
      throw new Error("unexpected request");
    });
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem("unrelated", "preserved");

    renderRoutes();
    await screen.findByLabelText("شناسهٔ حساب");
    fireEvent.change(screen.getByLabelText("شناسهٔ حساب"), { target: { value: "student-01" } });
    fireEvent.change(screen.getByLabelText("گذرواژه"), { target: { value: "synthetic-password" } });
    fireEvent.click(screen.getByRole("button", { name: "ورود" }));

    expect(await screen.findByRole("heading", { name: "داشبورد نمایشی" })).toBeTruthy();
    expect(screen.getByText("student-01")).toBeTruthy();
    expect(screen.getByText("دانش‌آموز ساختگی")).toBeTruthy();
    const loginCall = fetchMock.mock.calls.find(([url]) => url === `${apiUrl}/login`);
    expect(loginCall[1].credentials).toBe("include");
    expect(JSON.parse(loginCall[1].body)).toEqual({ alias: "student-01", password: "synthetic-password" });
    expect(localStorage.getItem("unrelated")).toBe("preserved");
    expect(localStorage.getItem("token")).toBeNull();
    expect(sessionStorage.length).toBe(0);
  });

  it("rejects invalid credentials without displaying the server body", async () => {
    const fetchMock = vi.fn(async (url) => {
      if (url === `${apiUrl}/me`) return jsonResponse({}, 401);
      if (url === `${apiUrl}/login`) return jsonResponse({ detail: "private backend text" }, 401);
      throw new Error("unexpected request");
    });
    vi.stubGlobal("fetch", fetchMock);
    renderRoutes();
    await screen.findByLabelText("شناسهٔ حساب");
    fireEvent.change(screen.getByLabelText("شناسهٔ حساب"), { target: { value: "teacher-01" } });
    fireEvent.change(screen.getByLabelText("گذرواژه"), { target: { value: "wrong-password" } });
    fireEvent.click(screen.getByRole("button", { name: "ورود" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("شناسه یا گذرواژهٔ آزمایشی معتبر نیست");
    expect(screen.queryByText("private backend text")).toBeNull();
  });

  it("creates and verifies a local OTP challenge without calling the test inbox", async () => {
    const fetchMock = vi.fn(async (url) => {
      if (url === `${apiUrl}/me`) return jsonResponse({}, 401);
      if (url === `${apiUrl}/otp/challenges`) {
        return jsonResponse({ challenge_id: "synthetic-challenge-id-1234567890", expires_in: 300 }, 202);
      }
      if (url === `${apiUrl}/otp/verify`) {
        return jsonResponse({ alias: "teacher-02", role: "teacher", session_expires_in: 28800 });
      }
      throw new Error("unexpected request");
    });
    vi.stubGlobal("fetch", fetchMock);
    renderRoutes("/local-demo/otp");
    await screen.findByLabelText("شناسهٔ حساب ساختگی");
    fireEvent.change(screen.getByLabelText("شناسهٔ حساب ساختگی"), { target: { value: "teacher-02" } });
    fireEvent.click(screen.getByRole("button", { name: "دریافت درخواست کد" }));
    expect(await screen.findByTestId("challenge-id")).toHaveTextContent("synthetic-challenge-id-1234567890");
    fireEvent.change(screen.getByLabelText("کد شش‌رقمی"), { target: { value: "۱۲۳۴۵۶" } });
    fireEvent.click(screen.getByRole("button", { name: "تأیید کد" }));
    expect(await screen.findByRole("heading", { name: "داشبورد نمایشی" })).toBeTruthy();
    expect(screen.getByText("teacher-02")).toBeTruthy();
    expect(screen.getByText("مدرس ساختگی")).toBeTruthy();
    const verifyCall = fetchMock.mock.calls.find(([url]) => url === `${apiUrl}/otp/verify`);
    expect(verifyCall[1].credentials).toBe("include");
    expect(JSON.parse(verifyCall[1].body)).toEqual({
      challenge_id: "synthetic-challenge-id-1234567890",
      code: "123456",
    });
    expect(fetchMock.mock.calls.some(([url]) => url.includes("test-inbox"))).toBe(false);
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });

  it("restores the server session with GET /me after the local route mounts", async () => {
    const fetchMock = vi.fn(async (url) => {
      if (url === `${apiUrl}/me`) return jsonResponse({ alias: "teacher-01", role: "teacher" });
      throw new Error("unexpected request");
    });
    vi.stubGlobal("fetch", fetchMock);
    renderRoutes("/local-demo/dashboard");
    expect(await screen.findByText("teacher-01")).toBeTruthy();
    const sessionCall = fetchMock.mock.calls.find(([url]) => url === `${apiUrl}/me`);
    expect(sessionCall[1].credentials).toBe("include");
  });

  it("handles an expired or missing server session as unauthenticated", async () => {
    renderRoutes("/local-demo/dashboard");
    expect(await screen.findByLabelText("شناسهٔ حساب")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "داشبورد نمایشی" })).toBeNull();
  });

  it("logs out through the server and returns to the local-demo login", async () => {
    const fetchMock = vi.fn(async (url) => {
      if (url === `${apiUrl}/me`) return jsonResponse({ alias: "student-02", role: "student" });
      if (url === `${apiUrl}/logout`) return noContent();
      throw new Error("unexpected request");
    });
    vi.stubGlobal("fetch", fetchMock);
    renderRoutes("/local-demo/dashboard");
    await screen.findByText("student-02");
    fireEvent.click(screen.getByRole("button", { name: "خروج از نمایش محلی" }));
    expect(await screen.findByLabelText("شناسهٔ حساب")).toBeTruthy();
    const logoutCall = fetchMock.mock.calls.find(([url]) => url === `${apiUrl}/logout`);
    expect(logoutCall[1].credentials).toBe("include");
    expect(logoutCall[1].method).toBe("POST");
  });

  it("fails closed for unsupported roles returned by the API", async () => {
    const fetchMock = vi.fn(async (url) => {
      if (url === `${apiUrl}/me`) return jsonResponse({}, 401);
      if (url === `${apiUrl}/login`) return jsonResponse({ alias: "synthetic", role: "admin" });
      throw new Error("unexpected request");
    });
    vi.stubGlobal("fetch", fetchMock);
    renderRoutes();
    await screen.findByLabelText("شناسهٔ حساب");
    fireEvent.change(screen.getByLabelText("شناسهٔ حساب"), { target: { value: "synthetic" } });
    fireEvent.change(screen.getByLabelText("گذرواژه"), { target: { value: "synthetic-password" } });
    fireEvent.click(screen.getByRole("button", { name: "ورود" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "داشبورد نمایشی" })).toBeNull();
  });

  it("shows a retry state when a stored session cannot be checked", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("network down"); }));
    renderRoutes("/local-demo/dashboard");
    expect(await screen.findByRole("button", { name: "تلاش دوباره" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "داشبورد نمایشی" })).toBeNull();
  });
});
