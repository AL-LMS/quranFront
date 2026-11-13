import React, { useEffect, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress, Container, Divider,
  Paper, Stack, TextField, Typography,
} from "@mui/material";
import {
  CheckCircleOutline, LockOutlined, RefreshRounded, VerifiedUserOutlined,
} from "@mui/icons-material";
import {
  approveReviewRequest, listReviewRequests, revokePublication,
} from "./m6ReviewApi";

const PAGE_SIZE = 20;

/** Isolated development-only reviewer UI. Tokens stay in component memory. */
export default function M6ReviewLocalPage() {
  const [inputToken, setInputToken] = useState("");
  const [token, setToken] = useState("");
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [reloadIndex, setReloadIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState(null);
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [revokeCourseId, setRevokeCourseId] = useState("");
  const [revokeVersion, setRevokeVersion] = useState("");
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  useEffect(() => {
    if (!token) {
      setItems([]);
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    listReviewRequests({ token, limit: PAGE_SIZE, offset, signal: controller.signal })
      .then((page) => {
        if (controller.signal.aborted) return;
        setItems(page.items);
        setLoading(false);
        setError("");
      })
      .catch((cause) => {
        if (controller.signal.aborted) return;
        setLoading(false);
        setItems([]);
        setError(cause.message || "دریافت درخواست‌ها ناموفق بود.");
        if (cause.status === 403) setToken("");
      });
    return () => controller.abort();
  }, [token, offset, reloadIndex]);

  function reload() { setReloadIndex((n) => n + 1); }

  function disconnect() {
    setToken("");
    setInputToken("");
    setItems([]);
    setSelected(null);
    setConfirmApprove(false);
    setConfirmRevoke(false);
    setRevokeCourseId("");
    setRevokeVersion("");
    setError("");
    setNotice("");
  }

  function connect(event) {
    event.preventDefault();
    const candidate = inputToken.trim();
    if (!/^[A-Za-z0-9_-]{24,200}$/.test(candidate)) {
      setError("توکن بررسی محلی معتبر وارد کنید.");
      return;
    }
    setOffset(0);
    setError("");
    setNotice("");
    setInputToken("");
    setToken(candidate);
  }

  async function approve() {
    if (!selected || !confirmApprove || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const course = await approveReviewRequest({
        token, requestId: selected.id, expectedVersion: selected.course_version,
      });
      setRevokeCourseId(course.id);
      setRevokeVersion(String(course.version));
      setConfirmApprove(false);
      setSelected(null);
      setOffset(0);
      reload();
      setNotice("بررسی آزمایشی تأیید شد. دوره در فهرست عمومی ساختگی نمایش داده می‌شود.");
    } catch (cause) {
      setError(cause.message || "تأیید آزمایشی ناموفق بود.");
      if (cause.status === 409) reload();
      if (cause.status === 403) disconnect();
    } finally { setBusy(false); }
  }

  async function revoke() {
    if (!confirmRevoke || busy) return;
    const version = /^\d+$/.test(revokeVersion) ? Number(revokeVersion) : 0;
    if (!Number.isSafeInteger(version) || version < 1) {
      setError("نسخهٔ تأییدشده معتبر نیست.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const course = await revokePublication({
        token, courseId: revokeCourseId.trim(), expectedVersion: version,
      });
      setRevokeVersion(String(course.version));
      setConfirmRevoke(false);
      reload();
      setNotice("تأیید انتشار لغو شد. دوره از فهرست عمومی آزمایشی مخفی شد.");
    } catch (cause) {
      setError(cause.message || "لغو تأیید ناموفق بود.");
      if (cause.status === 409) reload();
      if (cause.status === 403) disconnect();
    } finally { setBusy(false); }
  }

  return (
    <Box lang="fa" dir="rtl" sx={{ minHeight: "100vh", bgcolor: "#f7f7fd", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{
          p: { xs: 3, md: 4 }, borderRadius: 4,
          background: "linear-gradient(115deg, #29275e, #5544ac)", color: "white",
        }}>
          <Stack spacing={1}>
            <Chip label="فقط توسعه محلی • PostgreSQL موقت • داده ساختگی"
              sx={{ bgcolor: "rgba(255,255,255,.18)", color: "white", alignSelf: "flex-start" }} />
            <Typography variant="h4" component="h1" fontWeight={800}>بررسی انتشار دوره‌ها</Typography>
            <Typography sx={{ opacity: .9, lineHeight: 1.9 }}>
              درخواست‌های آزمایشی را با توکن بررسیِ جداگانه تأیید یا لغو کنید.
              این صفحه نقش، هویت یا مجوز واقعی ایجاد نمی‌کند.
            </Typography>
          </Stack>
        </Paper>
        {!token ? (
          <Paper elevation={0} variant="outlined" sx={{
            mt: 3, p: 3, borderRadius: 3, maxWidth: 620,
          }}>
            <Stack spacing={2}>
              <Stack direction="row" gap={1} alignItems="center">
                <LockOutlined color="primary" />
                <Typography variant="h6" component="h2" fontWeight={800}>اتصال بررسی محلی</Typography>
              </Stack>
              <Alert severity="info">
                توکن جداگانهٔ X-AL-LMS-Local-Reviewer-Token را از ترمینال backend بگیرید.
                آن را ذخیره نکنید یا با توکن مدیریت اشتباه نگیرید.
              </Alert>
              <Box component="form" onSubmit={connect} autoComplete="off">
                <Stack spacing={2}>
                  <TextField label="توکن بررسی محلی" type="password"
                    autoComplete="new-password" inputProps={{ maxLength: 200 }}
                    value={inputToken} onChange={(event) => setInputToken(event.target.value)}
                    fullWidth />
                  <Button type="submit" variant="contained">اتصال به بررسی آزمایشی</Button>
                </Stack>
              </Box>
              {error && <Alert severity="error" role="alert">{error}</Alert>}
            </Stack>
          </Paper>
        ) : (
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} gap={2}
              alignItems={{ sm: "center" }} justifyContent="space-between">
              <Typography fontSize=".9rem" color="text.secondary">
                اتصال موقت است؛ توکن فقط در حافظهٔ صفحه است.
              </Typography>
              <Button variant="outlined" onClick={disconnect} disabled={busy}>
                قطع اتصال و پاک‌کردن توکن
              </Button>
            </Stack>
            {error && <Alert severity="error" role="alert">{error}</Alert>}
            {notice && <Alert severity="success" role="status">{notice}</Alert>}

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, gap: 3 }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" gap={1} justifyContent="space-between" alignItems="center">
                    <Typography component="h2" variant="h6" fontWeight={800}>درخواست‌های در انتظار</Typography>
                    <Button size="small" startIcon={<RefreshRounded />} onClick={reload}
                      disabled={busy || loading}>تازه‌سازی</Button>
                  </Stack>
                  {loading && <Stack direction="row" gap={1} role="status">
                    <CircularProgress size={20} /><Typography>در حال بارگذاری…</Typography>
                  </Stack>}
                  {!loading && items.length === 0 && <Alert severity="info">درخواست تازه‌ای وجود ندارد.</Alert>}
                  {!loading && items.map((item) => (
                    <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Stack spacing={1}>
                        <Typography fontWeight={750}>{item.title}</Typography>
                        <Chip label="ارسال‌شده" size="small" sx={{ alignSelf: "flex-start" }} />
                        <Typography dir="ltr" fontSize=".76rem" color="text.secondary">
                          Course {item.course_id} · v{item.course_version}
                        </Typography>
                        <Button size="small" variant="outlined" disabled={busy}
                          onClick={() => {
                            setSelected(item); setConfirmApprove(false);
                            setNotice(""); setError("");
                          }}>
                          انتخاب درخواست
                        </Button>
                      </Stack>
                    </Paper>
                  ))}
                  <Stack direction="row" alignItems="center" justifyContent="center" gap={1}>
                    <Button variant="outlined" disabled={busy || offset === 0}
                      onClick={() => setOffset((n) => Math.max(0, n - PAGE_SIZE))}>قبلی</Button>
                    <Typography>صفحه {Math.floor(offset / PAGE_SIZE) + 1}</Typography>
                    <Button variant="outlined" disabled={busy || items.length < PAGE_SIZE}
                      onClick={() => setOffset((n) => n + PAGE_SIZE)}>بعدی</Button>
                  </Stack>
                </Stack>
              </Paper>

              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" gap={1} alignItems="center">
                      <VerifiedUserOutlined color="primary" />
                      <Typography component="h2" variant="h6" fontWeight={800}>تأیید درخواست</Typography>
                    </Stack>
                    {!selected ? <Alert severity="info">یک درخواست را از فهرست انتخاب کنید.</Alert> : (
                      <>
                        <Typography fontWeight={700}>{selected.title}</Typography>
                        <Typography dir="ltr" fontSize=".78rem">{selected.course_id} · v{selected.course_version}</Typography>
                        {confirmApprove ? (
                          <Stack spacing={1}>
                            <Alert severity="warning">آیا این نسخه از دوره در فهرست عمومی آزمایشی منتشر شود؟</Alert>
                            <Button variant="contained" disabled={busy} onClick={approve}
                              startIcon={<CheckCircleOutline />}>تأیید انتشار آزمایشی</Button>
                            <Button onClick={() => setConfirmApprove(false)} disabled={busy}>انصراف</Button>
                          </Stack>
                        ) : (
                          <Button variant="contained" onClick={() => setConfirmApprove(true)} disabled={busy}>
                            شروع تأیید درخواست
                          </Button>
                        )}
                      </>
                    )}
                  </Stack>
                </Paper>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                  <Stack spacing={2}>
                    <Typography component="h2" variant="h6" fontWeight={800}>لغو تأیید انتشار</Typography>
                    <Alert severity="info">تنها یک دورهٔ منتشرشده با نسخهٔ فعلی را می‌توان لغو کرد.</Alert>
                    <TextField label="UUID دوره برای لغو" dir="ltr" value={revokeCourseId}
                      onChange={(event) => { setRevokeCourseId(event.target.value); setConfirmRevoke(false); }}
                      disabled={busy} fullWidth />
                    <TextField label="نسخهٔ منتشرشده" dir="ltr" value={revokeVersion}
                      onChange={(event) => { setRevokeVersion(event.target.value); setConfirmRevoke(false); }}
                      disabled={busy} fullWidth inputProps={{ inputMode: "numeric" }} />
                    <Divider />
                    {confirmRevoke ? (
                      <Stack spacing={1}>
                        <Alert severity="warning">با لغو تأیید، دوره در فهرست عمومی آزمایشی پنهان می‌شود. ادامه؟</Alert>
                        <Button color="error" variant="contained" disabled={busy} onClick={revoke}>
                          تأیید لغو انتشار
                        </Button>
                        <Button disabled={busy} onClick={() => setConfirmRevoke(false)}>انصراف</Button>
                      </Stack>
                    ) : (
                      <Button variant="outlined" color="warning" disabled={busy || !revokeCourseId.trim() || !revokeVersion.trim()}
                        onClick={() => setConfirmRevoke(true)}>درخواست لغو انتشار</Button>
                    )}
                  </Stack>
                </Paper>
              </Stack>
            </Box>
            <Alert severity="info">
              این تأیید صرفاً در محیط موقت ساختگی معتبر است و هیچ حقی برای حساب‌ها یا دادهٔ واقعی ایجاد نمی‌کند.
            </Alert>
          </Stack>
        )}
      </Container>
    </Box>
  );
}
