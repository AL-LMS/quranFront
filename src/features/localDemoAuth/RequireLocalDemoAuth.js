import { Link, Navigate } from "react-router-dom";
import { useLocalDemoAuth } from "./LocalDemoAuthContext";
import { localDemoErrorMessage } from "./localDemoApi";

export default function RequireLocalDemoAuth({ children }) {
  const { account, status, sessionError, refreshSession } = useLocalDemoAuth();

  if (status === "checking") {
    return <p className="local-demo-auth__status" role="status">در حال بررسی نشست نمایشی…</p>;
  }
  if (status === "unavailable") {
    return (
      <section className="local-demo-auth__card" aria-labelledby="local-demo-session-error">
        <h1 id="local-demo-session-error">بررسی نشست انجام نشد</h1>
        <p role="alert">{localDemoErrorMessage(sessionError, "session")}</p>
        <button type="button" onClick={() => void refreshSession()}>
          تلاش دوباره
        </button>
      </section>
    );
  }
  if (!account) return <Navigate to="/local-demo/login" replace />;
  if (!["student", "teacher"].includes(account.role)) {
    return (
      <section className="local-demo-auth__card" role="alert">
        <h1>دسترسی نمایشی مجاز نیست</h1>
        <Link to="/local-demo/login">بازگشت به ورود</Link>
      </section>
    );
  }
  return children;
}
