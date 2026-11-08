export const LOCAL_DEMO_AUTH_API = "/api/local-demo/auth/v1";

export class LocalDemoApiError extends Error {
  constructor(status, operation) {
    super("Local demo authentication request failed");
    this.name = "LocalDemoApiError";
    this.status = status;
    this.operation = operation;
  }
}

async function requestJson(path, { method = "GET", body, signal, operation } = {}) {
  let response;
  try {
    response = await fetch(`${LOCAL_DEMO_AUTH_API}${path}`, {
      method,
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      ...(signal ? { signal } : {}),
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new LocalDemoApiError(0, operation);
  }

  if (!response.ok) throw new LocalDemoApiError(response.status, operation);
  if (response.status === 204) return null;

  try {
    return await response.json();
  } catch {
    throw new LocalDemoApiError(502, operation);
  }
}

function accountFromResponse(payload, operation) {
  if (
    !payload ||
    typeof payload.alias !== "string" ||
    !["student", "teacher"].includes(payload.role)
  ) {
    throw new LocalDemoApiError(502, operation);
  }
  return { alias: payload.alias, role: payload.role };
}

export const localDemoAuthApi = {
  async login(alias, password) {
    const payload = await requestJson("/login", {
      method: "POST",
      body: { alias, password },
      operation: "login",
    });
    return accountFromResponse(payload, "login");
  },

  async currentUser({ signal } = {}) {
    const payload = await requestJson("/me", { signal, operation: "session" });
    return accountFromResponse(payload, "session");
  },

  async logout() {
    return requestJson("/logout", { method: "POST", operation: "logout" });
  },

  async createOtpChallenge(alias) {
    const payload = await requestJson("/otp/challenges", {
      method: "POST",
      body: { alias },
      operation: "otp-request",
    });
    if (
      typeof payload?.challenge_id !== "string" ||
      typeof payload?.expires_in !== "number"
    ) {
      throw new LocalDemoApiError(502, "otp-request");
    }
    return { challengeId: payload.challenge_id, expiresIn: payload.expires_in };
  },

  async verifyOtp(challengeId, code) {
    const payload = await requestJson("/otp/verify", {
      method: "POST",
      body: { challenge_id: challengeId, code },
      operation: "otp-verify",
    });
    return accountFromResponse(payload, "otp-verify");
  },
};

export function localDemoErrorMessage(error, operation) {
  if (!(error instanceof LocalDemoApiError)) {
    return "در اتصال به سرویس نمایشی محلی مشکلی پیش آمد. سرویس را بررسی و دوباره تلاش کنید.";
  }
  if (error.status === 0 || error.status >= 500) {
    return "سرویس نمایشی محلی در دسترس نیست. اتصال محلی را بررسی و دوباره تلاش کنید.";
  }
  if (error.status === 429) {
    return "تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.";
  }
  if (error.status === 401 && operation === "login") {
    return "شناسه یا گذرواژهٔ آزمایشی معتبر نیست.";
  }
  if (error.status === 400 && operation === "otp-verify") {
    return "کد یا درخواست ورود نامعتبر است یا مهلت آن پایان یافته است.";
  }
  return "درخواست انجام نشد. اطلاعات را بررسی و دوباره تلاش کنید.";
}
