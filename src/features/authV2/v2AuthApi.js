// M3-AUTH-01: candidate V2 contract, NEVER a legacy /back_request fallback.
// Only loaded by the explicit development-only synthetic preview route.
const PREFIX = "/api/v2/auth";

export class V2AuthApiError extends Error {
  constructor(status, code = "request_failed") {
    super("V2 authentication request failed");
    this.name = "V2AuthApiError";
    this.status = status;
    this.code = code;
  }
}

export function createV2AuthApi({ fetcher = (...args) => fetch(...args) } = {}) {
  async function json(path, { method = "GET", body, csrf = true } = {}) {
    let response;
    try {
      const headers = { Accept: "application/json" };
      if (body !== undefined) headers["Content-Type"] = "application/json";
      if (method !== "GET" && csrf) {
        // Candidate synchronizer endpoint; server controls token issuance/rotation.
        // Fail closed if it is unavailable. Do not store CSRF tokens in localStorage.
        const csrfResponse = await fetcher(`${PREFIX}/csrf`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!csrfResponse.ok) throw new V2AuthApiError(csrfResponse.status, "csrf_unavailable");
        const csrfPayload = await csrfResponse.json();
        if (typeof csrfPayload?.csrf_token !== "string" || !csrfPayload.csrf_token) {
          throw new V2AuthApiError(502, "csrf_unavailable");
        }
        headers["X-CSRF-Token"] = csrfPayload.csrf_token;
      }
      response = await fetcher(`${PREFIX}${path}`, {
        method,
        credentials: "include",
        cache: "no-store",
        headers,
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    } catch (error) {
      if (error instanceof V2AuthApiError) throw error;
      throw new V2AuthApiError(0, "network_error");
    }
    if (!response.ok) {
      // Do not expose server error bodies which may include user identifiers.
      throw new V2AuthApiError(response.status);
    }
    if (response.status === 204) return null;
    try {
      return await response.json();
    } catch {
      throw new V2AuthApiError(502, "invalid_response");
    }
  }

  function challenge(payload) {
    if (typeof payload?.challenge_id !== "string" || !payload.challenge_id ||
        typeof payload.expires_in !== "number" || payload.expires_in <= 0) {
      throw new V2AuthApiError(502, "invalid_response");
    }
    return { challengeId: payload.challenge_id, expiresIn: payload.expires_in };
  }

  function subject(payload) {
    if (typeof payload?.account_id !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.account_id) ||
        !["student", "teacher", "admin"].includes(payload.role)) {
      throw new V2AuthApiError(502, "invalid_response");
    }
    return { accountId: payload.account_id, role: payload.role, firstName: payload.first_name || "" };
  }

  return Object.freeze({
    async signup({ phone, password, firstName, lastName }) {
      return challenge(await json("/signup", {
        method: "POST", body: { phone, password, first_name: firstName, last_name: lastName },
      }));
    },
    async verifyPhone(challengeId, code) {
      const payload = await json("/phone/verify", {
        method: "POST", body: { challenge_id: challengeId, code },
      });
      if (payload?.phone_verified !== true || typeof payload.account_id !== "string") {
        throw new V2AuthApiError(502, "invalid_response");
      }
      return { accountId: payload.account_id };
    },
    async signinPassword(phone, password) {
      return subject(await json("/signin/password", { method: "POST", body: { phone, password } }));
    },
    async requestSigninOtp(phone) {
      return challenge(await json("/signin/otp/request", { method: "POST", body: { phone } }));
    },
    async signinOtp(challengeId, code) {
      return subject(await json("/signin/otp/verify", {
        method: "POST", body: { challenge_id: challengeId, code },
      }));
    },
    async me() { return subject(await json("/me")); },
    async logout() { return json("/logout", { method: "POST" }); },
    async requestRecovery(phone) {
      const payload = await json("/recovery/requests", { method: "POST", body: { phone } });
      if (typeof payload?.case_id !== "string" || !payload.case_id) {
        throw new V2AuthApiError(502, "invalid_response");
      }
      return { caseId: payload.case_id };
    },
  });
}

export const v2AuthApi = createV2AuthApi();

export function v2AuthErrorMessage(error) {
  if (!(error instanceof V2AuthApiError)) return "درخواست انجام نشد. دوباره تلاش کنید.";
  if (error.status === 429) return "درخواست‌ها بیش از حد مجاز است؛ کمی بعد دوباره تلاش کنید.";
  if ([400, 401, 403].includes(error.status)) return "اطلاعات یا کد واردشده معتبر نیست.";
  return "سرویس آزمایشی احراز هویت در دسترس نیست. لطفاً بعداً تلاش کنید.";
}
