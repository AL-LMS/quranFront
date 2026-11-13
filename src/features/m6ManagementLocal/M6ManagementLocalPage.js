import React, { useEffect, useState } from "react";
import {
  Alert, Box, Button, Card, Chip, CircularProgress, Container,
  Divider, Paper, Stack, TextField, Typography,
} from "@mui/material";
import {
  AddCircleOutline, AutoStoriesOutlined, ArchiveOutlined,
  EditOutlined, LockOutlined, RefreshRounded,
} from "@mui/icons-material";
import {
  archiveManagedCourse, createManagedCourse, editManagedCourse,
  listManagedCourses,
} from "./m6ManagementApi";

const PAGE_SIZE = 20;
const LABELS = {
  draft: "پیش‌نویس",
  published: "منتشرشده در دادهٔ آزمایشی",
  archived: "بایگانی‌شده",
};

export default function M6ManagementLocalPage() {
  // Process/component memory only. Never put tokens in URLs, browser storage,
  // logs, error text, HTTP cookies or backend config.
  const [inputToken, setInputToken] = useState("");
  const [token, setToken] = useState("");
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [reloadIndex, setReloadIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const [selected, setSelected] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [confirmArchive, setConfirmArchive] = useState(false);

  useEffect(() => {
    if (!token) {
      setItems([]);
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    listManagedCourses({ token, limit: PAGE_SIZE, offset, signal: controller.signal })
      .then((page) => {
        if (controller.signal.aborted) return;
        setItems(page.items);
        setLoading(false);
        setError("");
      })
      .catch((cause) => {
        if (controller.signal.aborted) return;
        setItems([]);
        setLoading(false);
        setError(cause.message || "دریافت فهرست ناموفق بود.");
        if (cause.status === 403) setToken("");
      });
    return () => controller.abort();
  }, [token, offset, reloadIndex]);

  function reload() {
    setReloadIndex((value) => value + 1);
  }

  function disconnect() {
    setToken("");
    setInputToken("");
    setItems([]);
    setSelected(null);
    setEditTitle("");
    setCreateTitle("");
    setConfirmArchive(false);
    setNotice("");
    setError("");
  }

  function connect(event) {
    event.preventDefault();
    const candidate = inputToken.trim();
    if (candidate.length < 24 || candidate.length > 200) {
      setError("توکن محلی معتبر وارد کنید.");
      return;
    }
    setError("");
    setNotice("");
    setOffset(0);
    setInputToken("");
    setToken(candidate);
  }

  function choose(row) {
    setSelected(row);
    setEditTitle(row.title);
    setConfirmArchive(false);
    setError("");
    setNotice("");
  }

  async function create(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const item = await createManagedCourse({ token, title: createTitle.trim() });
      setCreateTitle("");
      setSelected(item);
      setEditTitle(item.title);
      setConfirmArchive(false);
      setOffset(0);
      reload();
      setNotice("دورهٔ جدید به‌صورت پیش‌نویس ساخته شد؛ انتشار خودکار وجود ندارد.");
    } catch (cause) {
      setError(cause.message || "ساخت دوره ناموفق بود.");
      if (cause.status === 403) disconnect();
    } finally {
      setBusy(false);
    }
  }

  async function edit(event) {
    event.preventDefault();
    if (!selected || selected.status === "archived" || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const item = await editManagedCourse({
        token,
        courseId: selected.id,
        expectedVersion: selected.version,
        title: editTitle.trim(),
      });
      setSelected(item);
      setEditTitle(item.title);
      setConfirmArchive(false);
      reload();
      setNotice("ویرایش ثبت شد. دوره برای انتشار مجدد نیازمند بررسی است.");
    } catch (cause) {
      setError(cause.message || "ویرایش دوره ناموفق بود.");
      if (cause.status === 409) reload();
      if (cause.status === 403) disconnect();
    } finally {
      setBusy(false);
    }
  }

  async function archive() {
    if (!selected || selected.status === "archived" || busy || !confirmArchive) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const item = await archiveManagedCourse({
        token,
        courseId: selected.id,
        expectedVersion: selected.version,
      });
      setSelected(item);
      setEditTitle(item.title);
      setConfirmArchive(false);
      reload();
      setNotice("دوره بایگانی شد و در فهرست عمومی آزمایشی نمایش داده نمی‌شود.");
    } catch (cause) {
      setError(cause.message || "بایگانی ناموفق بود.");
      if (cause.status === 409) reload();
      if (cause.status === 403) disconnect();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box lang="fa" dir="rtl" sx={{ minHeight: "100vh", bgcolor: "#f7f7fd", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{
          p: { xs: 3, md: 4 }, borderRadius: 4,
          background: "linear-gradient(115deg, #29275e, #5544ac)",
          color: "white",
        }}>
          <Stack spacing={1.3}>
            <Chip label="توسعهٔ محلی • PostgreSQL موقت • دادهٔ ساختگی"
              sx={{ bgcolor: "rgba(255,255,255,.17)", color: "white", alignSelf: "flex-start" }} />
            <Typography variant="h4" component="h1" fontWeight={800}>
              مدیریت دوره‌های قرآن
            </Typography>
            <Typography sx={{ opacity: 0.9, lineHeight: 1.9 }}>
              ساخت پیش‌نویس، ویرایش نسخه‌دار و بایگانی دوره‌ها در محیط آزمایشی؛
              بدون حساب واقعی، ثبت‌نام، پرداخت یا مجوز انتشار.
            </Typography>
          </Stack>
        </Paper>

        {!token ? (
          <Paper elevation={0} variant="outlined" sx={{ mt: 3, p: 3, borderRadius: 3, maxWidth: 620 }}>
            <Stack spacing={2}>
              <Stack direction="row" gap={1} alignItems="center">
                <LockOutlined color="primary" />
                <Typography component="h2" variant="h6" fontWeight={800}>
                  اتصال به مدیریت محلی
                </Typography>
              </Stack>
              <Alert severity="info">
                توکن موقتِ نمایش‌داده‌شده در ترمینال backend را اینجا وارد کنید.
                توکن فقط در حافظهٔ این صفحه نگه‌داری می‌شود و با ترک صفحه پاک می‌شود.
              </Alert>
              <Box component="form" onSubmit={connect}>
                <Stack spacing={2}>
                  <TextField
                    label="توکن مدیریت محلی"
                    type="password"
                    autoComplete="off"
                    value={inputToken}
                    onChange={(event) => setInputToken(event.target.value)}
                    fullWidth
                    inputProps={{ maxLength: 200 }}
                  />
                  <Button variant="contained" type="submit">اتصال به محیط آزمایشی</Button>
                </Stack>
              </Box>
              {error && <Alert severity="error" role="alert">{error}</Alert>}
            </Stack>
          </Paper>
        ) : (
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems={{ sm: "center" }} justifyContent="space-between">
              <Typography color="text.secondary" fontSize=".9rem">
                اتصال موقت فعال است؛ توکن در مرورگر ذخیرهٔ دائمی نمی‌شود.
              </Typography>
              <Button variant="outlined" onClick={disconnect} disabled={busy}>
                قطع اتصال و پاک‌کردن توکن
              </Button>
            </Stack>
            {error && <Alert severity="error" role="alert">{error}</Alert>}
            {notice && <Alert severity="success" role="status">{notice}</Alert>}

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, gap: 3, alignItems: "start" }}>
              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" gap={1} alignItems="center">
                      <AddCircleOutline color="primary" />
                      <Typography component="h2" variant="h6" fontWeight={800}>ایجاد دورهٔ جدید</Typography>
                    </Stack>
                    <Box component="form" onSubmit={create}>
                      <Stack spacing={2}>
                        <TextField
                          label="عنوان دورهٔ جدید"
                          value={createTitle}
                          onChange={(event) => setCreateTitle(event.target.value)}
                          inputProps={{ maxLength: 160 }}
                          fullWidth
                          required
                          disabled={busy}
                        />
                        <Button variant="contained" type="submit" disabled={busy || !createTitle.trim()}>
                          ساخت پیش‌نویس
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" gap={1} justifyContent="space-between">
                      <Typography component="h2" variant="h6" fontWeight={800}>دوره‌های آزمایشی</Typography>
                      <Button size="small" onClick={reload} disabled={loading || busy}
                        startIcon={<RefreshRounded />}>تازه‌سازی</Button>
                    </Stack>
                    {loading && <Stack direction="row" gap={1} alignItems="center" role="status">
                      <CircularProgress size={18} /><Typography>در حال دریافت دوره‌ها…</Typography>
                    </Stack>}
                    {!loading && items.length === 0 && (
                      <Alert severity="info">دوره‌ای برای نمایش نیست.</Alert>
                    )}
                    {!loading && items.map((course) => (
                      <Card key={course.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" gap={1} alignItems="start">
                            <Typography fontWeight={700} lineHeight={1.8}>{course.title}</Typography>
                            <Chip size="small" label={LABELS[course.status]} />
                          </Stack>
                          <Typography color="text.secondary" fontSize=".78rem" dir="ltr">
                            UUID: {course.id} · v{course.version}
                          </Typography>
                          <Button variant="outlined" size="small"
                            onClick={() => choose(course)}
                            disabled={busy}
                            aria-label={"مدیریت " + course.title}>
                            مدیریت دوره
                          </Button>
                        </Stack>
                      </Card>
                    ))}
                    <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                      <Button variant="outlined" disabled={offset === 0 || busy}
                        onClick={() => setOffset((n) => Math.max(0, n - PAGE_SIZE))}>صفحه قبل</Button>
                      <Typography fontSize=".85rem">صفحه {Math.floor(offset / PAGE_SIZE) + 1}</Typography>
                      <Button variant="outlined" disabled={items.length < PAGE_SIZE || busy}
                        onClick={() => setOffset((n) => n + PAGE_SIZE)}>صفحه بعد</Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <EditOutlined color="primary" />
                    <Typography component="h2" variant="h6" fontWeight={800}>ویرایش و بایگانی</Typography>
                  </Stack>
                  {selected === null ? (
                    <Alert severity="info">برای ویرایش یک دوره را از فهرست انتخاب کنید.</Alert>
                  ) : (
                    <>
                      <Chip label={LABELS[selected.status]} sx={{ alignSelf: "flex-start" }} />
                      <Typography fontSize=".82rem" dir="ltr" color="text.secondary">
                        UUID: {selected.id} · v{selected.version}
                      </Typography>
                      <Divider />
                      <Box component="form" onSubmit={edit}>
                        <Stack spacing={2}>
                          <TextField
                            label="عنوان ویرایش"
                            value={editTitle}
                            onChange={(event) => setEditTitle(event.target.value)}
                            inputProps={{ maxLength: 160 }}
                            fullWidth
                            required
                            disabled={busy || selected.status === "archived"}
                          />
                          <Button variant="contained" type="submit" disabled={
                            busy || selected.status === "archived" || !editTitle.trim()
                          }>ذخیرهٔ ویرایش</Button>
                        </Stack>
                      </Box>
                      <Alert severity="info">
                        ویرایش دورهٔ منتشرشده، آن را دوباره پیش‌نویس می‌کند؛
                        هیچ انتشار خودکاری انجام نمی‌شود.
                      </Alert>
                      {selected.status !== "archived" && (
                        confirmArchive ? (
                          <Stack spacing={1}>
                            <Alert severity="warning">آیا این دوره بایگانی شود؟ این اقدام در محیط آزمایشی برگشت‌پذیر نیست.</Alert>
                            <Stack direction="row" gap={1}>
                              <Button variant="contained" color="error" disabled={busy}
                                onClick={archive} startIcon={<ArchiveOutlined />}>
                                تأیید بایگانی
                              </Button>
                              <Button disabled={busy} onClick={() => setConfirmArchive(false)}>
                                انصراف
                              </Button>
                            </Stack>
                          </Stack>
                        ) : (
                          <Button variant="outlined" color="warning" disabled={busy}
                            onClick={() => setConfirmArchive(true)}
                            startIcon={<ArchiveOutlined />}>بایگانی دوره</Button>
                        )
                      )}
                    </>
                  )}
                </Stack>
              </Paper>
            </Box>
            <Alert severity="info" icon={<AutoStoriesOutlined />}>
              این صفحه تنها برای آزمون محلی است؛ نقش مدیر واقعی، انتشار و دسترسی دانشجو در آن پیاده نشده است.
            </Alert>
          </Stack>
        )}
      </Container>
    </Box>
  );
}
