import { describe, expect, it, vi } from "vitest";
import { createV2AuthApi, V2AuthApiError, v2AuthErrorMessage } from "./v2AuthApi";
import { v2AuthPreviewEnabled } from "./v2AuthGate";
import { toAsciiDigits, v2DomesticPhoneEntry, v2DomesticPhonePattern } from "./phoneEntry";

const PREFIX = "/api/v2/auth";
const ACCOUNT_ID = "2edff5af-d232-4000-8000-000000000001";
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json" },
});

function mockApi(handlers) {
  const fetcher = vi.fn(async (path, options) => {
    if (path === `${PREFIX}/csrf`) return json({ csrf_token: "synthetic-csrf-token" });
    if (!Object.hasOwn(handlers, path)) throw new Error(`Unexpected endpoint ${path}`);
    return handlers[path](options);
  });
  return { api: createV2AuthApi({ fetcher }), fetcher };
}

describe("M3-AUTH-01 V2 synthetic-only transport", () => {
  it("is disabled in release builds even if the preview flag is set", () => {
    expect(v2AuthPreviewEnabled({ dev: false, enabled: "true" })).toBe(false);
    expect(v2AuthPreviewEnabled({ dev: true, enabled: "false" })).toBe(false);
    expect(v2AuthPreviewEnabled({ dev: true, enabled: "true" })).toBe(true);
  });

  it("sends student signup without role, token or client-supplied account id", async () => {
    const { api, fetcher } = mockApi({
      [`${PREFIX}/signup`]: () => json({ challenge_id: "synthetic-challenge", expires_in: 300 }, 202),
    });
    const result = await api.signup({ phone: "09120000001", password: "test-password",
      firstName: "نام", lastName: "آزمایشی", role: "teacher", accountId: "spoofed" });
    expect(result.challengeId).toBe("synthetic-challenge");
    const request = fetcher.mock.calls.find(([path]) => path.endsWith("/signup"));
    expect(request[1].credentials).toBe("include");
    expect(request[1].headers["X-CSRF-Token"]).toBe("synthetic-csrf-token");
    expect(JSON.parse(request[1].body)).toEqual({
      phone: "09120000001", password: "test-password", first_name: "نام", last_name: "آزمایشی",
    });
    expect(fetcher.mock.calls.every(([path]) => path.startsWith(PREFIX))).toBe(true);
  });

  it("keeps opaque session credential in HttpOnly cookie, not returned JS state", async () => {
    const { api, fetcher } = mockApi({
      [`${PREFIX}/signin/password`]: () => json({ account_id: ACCOUNT_ID, role: "student" }),
      [`${PREFIX}/me`]: () => json({ account_id: ACCOUNT_ID, role: "student" }),
      [`${PREFIX}/logout`]: () => new Response(null, { status: 204 }),
    });
    const subject = await api.signinPassword("09120000001", "password");
    expect(subject).toEqual({ accountId: ACCOUNT_ID, role: "student", firstName: "" });
    expect(await api.me()).toEqual(subject);
    await api.logout();
    const logout = fetcher.mock.calls.find(([path]) => path.endsWith("/logout"));
    expect(logout[1].headers["X-CSRF-Token"]).toBe("synthetic-csrf-token");
    expect(fetcher.mock.calls.every(([, options]) => options.credentials === "include")).toBe(true);
    expect(fetcher.mock.calls.every(([, options]) => options.cache === "no-store")).toBe(true);
  });

  it("fails closed when CSRF is missing (before signup or logout)", async () => {
    const fetcher = vi.fn(async () => json({ detail: "no token" }, 404));
    const api = createV2AuthApi({ fetcher });
    await expect(api.requestSigninOtp("09120000001")).rejects.toMatchObject({
      status: 404, code: "csrf_unavailable",
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("handles OTP request/verify and recovery as separate flows", async () => {
    const { api } = mockApi({
      [`${PREFIX}/signin/otp/request`]: () => json({ challenge_id: "challenge", expires_in: 300 }, 202),
      [`${PREFIX}/signin/otp/verify`]: () => json({ account_id: ACCOUNT_ID, role: "student" }),
      [`${PREFIX}/recovery/requests`]: () => json({ case_id: "support-case" }, 202),
    });
    expect((await api.requestSigninOtp("09120000001")).expiresIn).toBe(300);
    expect((await api.signinOtp("challenge", "123456")).accountId).toBe(ACCOUNT_ID);
    expect(await api.requestRecovery("09120000001")).toEqual({ caseId: "support-case" });
    expect(api.resetPasswordBySms).toBeUndefined();
  });

  it("does not leak unsafe server messages into Persian error UX", async () => {
    const { api } = mockApi({
      [`${PREFIX}/signin/password`]: () => json({ detail: "private debug account info" }, 401),
    });
    let error;
    try { await api.signinPassword("09120000001", "wrong"); } catch (caught) { error = caught; }
    expect(error).toBeInstanceOf(V2AuthApiError);
    expect(error.status).toBe(401);
    expect(v2AuthErrorMessage(error)).not.toContain("private debug");
  });

  it("converts Persian and Arabic-Indic phone/OTP digits without converting international entry", () => {
    expect(v2DomesticPhoneEntry("۰۹۱۲ ۰۰۰-۰۰۰۱")).toBe("09120000001");
    expect(v2DomesticPhoneEntry("٠٩١٢ (٠٠٠) ٠٠٠١")).toBe("09120000001");
    expect(toAsciiDigits("۱۲٣٤۵۶")).toBe("123456");
    expect(v2DomesticPhonePattern.test(v2DomesticPhoneEntry("+۹۸۹۱۲۰۰۰۰۰۰۱"))).toBe(false);
    expect(v2DomesticPhonePattern.test(v2DomesticPhoneEntry("00989120000001"))).toBe(false);
  });
});
