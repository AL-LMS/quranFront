import React, { useEffect, useState } from "react";
import {
  AdminPanelSettingsOutlined, ArrowForwardRounded, AutoStoriesOutlined,
  AssignmentOutlined, CheckCircleOutlineRounded, CloseRounded,
  RefreshRounded,
} from "@mui/icons-material";
import {
  Alert, Box, Button, Chip, CircularProgress, Container,
  Divider, Paper, Stack, Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { DEMO_STATUS_LABELS, listDemoRequests, reviewDemoRequest } from "./enrollmentDemoApi";

/** No authorization semantics: admin/student are both fictional demo perspectives. */
export default function EnrollmentPreviewPage({ admin = false }) {
  const [reload, setReload] = useState(0);
  const [state, setState] = useState({
    loading: true, items: [], error: "", acting: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, loading: true, error: "" }));
    listDemoRequests({ admin, signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) {
          setState({ loading: false, items, error: "", acting: null });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted && error?.name !== "AbortError") {
          setState((previous) => ({
            ...previous, loading: false,
            error: error instanceof Error ? error.message : "دریافت درخواست‌ها ناموفق بود.",
          }));
        }
      });
    return () => controller.abort();
  }, [admin, reload]);

  async function decide(id, action) {
    if (state.acting !== null) return;
    setState((previous) => ({ ...previous, acting: id, error: "" }));
    try {
      const updated = await reviewDemoRequest(id, action);
      setState((previous) => ({
        ...previous, acting: null,
        items: previous.items.map((item) => item.id === id ? updated : item),
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous, acting: null,
        error: error instanceof Error ? error.message : "بررسی درخواست ناموفق بود.",
      }));
    }
  }

  return (
    <Box dir="rtl" lang="fa" sx={{ minHeight: "100vh", bgcolor: "#f8f9fc", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Button
            component={Link}
            to="/__preview/catalog?source=api"
            startIcon={<ArrowForwardRounded />}
            sx={{
              alignSelf: "flex-start", color: "#5144a3",
              fontWeight: 750, borderRadius: 2,
            }}
          >
            بازگشت به دوره‌ها
          </Button>
          <Paper elevation={0} sx={{
            borderRadius: 4, p: { xs: 3, md: 4 },
            color: "#fff",
            background: "linear-gradient(120deg, #292458, #5745ae)",
          }}>
            <Stack direction="row" gap={1.3} alignItems="center">
              {admin ? <AdminPanelSettingsOutlined /> : <AssignmentOutlined />}
              <Typography fontSize=".82rem" fontWeight={800} color="#dddafa">
                {admin ? "نقش مدیر ساختگی" : "هنرجوی ساختگی"}
              </Typography>
            </Stack>
            <Typography component="h1" sx={{
              fontSize: { xs: "1.55rem", sm: "2rem" }, fontWeight: 900, my: 1.5,
            }}>
              {admin ? "بررسی درخواست‌های ثبت‌نام" : "درخواست‌های ثبت‌نام من"}
            </Typography>
            <Typography sx={{ color: "#eeebff", lineHeight: 2, fontSize: ".87rem" }}>
              این محیط فقط شبیه‌ساز محلی است؛ تأیید یا رد درخواست، دسترسی آموزشی ایجاد نمی‌کند.
            </Typography>
          </Paper>

          <Stack direction={{ xs: "column", sm: "row" }} gap={1.3}
            alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between">
            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Button component={Link} to="/__preview/requests" variant={admin ? "outlined" : "contained"}
                sx={{ borderRadius: 2.3, fontWeight: 800 }}>
                درخواست‌های من
              </Button>
              <Button component={Link} to="/__preview/admin/requests" variant={admin ? "contained" : "outlined"}
                sx={{ borderRadius: 2.3, fontWeight: 800 }}>
                شبیه‌ساز مدیر
              </Button>
            </Stack>
            <Button onClick={() => setReload((count) => count + 1)} startIcon={<RefreshRounded />}
              sx={{ borderRadius: 2.3, fontWeight: 750 }}>
              به‌روزرسانی
            </Button>
          </Stack>

          {state.error && <Alert severity="error" sx={{ borderRadius: 2.5 }}>{state.error}</Alert>}
          {state.loading ? (
            <Box role="status" sx={{ display: "flex", alignItems: "center", gap: 2, py: 4 }}>
              <CircularProgress size={25} /><Typography>در حال بارگذاری درخواست‌ها…</Typography>
            </Box>
          ) : state.items.length === 0 ? (
            <Paper variant="outlined" sx={{ py: 6, px: 3, textAlign: "center", borderRadius: 3.5 }}>
              <AutoStoriesOutlined sx={{ fontSize: 42, color: "#b0a8e3", mb: 1 }} />
              <Typography fontWeight={850} gutterBottom>هنوز درخواستی ثبت نشده است.</Typography>
              <Typography fontSize=".85rem" color="text.secondary" sx={{ lineHeight: 2 }}>
                ابتدا یک دوره را در حالت API محلی انتخاب کنید و درخواست آزمایشی بفرستید.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1.5}>
              {state.items.map((item) => (
                <Paper key={item.id} component="article" variant="outlined"
                  sx={{ borderRadius: 3, p: { xs: 2.3, sm: 3 }, borderColor: "#e5e3f0" }}>
                  <Stack spacing={1.5}>
                    <Stack direction={{ xs: "column", sm: "row" }} gap={1}
                      justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                      <Box>
                        <Typography sx={{ fontWeight: 850, color: "#26264a", lineHeight: 1.85 }}>
                          {item.course_name}
                        </Typography>
                        <Typography fontSize=".75rem" color="text.secondary">
                          درخواست آزمایشی شماره {item.id.toLocaleString("fa-IR")}
                        </Typography>
                      </Box>
                      <Chip
                        color={item.status === "pending" ? "warning" : item.status === "approved" ? "success" : "default"}
                        label={DEMO_STATUS_LABELS[item.status]}
                        sx={{ fontWeight: 750 }}
                      />
                    </Stack>
                    {admin && item.status === "pending" && (
                      <>
                        <Divider sx={{ borderColor: "#f0eef6" }} />
                        <Stack direction={{ xs: "column", sm: "row" }} gap={1.2}>
                          <Button
                            variant="contained" color="success"
                            startIcon={<CheckCircleOutlineRounded />}
                            disabled={state.acting !== null}
                            onClick={() => decide(item.id, "approve")}
                            sx={{ borderRadius: 2.2, fontWeight: 800 }}>
                            تأیید آزمایشی
                          </Button>
                          <Button
                            variant="outlined" color="error"
                            startIcon={<CloseRounded />}
                            disabled={state.acting !== null}
                            onClick={() => decide(item.id, "reject")}
                            sx={{ borderRadius: 2.2, fontWeight: 800 }}>
                            رد آزمایشی
                          </Button>
                        </Stack>
                      </>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
          <Alert severity="info" sx={{ borderRadius: 2.3 }}>
            تمام حساب‌ها، درخواست‌ها و تصمیم‌های این صفحه ساختگی هستند و با خاموش شدن سرور پاک می‌شوند.
          </Alert>
        </Stack>
      </Container>
    </Box>
  );
}
