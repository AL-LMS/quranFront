import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocalDemoAuth } from "./LocalDemoAuthContext";
import { localDemoErrorMessage } from "./localDemoApi";

export default function LocalDemoDashboardPage() {
  const { account, logout } = useLocalDemoAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function signOut() {
    setSubmitting(true);
    setError(null);
    try {
      await logout();
      navigate("/local-demo/login", { replace: true });
    } catch (requestError) {
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="local-demo-auth__card" aria-labelledby="local-demo-dashboard-title">
      <h1 id="local-demo-dashboard-title">داشبورد نمایشی</h1>
      <dl className="local-demo-auth__identity">
        <div><dt>شناسه</dt><dd>{account.alias}</dd></div>
        <div><dt>نقش</dt><dd>{account.role === "student" ? "دانش‌آموز ساختگی" : "مدرس ساختگی"}</dd></div>
      </dl>
      {account.role === "student" ? (
        <p>این حساب دانش‌آموز ساختگی است و به دوره یا ثبت‌نام واقعی دسترسی ندارد.</p>
      ) : (
        <p>این حساب مدرس ساختگی است و مدیریت دوره یا دانش‌آموز واقعی در این نمایش فعال نیست.</p>
      )}
      <p className="local-demo-auth__notice">
        نشست با کوکی HttpOnly نگهداری می‌شود. هیچ گذرواژه، کد یک‌بارمصرف یا توکن در فضای ذخیره‌سازی مرورگر قرار نمی‌گیرد.
      </p>
      {error && <p role="alert">{localDemoErrorMessage(error, "logout")}</p>}
      <button type="button" onClick={signOut} disabled={submitting}>
        {submitting ? "در حال خروج…" : "خروج از نمایش محلی"}
      </button>
      <p className="local-demo-auth__links"><Link to="/">بازگشت به صفحهٔ اصلی</Link></p>
    </section>
  );
}
