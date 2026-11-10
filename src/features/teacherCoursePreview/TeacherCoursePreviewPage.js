import React, { useEffect, useRef, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress, Container, Divider,
  FormControlLabel, MenuItem, Paper, Stack, Switch, TextField, Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  createDemoCourse, editDemoCourse, listDemoCourses, mutateReviewedCourse,
  reviewDemoCourse, submitDemoCourse,
} from "./teacherCoursePreviewApi";

const ACTORS = [
  { id: "demo-teacher-a", label: "مربی آزمایشی اول" },
  { id: "demo-teacher-b", label: "مربی آزمایشی دوم" },
  { id: "demo-reviewer", label: "مدیر آزمایشی" },
];
const EMPTY_FORM = { name: "", summary: "", category: "قرآن", is_online: true };
const LABELS = {
  draft: "پیش‌نویس", pending: "در انتظار بررسی",
  approved: "تأیید شده", rejected: "رد شده", revoked: "لغو تأیید",
};
const actionSx = { borderRadius: 2, fontWeight: 800, textTransform: "none" };

function labelFor(item) {
  if (item.archived) return "بایگانی‌شده";
  if (item.approval_status && item.approval_status !== "approved") {
    return LABELS[item.approval_status] || "نامشخص";
  }
  return item.status === "published" ? "منتشرشده" : "پیش‌نویس";
}

export default function TeacherCoursePreviewPage() {
  const [actor, setActor] = useState("demo-teacher-a");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);
  const mutation = useRef(null);
  const isReviewer = actor === "demo-reviewer";

  useEffect(() => {
    const controller = new AbortController();
    setItems([]);
    setLoading(true);
    setError("");
    listDemoCourses(actor, { signal: controller.signal })
      .then((value) => {
        if (!controller.signal.aborted) {
          setItems(value);
          setLoading(false);
        }
      })
      .catch((cause) => {
        if (!controller.signal.aborted && cause?.name !== "AbortError") {
          setLoading(false);
          setError(cause instanceof Error ? cause.message : "خطا در خواندن دادهٔ آزمایشی.");
        }
      });
    return () => {
      controller.abort();
      mutation.current?.abort();
      mutation.current = null;
    };
  }, [actor, reload]);

  function switchActor(next) {
    if (busy || actor === next) return;
    setActor(next);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setItems([]);
    setNotice("");
    setError("");
  }

  async function doAction(operation, message) {
    if (busy || mutation.current) return;
    const controller = new AbortController();
    mutation.current = controller;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await operation(controller.signal);
      if (!controller.signal.aborted) {
        setNotice(message);
        setReload((value) => value + 1);
      }
    } catch (cause) {
      if (!controller.signal.aborted && cause?.name !== "AbortError") {
        setError(cause instanceof Error ? cause.message : "عملیات آزمایشی ناموفق بود.");
      }
    } finally {
      if (mutation.current === controller) {
        mutation.current = null;
        setBusy(false);
      }
    }
  }

  function editField(name, value) {
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function beginEdit(course) {
    setEditingId(course.id);
    setForm({
      name: course.name, summary: course.summary || "",
      category: course.category, is_online: course.is_online,
    });
    setNotice("");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function submitForm(event) {
    event.preventDefault();
    if (isReviewer) return;
    const input = {
      name: form.name.trim(),
      summary: form.summary.trim() || null,
      category: form.category,
      is_online: form.is_online,
    };
    doAction(
      (signal) => editingId === null
        ? createDemoCourse(actor, input, { signal })
        : editDemoCourse(actor, editingId, input, { signal }),
      editingId === null ? "پیش‌نویس آزمایشی ساخته شد." : "ویرایش ثبت شد؛ بازبینی مجدد لازم است.",
    ).then(() => {
      // Never clear a draft after a failed/offline mutation.
    });
  }

  const pending = items.filter((course) => course.status === "draft" &&
    course.approval_status === "pending" && !course.archived);

  return (
    <Box dir="rtl" lang="fa" sx={{ minHeight: "100vh", bgcolor: "#f8f9fc", pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Paper elevation={0} sx={{
            color: "#fff", borderRadius: 4, p: { xs: 3, md: 5 },
            background: "linear-gradient(110deg,#242153,#5b4dba)",
          }}>
            <Typography fontSize=".83rem" fontWeight={800} color="#e5dfff">
              AL-LMS · M5-03 · فقط محیط محلی آزمایشی
            </Typography>
            <Typography component="h1" sx={{
              fontSize: { xs: "1.55rem", md: "2.25rem" }, fontWeight: 900, my: 1.5,
            }}>
              مدیریت و بررسی دوره‌های آموزشی
            </Typography>
            <Typography sx={{ color: "#edeaff", lineHeight: 2 }}>
              نقش‌ها و دوره‌های این صفحه ساختگی هستند. سربرگ نقش آزمایشی هویت واقعی نیست؛
              هیچ حساب، ثبت‌نام، مجوز آموزشی یا انتشار واقعی ایجاد نمی‌شود.
            </Typography>
          </Paper>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} flexWrap="wrap">
            {ACTORS.map(({ id, label }) => (
              <Button key={id} variant={actor === id ? "contained" : "outlined"}
                aria-pressed={actor === id} disabled={busy} onClick={() => switchActor(id)}
                sx={actionSx}>
                {label}
              </Button>
            ))}
            <Button component={Link} to="/__preview/catalog?source=api"
              sx={{ ...actionSx, mr: { sm: "auto" } }}>
              مشاهده فهرست عمومی آزمایشی
            </Button>
          </Stack>

          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            این صفحه فقط به سرور M5-02 آزمایشی روی همین رایانه متصل می‌شود.
            در صورت قطع سرور، هیچ دادهٔ ساختگی یا سرویس واقعی جایگزین نمی‌شود.
          </Alert>
          {error && <Alert severity="error" role="alert">{error}</Alert>}
          {notice && <Alert severity="success" role="status">{notice}</Alert>}

          {!isReviewer && (
            <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3 }}>
              <Typography component="h2" variant="h6" fontWeight={850} mb={2}>
                {editingId === null ? "ساخت پیش‌نویس جدید" : "ویرایش پیش‌نویس آزمایشی"}
              </Typography>
              <Box component="form" onSubmit={submitForm}>
                <Stack spacing={2}>
                  <TextField label="عنوان دوره" value={form.name} required
                    inputProps={{ maxLength: 150 }}
                    onChange={(event) => editField("name", event.target.value)} />
                  <TextField label="خلاصه عمومی" value={form.summary}
                    inputProps={{ maxLength: 500 }} multiline minRows={2}
                    onChange={(event) => editField("summary", event.target.value)} />
                  <TextField select label="دسته‌بندی" value={form.category}
                    onChange={(event) => editField("category", event.target.value)}>
                    <MenuItem value="قرآن">قرآن</MenuItem>
                    <MenuItem value="تجوید">تجوید</MenuItem>
                    <MenuItem value="مفاهیم">مفاهیم</MenuItem>
                  </TextField>
                  <FormControlLabel
                    control={<Switch checked={form.is_online}
                      onChange={(event) => editField("is_online", event.target.checked)} />}
                    label="برگزاری آنلاین"
                  />
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button type="submit" disabled={busy || loading} variant="contained" sx={actionSx}>
                      {editingId === null ? "ساخت پیش‌نویس" : "ثبت ویرایش و درخواست بازبینی"}
                    </Button>
                    {editingId !== null && (
                      <Button disabled={busy} onClick={cancelEdit} sx={actionSx}>
                        انصراف از ویرایش
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          )}

          <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }} mb={2}>
              <Box>
                <Typography component="h2" variant="h6" fontWeight={850}>
                  {isReviewer ? "فهرست بررسی مدیر ساختگی" : "دوره‌های مربی ساختگی"}
                </Typography>
                {isReviewer && !loading && (
                  <Typography color="text.secondary" fontSize=".84rem">
                    {pending.length.toLocaleString("fa-IR")} دوره در انتظار بررسی
                  </Typography>
                )}
              </Box>
              <Button disabled={busy || loading} variant="outlined"
                onClick={() => setReload((value) => value + 1)} sx={actionSx}>
                تازه‌سازی
              </Button>
            </Stack>
            {loading ? (
              <Box role="status" sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 4 }}>
                <CircularProgress size={24} /><Typography>در حال دریافت دوره‌های آزمایشی…</Typography>
              </Box>
            ) : items.length === 0 ? (
              <Alert severity="info">هنوز دوره‌ای برای این نقش آزمایشی وجود ندارد.</Alert>
            ) : (
              <Stack spacing={2}>
                {items.map((course) => (
                  <Paper key={course.id} component="article" elevation={0} variant="outlined"
                    sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2.5 }}>
                    <Stack spacing={1.5}>
                      <Stack direction={{ xs: "column", sm: "row" }} gap={1}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between">
                        <Typography component="h3" fontWeight={850} sx={{ overflowWrap: "anywhere" }}>
                          {course.name}
                        </Typography>
                        <Chip size="small" label={labelFor(course)} />
                      </Stack>
                      <Typography color="text.secondary" fontSize=".85rem">
                        شناسه آزمایشی {course.id.toLocaleString("fa-IR")} · {course.category} ·
                        {course.is_online ? " آنلاین" : " حضوری"}
                      </Typography>
                      {course.summary && (
                        <Typography fontSize=".9rem" sx={{ overflowWrap: "anywhere" }}>
                          {course.summary}
                        </Typography>
                      )}
                      <Divider />
                      <Stack direction={{ xs: "column", sm: "row" }} gap={1} flexWrap="wrap">
                        {!isReviewer && !course.archived && (
                          <Button disabled={busy} sx={actionSx} variant="outlined"
                            onClick={() => beginEdit(course)}>ویرایش</Button>
                        )}
                        {!isReviewer && !course.archived && course.status === "draft" &&
                          [null, "rejected"].includes(course.approval_status) && (
                            <Button disabled={busy} sx={actionSx} variant="contained"
                              onClick={() => doAction(
                                (signal) => submitDemoCourse(actor, course.id, { signal }),
                                "دوره برای بررسی آزمایشی ارسال شد.",
                              )}>ارسال برای بررسی</Button>
                          )}
                        {isReviewer && course.status === "draft" &&
                          course.approval_status === "pending" && !course.archived && (
                            <>
                              <Button disabled={busy} sx={actionSx} color="success" variant="contained"
                                onClick={() => doAction(
                                  (signal) => reviewDemoCourse(actor, course.id, "approve", { signal }),
                                  "دوره آزمایشی تأیید و منتشر شد.",
                                )}>تأیید و انتشار</Button>
                              <Button disabled={busy} sx={actionSx} color="error" variant="outlined"
                                onClick={() => doAction(
                                  (signal) => reviewDemoCourse(actor, course.id, "reject", { signal }),
                                  "درخواست آزمایشی رد شد.",
                                )}>رد درخواست</Button>
                            </>
                          )}
                        {isReviewer && course.status === "published" &&
                          course.approval_status === "approved" && !course.archived && (
                            <Button disabled={busy} sx={actionSx} color="warning" variant="outlined"
                              onClick={() => doAction(
                                (signal) => mutateReviewedCourse(actor, course.id, "revoke", { signal }),
                                "انتشار دوره آزمایشی لغو شد.",
                              )}>لغو انتشار</Button>
                          )}
                        {isReviewer && !course.archived && (
                          <Button disabled={busy} sx={actionSx} color="error" variant="text"
                            onClick={() => doAction(
                              (signal) => mutateReviewedCourse(actor, course.id, "archive", { signal }),
                              "دوره آزمایشی بایگانی شد.",
                            )}>بایگانی</Button>
                        )}
                        {course.status === "published" && course.approval_status === "approved" &&
                          !course.archived && (
                            <Button component={Link} sx={actionSx}
                              to={"/__preview/catalog/" + course.id + "?source=api"}>
                              مشاهده عمومی
                            </Button>
                          )}
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
          <Alert severity="info">
            برای ادامه کار با اطلاعات واقعی، باید قراردادهای مالکیت دوره، احراز هویت و
            مجوزهای دسترسی جداگانه تأیید و پیاده‌سازی شوند. این صفحه هیچ‌کدام از آن‌ها نیست.
          </Alert>
        </Stack>
      </Container>
    </Box>
  );
}
