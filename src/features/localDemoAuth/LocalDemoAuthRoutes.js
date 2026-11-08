import { Navigate, Route, Routes } from "react-router-dom";
import { LocalDemoAuthProvider } from "./LocalDemoAuthContext";
import LocalDemoDashboardPage from "./LocalDemoDashboardPage";
import LocalDemoLoginPage from "./LocalDemoLoginPage";
import LocalDemoOtpPage from "./LocalDemoOtpPage";
import RequireLocalDemoAuth from "./RequireLocalDemoAuth";
import "./localDemoAuth.css";

export default function LocalDemoAuthRoutes() {
  return (
    <LocalDemoAuthProvider>
      <main className="local-demo-auth" dir="rtl">
        <header className="local-demo-auth__header">
          <span>نمایش محلی AL-LMS</span>
          <span className="local-demo-auth__badge">فقط دادهٔ ساختگی</span>
        </header>
        <Routes>
          <Route path="login" element={<LocalDemoLoginPage />} />
          <Route path="otp" element={<LocalDemoOtpPage />} />
          <Route
            path="dashboard"
            element={
              <RequireLocalDemoAuth>
                <LocalDemoDashboardPage />
              </RequireLocalDemoAuth>
            }
          />
          <Route path="*" element={<Navigate to="/local-demo/login" replace />} />
        </Routes>
      </main>
    </LocalDemoAuthProvider>
  );
}
