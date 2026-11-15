import { useState } from "react";
import { Link } from "react-router-dom";
import { v2DomesticPhoneEntry, v2DomesticPhonePattern } from "./phoneEntry";
import { v2AuthApi, v2AuthErrorMessage } from "./v2AuthApi";

export default function V2RecoveryPage() {
  const [phone, setPhone] = useState("");
  const [caseId, setCaseId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function request(event) {
    event.preventDefault();
    if (!v2DomesticPhonePattern.test(phone)) { setError("شمارهٔ تلفن را درست وارد کنید."); return; }
    setBusy(true);
    setError("");
    try {
      const { caseId: nextId } = await v2AuthApi.requestRecovery(phone);
      setCaseId(nextId);
    } catch (reason) { setError(v2AuthErrorMessage(reason)); }
    finally { setBusy(false); }
  }
  return (
    <main lang="fa" dir="rtl" style={{ maxWidth: 440, margin: "4rem auto", padding: "1.5rem" }}>
      <h1>درخواست بازیابی حساب آزمایشی</h1>
      <p>بازیابی تنها پس از بررسی پشتیبانی و تأیید مدارک مستقل انجام می‌شود. دریافت پیامک به‌تنهایی مجوز تغییر رمز نیست.</p>
      {caseId ? <p role="status">درخواست آزمایشی ثبت شد. کد پیگیری: {caseId}</p> : (
        <form onSubmit={request}>
          <label htmlFor="v2-recovery-phone">شمارهٔ تلفن</label>
          <input id="v2-recovery-phone" name="phone" value={phone}
            onChange={(event) => setPhone(v2DomesticPhoneEntry(event.target.value))}
            inputMode="tel" autoComplete="tel-national" />
          <button type="submit" disabled={busy}>ثبت درخواست بررسی</button>
        </form>
      )}
      {error && <p role="alert">{error}</p>}
      <Link to="/__preview/m3-auth/login">بازگشت به ورود</Link>
    </main>
  );
}
