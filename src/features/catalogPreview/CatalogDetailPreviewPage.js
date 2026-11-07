import React, { useEffect, useRef, useState } from "react";
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Stack, Typography,
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
  return (
    <Container maxWidth="md" dir="rtl" lang="fa" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Button component={Link} to={backToList} sx={{ alignSelf: "flex-start" }}>
          بازگشت به فهرست دوره‌ها
        </Button>
        {result.status === "loading" && (
          <Box role="status" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress size={24} />
            <Typography>در حال بارگذاری اطلاعات دوره…</Typography>
          </Box>
        )}
        {result.status === "invalid" && (
          <Alert severity="warning">شناسه دوره معتبر نیست.</Alert>
        )}
        {result.status === "not-found" && (
          <Alert severity="info">دوره موردنظر پیدا نشد.</Alert>
        )}
        {result.status === "error" && (
          <Alert severity="error">
            {result.error}
            <Button onClick={() => setReload((value) => value + 1)}>تلاش مجدد</Button>
          </Alert>
        )}
        {result.status === "ready" && (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={3}>
                <Typography component="h1" variant="h4" sx={{ overflowWrap: "anywhere" }}>
                  {result.course.name}
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip label={result.course.category || "بدون دسته‌بندی"} />
                  <Chip label={result.course.is_online ? "مجازی" : "حضوری"} />
                </Stack>
                <Typography>
                  {result.course.summary || "خلاصه‌ای برای این دوره ثبت نشده است."}
                </Typography>
                <Alert severity="info">
                  اطلاعات این صفحه صرفاً برای پیش‌نمایش است؛ امکان ثبت‌نام وجود ندارد.
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
