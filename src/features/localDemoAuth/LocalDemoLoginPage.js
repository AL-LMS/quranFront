import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLocalDemoAuth } from "./LocalDemoAuthContext";
import { localDemoErrorMessage } from "./localDemoApi";

export default function LocalDemoLoginPage() {
  const { account, status, sessionError, login, refreshSession } = useLocalDemoAuth();
  const navigate = useNavigate();
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "checking") {
    return <p className="local-demo-auth__status" role="status">در حال بررسی نشست نمایشی…</p>;
  }
  if (status === "unavailable") {
    return (
      <section className="local-demo-auth__card" aria-labelledby="local-demo-login-unavailable">
        <h1 id="local-demo-login-unavailable">ورود نمایشی در دسترس نیست</h1>
        <p role="alert">{localDemoErrorMessage(sessionError, "session")}</p>
        <button type="button" onClick={() => void refreshSession()}>تلاش دوباره</button>
      </section>
    );
  }
  if (account) return <Navigate to="/local-demo/dashboard" replace />;

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(alias.trim(), password);
      setPassword("");
      navigate("/local-demo/dashboard", { replace: true });
    } catch (requestError) {
      setPassword("");
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="local-demo-auth__card" aria-labelledby="local-demo-login-title">
      <h1 id="local-demo-login-title">ورود به حساب نمایشی</h1>
      <p>از شناسه و گذرواژهٔ ساختگی تهیه‌شده برای نمایش محلی استفاده کنید.</p>
      <form onSubmit={submit}>
        <label htmlFor="local-demo-alias">شناسهٔ حساب</label>
        <input
          id="local-demo-alias"
          name="alias"
          autoComplete="username"
          value={alias}
          onChange={(event) => setAlias(event.target.value)}
          required
          maxLength={32}
        />
        <label htmlFor="local-demo-password">گذرواژه</label>
        <input
          id="local-demo-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          maxLength={256}
        />
        {error && <p role="alert">{localDemoErrorMessage(error, "login")}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "در حال ورود…" : "ورود"}
        </button>
      </form>
      <p className="local-demo-auth__links">
        <Link to="/local-demo/otp">ورود با کد یک‌بارمصرف محلی</Link>
      </p>
      <p className="local-demo-auth__notice">
        این ورود فقط برای نمایش محلی است و به حساب‌های واقعی یا احراز هویت تولیدی متصل نیست.
      </p>
    </section>
  );
}
