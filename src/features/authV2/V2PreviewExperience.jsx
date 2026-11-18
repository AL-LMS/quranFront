import { useEffect, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AutoStoriesRounded from "@mui/icons-material/AutoStoriesRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import LockOutlined from "@mui/icons-material/LockOutlined";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import MenuBookRounded from "@mui/icons-material/MenuBookRounded";
import PhoneIphoneRounded from "@mui/icons-material/PhoneIphoneRounded";
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import SecurityRounded from "@mui/icons-material/SecurityRounded";
import SpaceDashboardRounded from "@mui/icons-material/SpaceDashboardRounded";
import SupportAgentOutlined from "@mui/icons-material/SupportAgentOutlined";
import VerifiedOutlined from "@mui/icons-material/VerifiedOutlined";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";
import { v2DomesticPhoneEntry, v2DomesticPhonePattern, toAsciiDigits } from "./phoneEntry";
import { v2AuthApi, v2AuthErrorMessage } from "./v2AuthApi";
import { useV2Preview } from "./V2PreviewContext";

const ROOT = "/__preview/m3-auth";

function Mark({ light = false }) {
  return (
    <span className={`m3-mark ${light ? "m3-mark-light" : ""}`} aria-hidden="true">
      <AutoStoriesRounded fontSize="inherit" />
    </span>
  );
}

function Brand({ light = false }) {
  return (
    <div className={`m3-brand ${light ? "m3-brand-light" : ""}`}>
      <Mark light={light} />
      <div><strong>دارالقرآن</strong><small>مسیر یادگیری، روشن‌تر از همیشه</small></div>
    </div>
  );
}

function PreviewNotice() {
  return <span className="m3-preview-chip"><span className="m3-preview-dot" /> پیش‌نمایش آزمایشی</span>;
}

function AuthShell({ eyebrow, title, description, children, footer }) {
  return (
    <div className="m3-preview m3-auth-screen" lang="fa" dir="rtl">
      <header className="m3-topbar">
        <Link className="m3-topbar-brand" to={`${ROOT}/login`} aria-label="دارالقرآن — صفحهٔ ورود"><Brand /></Link>
        <div className="m3-topbar-actions"><PreviewNotice /><Link className="m3-topbar-help" to={`${ROOT}/recovery`}><SupportAgentOutlined fontSize="small" /> راهنمای ورود</Link></div>
      </header>
      <div className="m3-auth-layout">
        <div className="m3-auth-content">
          <div className="m3-auth-panel">
            <div className="m3-auth-eyebrow"><span /> {eyebrow}</div>
            <h1>{title}</h1>
            <p className="m3-auth-lead">{description}</p>
            {children}
            {footer && <div className="m3-auth-footer">{footer}</div>}
          </div>
          <div className="m3-under-card"><LockOutlined fontSize="small" /> ارتباط محلی و آزمایشی · اطلاعات واقعی وارد نکنید</div>
        </div>
        <aside className="m3-auth-showcase" aria-label="معرفی سامانه دارالقرآن">
          <div className="m3-showcase-mesh" />
          <div className="m3-showcase-content">
            <div className="m3-showcase-top"><div className="m3-showcase-badge"><AutoStoriesRounded fontSize="small" /> تجربه‌ای تازه از آموزش</div><span>AL LMS / 2026</span></div>
            <div className="m3-showcase-art" aria-hidden="true">
              <div className="m3-art-halo m3-art-halo-outer" /><div className="m3-art-halo m3-art-halo-inner" />
              <div className="m3-art-center"><span className="m3-art-arabic">اقرأ</span><span className="m3-art-stroke" /></div>
              <div className="m3-floating-note m3-floating-note-a"><span><SchoolOutlined /></span><div><b>آموزش هدفمند</b><small>یادگیری در هر زمان</small></div></div>
              <div className="m3-floating-note m3-floating-note-b"><span><CheckCircleRounded /></span><div><b>قدم‌به‌قدم</b><small>از شروع تا پیشرفت</small></div></div>
            </div>
            <div className="m3-showcase-copy"><div className="m3-overline">فضایی برای رشد و یادگیری</div><h2>یک مسیر روشن،<br /><em>برای هر قدم یادگیری.</em></h2><p>آموزش، تمرین و پیشرفت در یک فضای منظم و آرام؛ متناسب با مسیر شما.</p></div>
            <div className="m3-showcase-bottom"><span className="m3-showcase-line" /><span>یادگیری از همین‌جا آغاز می‌شود</span><span className="m3-showcase-stars">✦ ✦ ✦</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, type = "text", inputMode, autoComplete, placeholder, endAdornment, hint, maxLength }) {
  const generatedId = useId();
  const fieldId = `m3-${name}-${generatedId.replace(/:/g, "")}`;
  return (
    <div className={`m3-field ${error ? "m3-field-error" : ""}`}>
      <label htmlFor={fieldId}>{label}</label>
      <div className="m3-input-wrap">
        <input id={fieldId} name={name} type={type} value={value} onChange={onChange} inputMode={inputMode} autoComplete={autoComplete}
          placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          maxLength={maxLength} dir={inputMode === "tel" || inputMode === "numeric" ? "ltr" : undefined} />
        {endAdornment}
      </div>
      {error ? <small id={`${fieldId}-error`} className="m3-field-message" role="alert">{error}</small> : hint ? <small id={`${fieldId}-hint`} className="m3-field-hint">{hint}</small> : null}
    </div>
  );
}

function PasswordField({ name = "password", label = "رمز عبور", value, onChange, error, autoComplete = "current-password", hint }) {
  const [visible, setVisible] = useState(false);
  return <Field name={name} label={label} value={value} onChange={onChange} error={error} type={visible ? "text" : "password"}
    autoComplete={autoComplete} hint={hint} endAdornment={<button type="button" className="m3-visibility" aria-label={visible ? `مخفی کردن ${label}` : `نمایش ${label}`}
      onClick={() => setVisible((current) => !current)}>{visible ? <VisibilityOffRounded fontSize="small" /> : <VisibilityRounded fontSize="small" />}</button>} />;
}

function PhoneField({ name = "phone", label = "شماره تلفن", value, onChange, error, autoComplete = "tel-national" }) {
  return <Field name={name} label={label} value={value} onChange={(event) => onChange(v2DomesticPhoneEntry(event.target.value))}
    error={error} inputMode="tel" autoComplete={autoComplete} placeholder="0912 000 0001" maxLength={32} />;
}

function Feedback({ error, success }) {
  return <>{error && <div className="m3-feedback m3-feedback-error" role="alert">{error}</div>}{success && <div className="m3-feedback m3-feedback-success" role="status"><CheckCircleRounded fontSize="small" />{success}</div>}</>;
}

function PrimaryButton({ children, busy = false }) {
  return <button className="m3-primary-button" type="submit" disabled={busy}><span>{busy ? "لطفاً صبر کنید…" : children}</span><ArrowBackRounded fontSize="small" /></button>;
}

function SecondaryLinks({ children }) {
  return <div className="m3-secondary-links">{children}</div>;
}

export function PreviewLogin() {
  const { setAccount, verifiedPhone } = useV2Preview();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(verifiedPhone);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const nextErrors = {
      ...(!v2DomesticPhonePattern.test(phone) ? { phone: "شماره تلفن را به درستی وارد نمایید." } : {}),
      ...(!password ? { password: "لطفا رمز عبور خود را وارد نمایید." } : {}),
    };
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true); setError("");
    try {
      const account = await v2AuthApi.signinPassword(phone, password);
      setAccount(account);
      navigate(`${ROOT}/dashboard`);
    } catch (reason) { setError(v2AuthErrorMessage(reason)); }
    finally { setBusy(false); }
  }
  return <AuthShell eyebrow="خوش آمدید" title="خوشحالیم دوباره می‌بینیمت!" description="برای ادامه مسیر یادگیری، وارد حساب کاربری خود شوید."
    footer={<>هنوز حساب ندارید؟ <Link to={`${ROOT}/signup`}>ایجاد حساب کاربری <ChevronLeftRounded fontSize="small" /></Link></>}>
    {verifiedPhone && <div className="m3-inline-note"><VerifiedOutlined fontSize="small" /> شماره شما تأیید شد. حالا با رمز عبور وارد شوید.</div>}
    <form className="m3-form" onSubmit={submit} noValidate>
      <PhoneField value={phone} onChange={(value) => { setPhone(value); setErrors({}); }} error={errors.phone} />
      <PasswordField value={password} onChange={(event) => { setPassword(event.target.value); setErrors({}); }} error={errors.password} />
      <div className="m3-form-between"><Link className="m3-text-link" to={`${ROOT}/recovery`}>بازیابی حساب</Link><span className="m3-form-secure"><SecurityRounded fontSize="small" /> ورود امن</span></div>
      <Feedback error={error} /><PrimaryButton busy={busy}>ورود به حساب</PrimaryButton>
    </form>
    <SecondaryLinks><span>روش دیگری را ترجیح می‌دهید؟</span><Link to={`${ROOT}/send-otp`}><PhoneIphoneRounded fontSize="small" /> ورود با پیامک</Link></SecondaryLinks>
  </AuthShell>;
}

export function PreviewSignup() {
  const { setChallenge } = useV2Preview();
  const navigate = useNavigate();
  const [values, setValues] = useState({ first_name: "", last_name: "", phone: "", password: "", repassword: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function update(name, value) { setValues((current) => ({ ...current, [name]: value })); setErrors({}); }
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const nextErrors = {
      ...(!values.first_name.trim() ? { first_name: "لطفا نام خود را وارد نمایید." } : {}),
      ...(!values.last_name.trim() ? { last_name: "لطفا نام خانوادگی خود را وارد نمایید." } : {}),
      ...(!v2DomesticPhonePattern.test(values.phone) ? { phone: "شماره تلفن را به درستی وارد نمایید." } : {}),
      ...(values.password.length < 12 ? { password: "رمز عبور باید حداقل ۱۲ نویسه باشد." } : {}),
      ...(values.password !== values.repassword ? { repassword: "تکرار رمز عبور مطابقت ندارد." } : {}),
    };
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true); setError("");
    try {
      const challenge = await v2AuthApi.signup({ phone: values.phone, password: values.password, firstName: values.first_name.trim(), lastName: values.last_name.trim() });
      setChallenge({ ...challenge, phone: values.phone, purpose: "verify_phone" });
      navigate(`${ROOT}/confirm-phone`);
    } catch (reason) { setError(v2AuthErrorMessage(reason)); }
    finally { setBusy(false); }
  }
  return <AuthShell eyebrow="شروع یک مسیر تازه" title="حساب یادگیری‌ات را بساز" description="چند قدم کوتاه تا شروع تجربه‌ای بهتر در دارالقرآن."
    footer={<>از قبل حساب دارید؟ <Link to={`${ROOT}/login`}>ورود به حساب <ChevronLeftRounded fontSize="small" /></Link></>}>
    <form className="m3-form" onSubmit={submit} noValidate>
      <div className="m3-fields-pair">
        <Field label="نام" name="first_name" value={values.first_name} autoComplete="given-name" onChange={(event) => update("first_name", event.target.value)} error={errors.first_name} placeholder="نام شما" />
        <Field label="نام خانوادگی" name="last_name" value={values.last_name} autoComplete="family-name" onChange={(event) => update("last_name", event.target.value)} error={errors.last_name} placeholder="نام خانوادگی" />
      </div>
      <PhoneField value={values.phone} onChange={(value) => update("phone", value)} error={errors.phone} />
      <PasswordField label="رمز عبور" name="password" value={values.password} autoComplete="new-password" onChange={(event) => update("password", event.target.value)} error={errors.password} hint="حداقل ۱۲ نویسه؛ یک رمز متفاوت از رمزهای حساب‌های واقعی انتخاب کنید." />
      <PasswordField label="تکرار رمز عبور" name="repassword" value={values.repassword} autoComplete="new-password" onChange={(event) => update("repassword", event.target.value)} error={errors.repassword} />
      <Feedback error={error} /><PrimaryButton busy={busy}>ثبت نام</PrimaryButton>
    </form>
    <div className="m3-subtle-notice"><SecurityRounded fontSize="small" /> این فرم فقط با شماره‌های ساختگی محلی کار می‌کند و حساب واقعی نمی‌سازد.</div>
  </AuthShell>;
}

function OtpForm({ kind }) {
  const { challenge, setChallenge, setAccount, setVerifiedPhone } = useV2Preview();
  const navigate = useNavigate();
  const verify = kind === "verify_phone";
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    if (!/^[0-9]{6}$/.test(code)) { setFieldError("کد باید دقیقاً ۶ رقم باشد."); return; }
    if (!challenge || challenge.purpose !== kind) { setError("درخواست کد موجود نیست. لطفاً دوباره از مرحله قبل شروع کنید."); return; }
    setBusy(true); setError("");
    try {
      if (verify) {
        await v2AuthApi.verifyPhone(challenge.challengeId, code);
        setVerifiedPhone(challenge.phone);
        setChallenge(null);
        navigate(`${ROOT}/login`); // Verification must never establish a session.
      } else {
        const account = await v2AuthApi.signinOtp(challenge.challengeId, code);
        setAccount(account);
        setChallenge(null);
        navigate(`${ROOT}/dashboard`);
      }
    } catch (reason) { setError(v2AuthErrorMessage(reason)); }
    finally { setBusy(false); }
  }
  return <AuthShell eyebrow="یک قدم تا ادامه" title={verify ? "تایید شماره تلفن" : "ورود با پیامک"}
    description={verify ? "برای فعال‌سازی حساب آزمایشی، کد شش‌رقمی را وارد کنید." : "کد 6 رقمی ورود را وارد کنید تا وارد فضای یادگیری شوید."}
    footer={<Link to={`${ROOT}/${verify ? "signup" : "send-otp"}`}><ArrowForwardRounded fontSize="small" /> تغییر شماره تلفن</Link>}>
    <div className="m3-otp-callout"><span><PhoneIphoneRounded /></span><div>کد آزمایشی برای <strong dir="ltr">{challenge?.phone || "شمارهٔ آزمایشی"}</strong> ایجاد شده است.<small>کد را از فایل خصوصی fake-SMS در ترمینال بردارید؛ پیامک واقعی ارسال نمی‌شود.</small></div></div>
    <form className="m3-form" onSubmit={submit} noValidate>
      <Field name="code" label={verify ? "کد تایید" : "کد"} value={code} inputMode="numeric" autoComplete="one-time-code" placeholder="• • • • • •" maxLength={6}
        onChange={(event) => { setCode(toAsciiDigits(event.target.value).replace(/\D/g, "").slice(0, 6)); setFieldError(""); }} error={fieldError} />
      <div className="m3-code-help"><span>اعتبار هر کد: ۵ دقیقه</span><span>یک‌بارمصرف و فقط برای آزمایش</span></div>
      <Feedback error={error} /><PrimaryButton busy={busy}>{verify ? "احراز هویت" : "ورود"}</PrimaryButton>
    </form>
  </AuthShell>;
}

export function PreviewVerifyPhone() { return <OtpForm kind="verify_phone" />; }
export function PreviewSigninOtp() { return <OtpForm kind="signin" />; }

export function PreviewRequestOtp() {
  const { setChallenge } = useV2Preview();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    if (!v2DomesticPhonePattern.test(phone)) { setFieldError("شماره تلفن را به درستی وارد نمایید."); return; }
    setBusy(true); setError("");
    try {
      const challenge = await v2AuthApi.requestSigninOtp(phone);
      setChallenge({ ...challenge, phone, purpose: "signin" });
      navigate(`${ROOT}/check-otp`);
    } catch (reason) { setError(v2AuthErrorMessage(reason)); }
    finally { setBusy(false); }
  }
  return <AuthShell eyebrow="ورود آسان" title="ورود با پیامک" description="شماره حساب آزمایشی تاییدشده خود را وارد کنید تا کد ورود ساخته شود."
    footer={<>ترجیح می‌دهید با رمز وارد شوید؟ <Link to={`${ROOT}/login`}>ورود با رمزعبور <ChevronLeftRounded fontSize="small" /></Link></>}>
    <div className="m3-otp-intro"><PhoneIphoneRounded /><span>کد شش‌رقمی یک‌بارمصرف، فقط در فایل خصوصی محلی ثبت می‌شود.</span></div>
    <form className="m3-form" onSubmit={submit} noValidate><PhoneField value={phone} onChange={(value) => { setPhone(value); setFieldError(""); }} error={fieldError} />
      <Feedback error={error} /><PrimaryButton busy={busy}>ارسال کد</PrimaryButton></form>
    <SecondaryLinks><span>هنوز حساب ندارید؟</span><Link to={`${ROOT}/signup`}>ثبت نام</Link></SecondaryLinks>
  </AuthShell>;
}

export function PreviewRecovery() {
  const [phone, setPhone] = useState("");
  const [caseId, setCaseId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    if (!v2DomesticPhonePattern.test(phone)) { setFieldError("شمارهٔ تلفن را درست وارد کنید."); return; }
    setBusy(true); setError("");
    try { const { caseId: nextId } = await v2AuthApi.requestRecovery(phone); setCaseId(nextId); }
    catch (reason) { setError(v2AuthErrorMessage(reason)); }
    finally { setBusy(false); }
  }
  return <AuthShell eyebrow="در کنار شما هستیم" title="بازیابی حساب آزمایشی" description="اگر امکان ورود ندارید، یک درخواست برای بررسی پشتیبانی ثبت کنید."
    footer={<Link to={`${ROOT}/login`}><ArrowForwardRounded fontSize="small" /> بازگشت به ورود</Link>}>
    <div className="m3-recovery-explain"><SupportAgentOutlined /><div><strong>بازیابی با بررسی انسانی</strong><p>تغییر رمز تنها با پیامک ممکن نیست و نیاز به احراز هویت مستقل توسط پشتیبانی دارد.</p></div></div>
    {caseId ? <div className="m3-recovery-success" role="status"><CheckCircleRounded /><h2>درخواست شما ثبت شد</h2><p>این شماره پیگیری فقط برای آزمایش است:</p><code dir="ltr">{caseId}</code></div> :
      <form className="m3-form" onSubmit={submit} noValidate><PhoneField label="شمارهٔ تلفن" value={phone} onChange={(value) => { setPhone(value); setFieldError(""); }} error={fieldError} />
        <Feedback error={error} /><PrimaryButton busy={busy}>ثبت درخواست بررسی</PrimaryButton></form>}
  </AuthShell>;
}

const studentRole = { student: "قرآن‌آموز", teacher: "مدرس", admin: "مدیر" };

export function PreviewDashboard() {
  const { setAccount } = useV2Preview();
  const navigate = useNavigate();
  const [account, setViewAccount] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  useEffect(() => {
    let active = true;
    setViewAccount(null); setError("");
    v2AuthApi.me().then((subject) => {
      if (active) { setViewAccount(subject); setAccount(subject); }
    }).catch((reason) => {
      if (!active) return;
      setAccount(null);
      if ([401, 403].includes(reason?.status)) navigate(`${ROOT}/login`, { replace: true });
      else setError(v2AuthErrorMessage(reason));
    });
    return () => { active = false; };
  }, [navigate, retry, setAccount]);
  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true); setError("");
    try { await v2AuthApi.logout(); setAccount(null); navigate(`${ROOT}/login`, { replace: true }); }
    catch (reason) { setError(v2AuthErrorMessage(reason)); }
    finally { setLoggingOut(false); }
  }
  return (
    <div className="m3-preview m3-dashboard" lang="fa" dir="rtl">
      <aside className="m3-dashboard-sidebar">
        <Brand /><div className="m3-sidebar-divider" />
        <div className="m3-sidebar-heading">فضای یادگیری</div>
        <nav aria-label="ناوبری داشبورد"><Link className="m3-side-link m3-side-active" to={`${ROOT}/dashboard`}><SpaceDashboardRounded /> نمای کلی</Link>
          <a className="m3-side-link" href="#my-courses"><MenuBookRounded /> دوره‌های من</a><a className="m3-side-link" href="#next-steps"><SchoolOutlined /> مسیر یادگیری</a></nav>
        <div className="m3-sidebar-bottom"><div className="m3-sidebar-support"><SupportAgentOutlined /><strong>همراه شما هستیم</strong><span>نسخهٔ آزمایشی · بدون دادهٔ واقعی</span></div>
          <button className="m3-side-link m3-logout-side" type="button" disabled={!account || loggingOut} onClick={logout}><LogoutRounded /> خروج از حساب</button></div>
      </aside>
      <div className="m3-dashboard-main">
        <header className="m3-dashboard-header"><div className="m3-dashboard-breadcrumb"><span>خانه</span><ChevronLeftRounded fontSize="small" /><strong>داشبورد من</strong></div><div className="m3-dashboard-header-actions"><PreviewNotice /><span className="m3-profile-avatar" aria-hidden="true">{account?.firstName?.trim().slice(0, 1) || "ق"}</span><button type="button" className="m3-header-logout" aria-label="خروج" disabled={!account || loggingOut} onClick={logout}><LogoutRounded fontSize="small" /></button></div></header>
        <main className="m3-dashboard-body">
          <div className="m3-dashboard-section-label"><span /> داشبورد یادگیری</div>
          <h1 className="m3-dashboard-title">داشبورد آزمایشی ورود نسخهٔ ۲</h1>
          <p className="m3-dashboard-subtitle">یک نمای اولیه از فضای اختصاصی یادگیری شما در دارالقرآن.</p>
          {error && <div className="m3-dashboard-error" role="alert">{error}<button type="button" onClick={() => setRetry((current) => current + 1)}>تلاش دوباره</button></div>}
          {!account && !error && <div className="m3-dashboard-loading" role="status">در حال بررسی نشست امن شما…</div>}
          {account && <>
            <section className="m3-welcome-banner"><div className="m3-welcome-content"><div className="m3-welcome-tag"><VerifiedOutlined fontSize="small" /> نشست آزمایشی فعال</div><h2>سلام {account.firstName || "قرآن‌آموز عزیز"}، خوش آمدید <span>✦</span></h2><p>مسیر یادگیری شما از اینجا آغاز می‌شود. برای دیدن دوره‌ها و پیشرفت واقعی، اتصال سرویس آموزشی لازم است.</p><div className="m3-welcome-actions"><a href="#my-courses">مشاهده دوره‌ها <ArrowBackRounded fontSize="small" /></a><span>{studentRole[account.role] || "کاربر"} دارالقرآن</span></div></div><div className="m3-welcome-visual" aria-hidden="true"><div className="m3-welcome-ring" /><div className="m3-welcome-book"><AutoStoriesRounded /></div><span className="m3-sparkle-a">✦</span><span className="m3-sparkle-b">✧</span></div></section>
            <section className="m3-dashboard-grid" aria-label="خلاصهٔ فضای یادگیری">
              <div className="m3-summary-card"><span className="m3-summary-icon m3-summary-purple"><MenuBookRounded /></span><div><strong>دوره‌های من</strong><small>هنوز دوره‌ای متصل نشده است</small></div><span className="m3-summary-value">—</span></div>
              <div className="m3-summary-card"><span className="m3-summary-icon m3-summary-mint"><SchoolOutlined /></span><div><strong>پیشرفت یادگیری</strong><small>پس از اتصال داده‌های آموزشی</small></div><span className="m3-summary-value">—</span></div>
              <div className="m3-summary-card"><span className="m3-summary-icon m3-summary-peach"><VerifiedOutlined /></span><div><strong>وضعیت حساب</strong><small>نشست تستی با مجوز سرور</small></div><span className="m3-summary-value m3-summary-active">فعال</span></div>
            </section>
            <div className="m3-content-columns">
              <section className="m3-content-card" id="my-courses"><div className="m3-card-heading"><div><span className="m3-card-kicker">آموزش</span><h2>دوره‌های من</h2></div><MenuBookRounded /></div><div className="m3-empty-course"><div className="m3-empty-illustration"><AutoStoriesRounded /></div><h3>مسیر یادگیری‌تان در راه است</h3><p>در نسخه آزمایشی، دوره‌ها و ثبت‌نام واقعی هنوز متصل نشده‌اند. پس از فعال‌سازی بخش آموزش، دوره‌های شما اینجا نمایش داده می‌شوند.</p><span>به‌زودی با اتصال بخش آموزش</span></div></section>
              <section className="m3-content-card m3-next-steps" id="next-steps"><div className="m3-card-heading"><div><span className="m3-card-kicker">شروع مسیر</span><h2>قدم‌های بعدی</h2></div><SchoolOutlined /></div><ol><li className="m3-step-done"><span><CheckCircleRounded /></span><div><strong>ایجاد حساب آزمایشی</strong><small>حساب و نشست با دادهٔ ساختگی</small></div></li><li className="m3-step-current"><span>۲</span><div><strong>اتصال دوره‌های آموزشی</strong><small>پس از تکمیل درگاه‌های امنیتی و داده</small></div></li><li><span>۳</span><div><strong>شروع یادگیری</strong><small>دسترسی به درس‌ها، تمرین‌ها و ارزیابی‌ها</small></div></li></ol>
                <details className="m3-technical-details"><summary>جزئیات فنی نشست <ChevronLeftRounded fontSize="small" /></summary><small>شناسهٔ حساب: {account.accountId} — نقش: {account.role}</small></details>
              </section>
            </div>
          </>}
          <div className="m3-dashboard-footnote"><LockOutlined fontSize="small" /> این صفحه تنها پیش‌نمایش محلی است و هیچ دوره، نمره یا دادهٔ واقعی را نمایش نمی‌دهد.</div>
        </main>
      </div>
    </div>
  );
}
