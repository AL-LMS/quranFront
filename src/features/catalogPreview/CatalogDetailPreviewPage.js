import React, { useEffect, useRef, useState } from "react";
import {
  ArrowForwardRounded, AutoStoriesOutlined, ComputerOutlined,
  PlaceOutlined, ReplayRounded,
} from "@mui/icons-material";
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Paper, Stack, Typography,
} from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchCatalogDetail } from "./catalogApi";
import { parseCourseId } from "./catalogContract";
import { syntheticCatalogDetail } from "./catalogFixtures";
import { localCatalogApiAllowed } from "./catalogPreviewRoutes";

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
          setResult({
            status: course ? "ready" : "not-found",
            course,
            error: "",
          });
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

  return (
    <Box
      dir="rtl"
      lang="fa"
      sx={{
        minHeight: "100vh",
        pb: 9,
        background: "linear-gradient(180deg, #f5f5fd 0%, #fafaff 380px, #f8f9fc 100%)",
      }}
    >
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Button
              component={Link}
              to={backToList}
              startIcon={<ArrowForwardRounded />}
              sx={{
                px: 2, py: 1, fontWeight: 700, borderRadius: 2,
                color: "#44428f", bgcolor: "#fff",
                border: "1px solid #e4e5f1",
                "&:hover": { bgcolor: "#efeffb" },
              }}
            >
              بازگشت به فهرست دوره‌ها
            </Button>
          </Box>

          {result.status === "loading" && (
            <Paper
              elevation={0}
              role="status"
              sx={{
                border: "1px solid #e6e7ef", borderRadius: 3,
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 2, p: { xs: 5, md: 8 },
              }}
            >
              <CircularProgress size={26} />
              <Typography>در حال بارگذاری اطلاعات دوره…</Typography>
            </Paper>
          )}

          {result.status === "invalid" && (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>شناسه دوره معتبر نیست.</Alert>
          )}
          {result.status === "not-found" && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>دوره موردنظر پیدا نشد.</Alert>
          )}
          {result.status === "error" && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {result.error}
              <Button
                startIcon={<ReplayRounded />}
                onClick={() => setReload((value) => value + 1)}
              >
                تلاش مجدد
              </Button>
            </Alert>
          )}

          {result.status === "ready" && course && (
            <Card
              variant="outlined"
              sx={{
                borderRadius: 4, overflow: "hidden",
                border: "1px solid #e5e7f2",
                boxShadow: "0 18px 54px rgba(38,42,89,.065)",
              }}
            >
              <Box
                sx={{
                  py: { xs: 4, md: 5 },
                  px: { xs: 3, md: 5 },
                  background: "linear-gradient(115deg, #eeedff, #f8f5ff 70%, #fff7ed)",
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AutoStoriesOutlined sx={{ color: "#4d4799" }} />
                    <Typography fontSize=".8rem" fontWeight={700} color="#514d94">
                      معرفی دوره آموزشی
                    </Typography>
                  </Stack>
                  <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                      fontWeight: 800, color: "#29264e",
                      lineHeight: 1.8, overflowWrap: "anywhere",
                    }}
                  >
                    {course.name}
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip
                      label={course.category || "بدون دسته‌بندی"}
                      sx={{ bgcolor: "#fff", color: "#46418e", fontWeight: 700 }}
                    />
                    <Chip
                      icon={course.is_online ? <ComputerOutlined /> : <PlaceOutlined />}
                      label={course.is_online ? "مجازی" : "حضوری"}
                      variant="outlined"
                      sx={{ borderColor: "#d7d8eb", bgcolor: "#ffffffb8", color: "#4b5575" }}
                    />
                  </Stack>
                </Stack>
              </Box>
              <CardContent sx={{ p: { xs: 3, md: 5 }, "&:last-child": { pb: { xs: 3, md: 5 } } }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography
                      component="h2" variant="h6" fontWeight={800}
                      sx={{ color: "#2d2e56", mb: 1.5 }}
                    >
                      درباره این دوره
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 2.25, overflowWrap: "anywhere" }}>
                      {course.summary || "خلاصه‌ای برای این دوره ثبت نشده است."}
                    </Typography>
                  </Box>
                  <Alert
                    severity="info"
                    sx={{ borderRadius: 2, "& .MuiAlert-message": { lineHeight: 2 } }}
                  >
                    اطلاعات این صفحه صرفاً برای پیش‌نمایش است؛ امکان ثبت‌نام وجود ندارد.
                  </Alert>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
