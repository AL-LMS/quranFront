import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "../../pages/site/Login";
import Signup from "../../pages/site/Signup";
import ConfirmPhone from "../../pages/site/ConfirmPhone";
import SendOTP from "../../pages/site/SendOTP";
import CheckOTP from "../../pages/site/CheckOTP";
import { V2PreviewProvider, useV2Preview } from "./V2PreviewContext";
import { v2AuthApi, v2AuthErrorMessage } from "./v2AuthApi";
import V2RecoveryPage from "./V2RecoveryPage";

export const V2_PREVIEW_PATH = "/__preview/m3-auth";

function V2Dashboard() {
  const { setAccount } = useV2Preview();
  const [account, setViewAccount] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    let mounted = true;
    v2AuthApi.me().then((subject) => {
      if (mounted) { setViewAccount(subject); setAccount(subject); }
    }).catch((reason) => {
      if (mounted) { setAccount(null); setError(v2AuthErrorMessage(reason)); }
    });
    return () => { mounted = false; };
  }, [setAccount]);
  async function logout() {
    try {
      await v2AuthApi.logout();
      setAccount(null);
      navigate(`${V2_PREVIEW_PATH}/login`, { replace: true });
    } catch (reason) { setError(v2AuthErrorMessage(reason)); }
  }
  return (
    <main lang="fa" dir="rtl" style={{ maxWidth: 520, margin: "4rem auto", padding: "1.5rem" }}>
      <h1>داشبورد آزمایشی ورود نسخهٔ ۲</h1>
      <p>این بخش تنها برای حساب‌های ساختگی و آزمایش محلی است.</p>
      {account ? <p>شناسهٔ حساب: {account.accountId} — نقش: {account.role}</p> : <p>در حال بررسی نشست…</p>}
      {error && <p role="alert">{error}</p>}
      <button onClick={logout} disabled={!account}>خروج از حساب</button>
      <p><Link to={`${V2_PREVIEW_PATH}/login`}>بازگشت به ورود</Link></p>
    </main>
  );
}

export default function V2AuthPreviewRoutes() {
  return (
    <V2PreviewProvider>
      <Routes>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login v2Preview />} />
        <Route path="signup" element={<Signup v2Preview />} />
        <Route path="confirm-phone" element={<ConfirmPhone v2Preview />} />
        <Route path="send-otp" element={<SendOTP v2Preview />} />
        <Route path="check-otp" element={<CheckOTP v2Preview />} />
        <Route path="recovery" element={<V2RecoveryPage />} />
        <Route path="dashboard" element={<V2Dashboard />} />
      </Routes>
    </V2PreviewProvider>
  );
}
