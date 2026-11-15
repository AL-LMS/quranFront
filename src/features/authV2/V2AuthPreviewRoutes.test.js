import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import V2AuthPreviewRoutes from "./V2AuthPreviewRoutes";

const PREFIX = "/api/v2/auth";
const ACCOUNT_ID = "2edff5af-d232-4000-8000-000000000001";
const PHONE = "09120000001";
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json" },
});

function fixture() {
  let signedIn = false;
  const fetcher = vi.fn(async (url, options) => {
    if (url === `${PREFIX}/csrf`) return json({ csrf_token: "synthetic-csrf" });
    switch (url) {
      case `${PREFIX}/signup`:
        return json({ challenge_id: "signup-challenge", expires_in: 300 }, 202);
      case `${PREFIX}/phone/verify`:
        return json({ account_id: ACCOUNT_ID, phone_verified: true });
      case `${PREFIX}/signin/password`:
      case `${PREFIX}/signin/otp/verify`:
        signedIn = true;
        return json({ account_id: ACCOUNT_ID, role: "student", first_name: "دانش‌آموز" });
      case `${PREFIX}/signin/otp/request`:
        return json({ challenge_id: "signin-challenge", expires_in: 300 }, 202);
      case `${PREFIX}/me`:
        return signedIn ? json({ account_id: ACCOUNT_ID, role: "student" }) : json({}, 401);
      case `${PREFIX}/logout`:
        signedIn = false;
        return new Response(null, { status: 204 });
      case `${PREFIX}/recovery/requests`:
        return json({ case_id: "synthetic-support-case" }, 202);
      default:
        throw new Error(`Unexpected synthetic endpoint: ${url}`);
    }
  });
  return { fetcher, revoke: () => { signedIn = false; } };
}

function renderPreview(path = "signup") {
  return render(
    <MemoryRouter initialEntries={[`/__preview/m3-auth/${path}`]}>
      <Routes>
        <Route path="/__preview/m3-auth/*" element={<V2AuthPreviewRoutes />} />
      </Routes>
    </MemoryRouter>
  );
}

function fill(label, value) {
  fireEvent.change(screen.getByRole("textbox", { name: label }), { target: { value } });
}

function mutationCalls(fetcher) {
  return fetcher.mock.calls.filter(([url]) => url !== `${PREFIX}/csrf` && url !== `${PREFIX}/me`);
}

describe("M3-AUTH-01 Persian synthetic V2 user journeys", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("signs up, verifies Persian OTP without auto-login, signs in with password and logs out", async () => {
    const { fetcher } = fixture();
    vi.stubGlobal("fetch", fetcher);
    renderPreview();

    fill("نام", "دانش");
    fill("نام خانوادگی", "آزمایشی");
    fill("شماره تلفن", "۰۹۱۲ ۰۰۰ ۰۰۰۱");
    fireEvent.change(screen.getByLabelText("رمز عبور"), { target: { value: "synthetic-password" } });
    fireEvent.change(screen.getByLabelText("تکرار رمز عبور"), { target: { value: "synthetic-password" } });
    fireEvent.click(screen.getByRole("button", { name: "ثبت نام" }));

    expect(await screen.findByText("تایید شماره تلفن")).toBeTruthy();
    const signup = mutationCalls(fetcher).find(([url]) => url.endsWith("/signup"));
    expect(JSON.parse(signup[1].body)).toEqual({
      phone: PHONE, first_name: "دانش", last_name: "آزمایشی", password: "synthetic-password",
    });
    fill("کد تایید", "۱۲٣۴۵۶");
    fireEvent.click(screen.getByRole("button", { name: "احراز هویت" }));

    // Phone verification creates no session and cannot enter the dashboard.
    expect(await screen.findByText("ورود به حساب کاربری")).toBeTruthy();
    expect(fetcher.mock.calls.some(([url]) => url === `${PREFIX}/me`)).toBe(false);
    fill("شماره تلفن", PHONE);
    fireEvent.change(screen.getByLabelText("رمز عبور"), { target: { value: "synthetic-password" } });
    fireEvent.click(screen.getByRole("button", { name: "ورود" }));

    expect(await screen.findByRole("heading", { name: "داشبورد آزمایشی ورود نسخهٔ ۲" })).toBeTruthy();
    expect(await screen.findByText(new RegExp(ACCOUNT_ID))).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "خروج از حساب" }));
    expect(await screen.findByText("ورود به حساب کاربری")).toBeTruthy();

    const endpoints = mutationCalls(fetcher).map(([url]) => url.replace(PREFIX, ""));
    expect(endpoints).toEqual(["/signup", "/phone/verify", "/signin/password", "/logout"]);
    const verify = mutationCalls(fetcher).find(([url]) => url.endsWith("/phone/verify"));
    expect(JSON.parse(verify[1].body)).toEqual({ challenge_id: "signup-challenge", code: "123456" });
    expect(fetcher.mock.calls.every(([, options]) => options.credentials === "include")).toBe(true);
    expect(localStorage.getItem("token")).toBeNull();
    expect(sessionStorage.length).toBe(0);
  });

  it("signs in by SMS OTP using the same account and no client-held bearer token", async () => {
    const { fetcher } = fixture();
    vi.stubGlobal("fetch", fetcher);
    renderPreview("send-otp");

    fill("شماره تلفن", "٠٩١٢٠٠٠٠٠٠١");
    fireEvent.click(screen.getByRole("button", { name: "ارسال کد" }));
    expect(await screen.findByText(/کد 6 رقمی/)).toBeTruthy();
    fill("کد", "۱۲۳۴۵۶");
    fireEvent.click(screen.getByRole("button", { name: "ورود" }));
    expect(await screen.findByText(new RegExp(ACCOUNT_ID))).toBeTruthy();

    const calls = mutationCalls(fetcher);
    expect(calls.map(([url]) => url.replace(PREFIX, ""))).toEqual([
      "/signin/otp/request", "/signin/otp/verify",
    ]);
    expect(JSON.parse(calls[0][1].body)).toEqual({ phone: PHONE });
    expect(JSON.parse(calls[1][1].body)).toEqual({ challenge_id: "signin-challenge", code: "123456" });
    expect(localStorage.length).toBe(0);
  });

  it("keeps recovery support-assisted, without SMS password reset or a session", async () => {
    const { fetcher } = fixture();
    vi.stubGlobal("fetch", fetcher);
    renderPreview("recovery");

    fill("شمارهٔ تلفن", "۰۹۱۲۰۰۰۰۰۰۱");
    fireEvent.click(screen.getByRole("button", { name: "ثبت درخواست بررسی" }));
    expect(await screen.findByRole("status")).toHaveTextContent("synthetic-support-case");
    expect(mutationCalls(fetcher).map(([url]) => url)).toEqual([`${PREFIX}/recovery/requests`]);
    expect(localStorage.length).toBe(0);
  });

  it("redirects a revoked or missing server session to login", async () => {
    const { fetcher } = fixture();
    vi.stubGlobal("fetch", fetcher);
    renderPreview("dashboard");
    expect(await screen.findByText("ورود به حساب کاربری")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "داشبورد آزمایشی ورود نسخهٔ ۲" })).toBeNull();
    expect(fetcher.mock.calls.some(([url]) => url === `${PREFIX}/me`)).toBe(true);
  });

  it("allows retry after a transient session-check failure without authenticating locally", async () => {
    const { fetcher } = fixture();
    let failures = 1;
    const flaky = vi.fn(async (url, options) => {
      if (url === `${PREFIX}/me` && failures-- > 0) throw new TypeError("synthetic outage");
      return fetcher(url, options);
    });
    vi.stubGlobal("fetch", flaky);
    renderPreview("dashboard");
    expect(await screen.findByRole("alert")).toHaveTextContent("سرویس آزمایشی");
    fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره" }));
    await waitFor(() => expect(flaky.mock.calls.filter(([url]) => url === `${PREFIX}/me`)).toHaveLength(2));
    expect(await screen.findByText("ورود به حساب کاربری")).toBeTruthy();
  });
});
