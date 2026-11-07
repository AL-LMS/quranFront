import React, { useEffect, useRef, useState } from "react";
import {
  ArrowForwardRounded, AutoStoriesOutlined, ComputerOutlined,
  PlaceOutlined, ReplayRounded,
} from "@mui/icons-material";
import {
  Alert, Box, Button, Chip, CircularProgress, Container,
  Divider, Paper, Stack, Typography,
} from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchCatalogDetail } from "./catalogApi";
import { parseCourseId } from "./catalogContract";
import { syntheticCatalogDetail } from "./catalogFixtures";
import { localCatalogApiAllowed } from "./catalogPreviewRoutes";
import { getCatalogVisual } from "./catalogVisuals";
import DemoRequestAction from "../enrollmentPreview/DemoRequestAction";
import { enrollmentPreviewEnabledForBuild } from "../enrollmentPreview/enrollmentPreviewGate";

export default function CatalogDetailPreviewPage() {
  const { id: rawId } = useParams();
  const location = useLocation();
  const id = parseCourseId(rawId);
  const searchParams = new URLSearchParams(location.search);
  const allowApi = localCatalogApiAllowed({
    dev: import.meta.env.DEV,
    routeFlag: import.meta.env.VITE_ENABLE_CATALOG_UI_PREVIEW,
    apiFlag: import.meta.env.VITE_ALLOW_CATALOG_LOCAL_API,
  });
  const usingApi = allowApi && searchParams.get("source") === "api";
  const demoRequestsAllowed = usingApi && enrollmentPreviewEnabledForBuild();
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState({ status: "loading", course: null, error: "" });
  const currentRequest = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const request = ++currentRequest.current;
    if (id === null) {
      setResult({ status: "invalid", course: null, error: "" });
      return () => controller.abort();
    }
    setResult({ status: "loading", course: null, error: "" });

    async function load() {
      try {
        const course = usingApi
          ? await fetchCatalogDetail(id, { signal: controller.signal })
          : syntheticCatalogDetail(id);
        if (!controller.signal.aborted && request === currentRequest.current) {
          setResult({ status: course ? "ready" : "not-found", course, error: "" });
        }
      } catch (error) {
        if (!controller.signal.aborted && request === currentRequest.current) {
          setResult({
            status: "error", course: null,
            error: error instanceof Error ? error.message : "خطا در دریافت اطلاعات دوره.",
          });
        }
      }
    }
    load();
    return () => controller.abort();
  }, [id, usingApi, reload]);

  const backToList = "/__preview/catalog" + location.search;
  const course = result.course;
  const theme = getCatalogVisual(course?.category);
  const ModeIcon = course?.is_online ? ComputerOutlined : PlaceOutlined;

  return (
    <Box dir="rtl" lang="fa" sx={{ minHeight: "100vh", pb: 9, bgcolor: "#f8f9fc" }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Button
            component={Link}
            to={backToList}
            startIcon={<ArrowForwardRounded />}
            sx={{
              alignSelf: "flex-start", fontWeight: 800,
              borderRadius: 2.5, px: 2, py: 1,
              color: "#4940a2", bgcolor: "#fff",
              border: "1px solid #e8e6f2",
              "&:hover": { bgcolor: "#f1efff" },
            }}
          >
            بازگشت به فهرست دوره‌ها
          </Button>

          {result.status === "loading" && (
            <Paper elevation={0} role="status" sx={{
              border: "1px solid #e8e7f1", borderRadius: 3.5,
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 2, p: { xs: 5, md: 8 },
            }}>
              <CircularProgress size={28} />
              <Typography>در حال بارگذاری اطلاعات دوره…</Typography>
            </Paper>
          )}
          {result.status === "invalid" && (
            <Alert severity="warning" sx={{ borderRadius: 2.5 }}>شناسه دوره معتبر نیست.</Alert>
          )}
          {result.status === "not-found" && (
            <Alert severity="info" sx={{ borderRadius: 2.5 }}>دوره موردنظر پیدا نشد.</Alert>
          )}
          {result.status === "error" && (
            <Alert severity="error" sx={{ borderRadius: 2.5 }}>
              {result.error}
              <Button startIcon={<ReplayRounded />} onClick={() => setReload((value) => value + 1)}>
                تلاش مجدد
              </Button>
            </Alert>
          )}

          {result.status === "ready" && course && (
            <Paper elevation={0} sx={{
              borderRadius: { xs: 3.5, md: 4.5 },
              overflow: "hidden", border: "1px solid #e8e6f1",
              boxShadow: "0 14px 48px rgba(33,31,84,.06)",
            }}>
              <Box sx={{
                position: "relative", minHeight: { xs: 220, sm: 260 },
                p: { xs: 3, sm: 5 },
                background: theme.gradient, overflow: "hidden",
                display: "flex", alignItems: "center",
              }}>
                <Box aria-hidden="true" sx={{
                  position: "absolute", left: { xs: -70, md: 30 },
                  top: -86, width: 285, height: 285, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,.9)",
                  boxShadow: "0 0 0 25px rgba(255,255,255,.23)",
                  pointerEvents: "none",
                }} />
                <Typography aria-hidden="true" sx={{
                  position: "absolute", bottom: -85, left: { xs: 15, md: 95 },
                  fontSize: { xs: 220, md: 280 },
                  fontWeight: 900, lineHeight: 1,
                  color: theme.accent, opacity: .105,
                  pointerEvents: "none", userSelect: "none",
                }}>
                  {theme.glyph}
                </Typography>
                <Stack spacing={2.1} sx={{ zIndex: 1, position: "relative", maxWidth: 550 }}>
                  <Stack direction="row" gap={1} alignItems="center">
                    <Box sx={{
                      width: 37, height: 37, display: "grid", placeItems: "center",
                      borderRadius: 2, bgcolor: "rgba(255,255,255,.83)", color: theme.ink,
                    }}>
                      <AutoStoriesOutlined sx={{ fontSize: 22 }} />
                    </Box>
                    <Typography fontSize=".81rem" fontWeight={800} color={theme.ink}>
                      معرفی دوره آموزشی
                    </Typography>
                  </Stack>
                  <Typography component="h1" sx={{
                    color: "#252650", fontWeight: 900,
                    fontSize: { xs: "1.5rem", sm: "2.15rem" },
                    lineHeight: 1.75, overflowWrap: "anywhere",
                  }}>
                    {course.name}
                  </Typography>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    <Chip
                      label={course.category || "بدون دسته‌بندی"}
                      sx={{ bgcolor: "#ffffffc9", color: theme.ink, fontWeight: 800 }}
                    />
                    <Chip
                      icon={<ModeIcon sx={{ fontSize: "1rem !important" }} />}
                      label={course.is_online ? "مجازی" : "حضوری"}
                      variant="outlined"
                      sx={{
                        bgcolor: "#ffffffb9", borderColor: "#ffffffdb",
                        color: theme.ink, fontWeight: 700,
                        "& .MuiChip-icon": { color: theme.accent },
                      }}
                    />
                  </Stack>
                </Stack>
              </Box>

              <Box sx={{ p: { xs: 3, sm: 4.5, md: 5 } }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography component="h2" sx={{
                      fontSize: "1.12rem", fontWeight: 900, color: "#2c2c52", mb: 1.3,
                    }}>
                      درباره این دوره
                    </Typography>
                    <Typography sx={{
                      lineHeight: 2.2, color: "#646780",
                      fontSize: ".94rem", overflowWrap: "anywhere",
                    }}>
                      {course.summary || "خلاصه‌ای برای این دوره ثبت نشده است."}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: "#f0eff6" }} />
                  <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                    <Box sx={{
                      flex: 1, bgcolor: "#fafafd", border: "1px solid #efedf6",
                      borderRadius: 2.5, p: 2,
                    }}>
                      <Typography fontSize=".73rem" color="#81819a" fontWeight={700}>
                        دسته‌بندی
                      </Typography>
                      <Typography fontWeight={800} color="#37335e" sx={{ mt: .6 }}>
                        {course.category || "بدون دسته‌بندی"}
                      </Typography>
                    </Box>
                    <Box sx={{
                      flex: 1, bgcolor: "#fafafd", border: "1px solid #efedf6",
                      borderRadius: 2.5, p: 2,
                    }}>
                      <Typography fontSize=".73rem" color="#81819a" fontWeight={700}>
                        نوع برگزاری
                      </Typography>
                      <Typography fontWeight={800} color="#37335e" sx={{ mt: .6 }}>
                        {course.is_online ? "مجازی" : "حضوری"}
                      </Typography>
                    </Box>
                  </Stack>
                  <Alert severity="info" sx={{
                    borderRadius: 2.5, bgcolor: "#eff5ff",
                    "& .MuiAlert-message": { lineHeight: 2 },
                  }}>
                    {demoRequestsAllowed
                      ? "ثبت درخواست در این صفحه فقط شبیه‌سازی است؛ هیچ ثبت‌نام واقعی، پرداخت یا دسترسی آموزشی ایجاد نمی‌شود."
                      : "این صفحه یک پیش‌نمایش آزمایشی است و امکان ثبت‌نام یا پرداخت ندارد."}
                  </Alert>
                  {demoRequestsAllowed && <DemoRequestAction courseId={course.id} />}
                  <Button component={Link} to={backToList}
                    variant="contained" startIcon={<ArrowForwardRounded />}
                    sx={{
                      alignSelf: { xs: "stretch", sm: "flex-start" },
                      bgcolor: "#5144ba", fontWeight: 800, borderRadius: 2.5,
                      px: 3, py: 1.25, boxShadow: "none",
                      "&:hover": { bgcolor: "#40349e" },
                    }}>
                    مرور دوره‌های دیگر
                  </Button>
                </Stack>
              </Box>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
