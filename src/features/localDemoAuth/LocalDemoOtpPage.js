import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLocalDemoAuth } from "./LocalDemoAuthContext";
import { localDemoErrorMessage } from "./localDemoApi";

function asciiDigits(value) {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
}

export default function LocalDemoOtpPage() {
  const {
    account,
    status,
    sessionError,
    createOtpChallenge,
    verifyOtp,
    refreshSession,
  } = useLocalDemoAuth();
  const navigate = useNavigate();
  const [alias, setAlias] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "checking") {
    return <p className="local-demo-auth__status" role="status">در حال بررسی نشست نمایشی…</p>;
  }
  if (status === "unavailable") {
    return (
      <section className="local-demo-auth__card" aria-labelledby="local-demo-otp-unavailable">
        <h1 id="local-demo-otp-unavailable">ورود نمایشی در دسترس نیست</h1>
        <p role="alert">{localDemoErrorMessage(sessionError, "session")}</p>
        <button type="button" onClick={() => void refreshSession()}>تلاش دوباره</button>
      </section>
    );
  }
  if (account) return <Navigate to="/local-demo/dashboard" replace />;

  async function requestChallenge(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setChallenge(null);
    setCode("");
    try {
      const result = await createOtpChallenge(alias.trim());
      setChallenge(result);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitCode(event) {
    event.preventDefault();
    if (!challenge) return;
    setSubmitting(true);
    setError(null);
    try {
      await verifyOtp(challenge.challengeId, asciiDigits(code));
      setCode("");
      navigate("/local-demo/dashboard", { replace: true });
    } catch (requestError) {
      setCode("");
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="local-demo-auth__card" aria-labelledby="local-demo-otp-title">
      <h1 id="local-demo-otp-title">ورود با کد محلی</h1>
      <p>کد فقط در صندوق آزمایشی داخل کانتینر API ساخته می‌شود؛ پیامک ارسال نمی‌شود.</p>
      {!challenge ? (
        <form onSubmit={requestChallenge}>
          <label htmlFor="local-demo-otp-alias">شناسهٔ حساب ساختگی</label>
          <input
            id="local-demo-otp-alias"
            name="alias"
            autoComplete="username"
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
            required
            maxLength={32}
          />
          {error && <p role="alert">{localDemoErrorMessage(error, "otp-request")}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "در حال درخواست…" : "دریافت درخواست کد"}
          </button>
        </form>
      ) : (
        <form onSubmit={submitCode}>
          <p role="status">
            شناسهٔ درخواست (برای دریافت کد در راهنمای توسعه):
          </p>
          <code className="local-demo-auth__challenge" data-testid="challenge-id">
            {challenge.challengeId}
          </code>
          <p>مهلت کد: {Math.floor(challenge.expiresIn / 60)} دقیقه</p>
          <label htmlFor="local-demo-otp-code">کد شش‌رقمی</label>
          <input
            id="local-demo-otp-code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(event) => setCode(asciiDigits(event.target.value).replace(/\D/g, "").slice(0, 6))}
            required
            minLength={6}
            maxLength={6}
            pattern="[0-9]{6}"
          />
          {error && <p role="alert">{localDemoErrorMessage(error, "otp-verify")}</p>}
          <button type="submit" disabled={submitting || code.length !== 6}>
            {submitting ? "در حال بررسی…" : "تأیید کد"}
          </button>
          <button type="button" className="local-demo-auth__secondary" onClick={() => setChallenge(null)}>
            درخواست کد تازه
          </button>
        </form>
      )}
      <p className="local-demo-auth__links">
        <Link to="/local-demo/login">بازگشت به ورود با گذرواژه</Link>
      </p>
      <p className="local-demo-auth__notice">
        شناسهٔ درخواست کد، گذرواژه و کد یک‌بارمصرف در مرورگر ذخیره نمی‌شوند.
      </p>
    </section>
  );
}
