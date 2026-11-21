/**
 * R21 detached RTL catalog UI. Not registered in App/router or any live route.
 * The only data source is an explicitly injected test transport: no fetch,
 * credentials, real API, enrollment action, or private DTO field is exposed.
 */
import React, { useEffect, useState } from "react";
import {
  Alert, Box, Button, CircularProgress, Paper, Stack, Typography,
} from "@mui/material";
import { r19CourseDetail, r19ListCourses, R19_PAGE_SIZE } from "./r19DetachedCatalog";

export default function R21DetachedCatalogPreview({
  transport,
  limit = R19_PAGE_SIZE,
}) {
  const [cursorStack, setCursorStack] = useState([null]);
  const afterId = cursorStack[cursorStack.length - 1];
  const [page, setPage] = useState(null);
  const [phase, setPhase] = useState("loading");
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailPhase, setDetailPhase] = useState("idle");

  useEffect(() => {
    const controller = new AbortController();
    setPage(null);
    setSelectedId(null);
    setDetail(null);
    setDetailPhase("idle");
    if (typeof transport !== "function") {
      setPhase("disconnected");
      return () => controller.abort();
    }
    setPhase("loading");
    r19ListCourses({ afterId, limit, transport, signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          setPage(result);
          setPhase("ready");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPage(null);
          setPhase("error");
        }
      });
    return () => controller.abort();
  }, [afterId, limit, transport]);

  useEffect(() => {
    if (selectedId === null || typeof transport !== "function") {
      setDetail(null);
      setDetailPhase("idle");
      return undefined;
    }
    const controller = new AbortController();
    setDetail(null);
    setDetailPhase("loading");
    r19CourseDetail(selectedId, { transport, signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          setDetail(result);
          setDetailPhase(result === null ? "missing" : "ready");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setDetail(null);
          setDetailPhase("error");
        }
      });
    return () => controller.abort();
  }, [selectedId, transport]);

  function nextPage() {
    if (phase !== "ready" || !page?.next_after_id) return;
    setPage(null);
    setPhase("loading");
    setSelectedId(null);
    setCursorStack((history) => [...history, page.next_after_id]);
  }

  function previousPage() {
    if (phase !== "ready" || cursorStack.length < 2) return;
    setPage(null);
    setPhase("loading");
    setSelectedId(null);
    setCursorStack((history) => history.slice(0, -1));
  }

  return (
    <Paper component="section" dir="rtl" lang="fa"
      aria-label="پیش‌نمایش جداگانهٔ کاتالوگ UUID"
      sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, bgcolor: "#fafaff" }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h5" component="h2" fontWeight={800}>
            دوره‌های آموزشی
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            پیش‌نمایش آفلاین با شناسهٔ UUID؛ فقط داده‌های ساختگی، بدون انتشار واقعی.
          </Typography>
        </Box>

        {phase === "disconnected" && (
          <Alert severity="info" role="status">
            این پیش‌نمایش به هیچ سرویس واقعی متصل نیست.
          </Alert>
        )}
        {phase === "loading" && (
          <Stack direction="row" alignItems="center" spacing={1} role="status">
            <CircularProgress size={21} aria-label="در حال بارگذاری" />
            <Typography>در حال آماده‌سازی فهرست آزمایشی…</Typography>
          </Stack>
        )}
        {phase === "error" && (
          <Alert severity="warning" role="alert">
            فهرست دوره‌ها در دسترس نیست. بعداً دوباره تلاش کنید.
          </Alert>
        )}

        {phase === "ready" && page?.items.length === 0 && (
          <Typography role="status">دوره‌ای برای نمایش وجود ندارد.</Typography>
        )}
        {phase === "ready" && page?.items.length > 0 && (
          <Box component="ul" sx={{
            listStyle: "none", p: 0, m: 0,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}>
            {page.items.map((course) => (
              <Box component="li" key={course.id} sx={{
                p: 2, border: "1px solid #e4e3f1", borderRadius: 2.5, bgcolor: "#fff",
              }}>
                <Typography component="h3" variant="subtitle1" fontWeight={700}>
                  {course.title}
                </Typography>
                <Button size="small" variant="outlined" sx={{ mt: 1.5 }}
                  onClick={() => setSelectedId(course.id)}
                  aria-label={"مشاهده جزئیات " + course.title}>
                  مشاهده جزئیات
                </Button>
              </Box>
            ))}
          </Box>
        )}

        {phase === "ready" && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Button onClick={previousPage} disabled={cursorStack.length < 2}>
              صفحه قبل
            </Button>
            <Typography aria-label="شماره صفحه">
              صفحه {new Intl.NumberFormat("fa-IR").format(cursorStack.length)}
            </Typography>
            <Button onClick={nextPage} disabled={!page?.next_after_id}>
              صفحه بعد
            </Button>
          </Stack>
        )}

        {phase === "ready" && selectedId !== null && (
          <Paper variant="outlined" component="section" aria-label="جزئیات دوره"
            sx={{ p: 2, borderRadius: 2.5 }}>
            {detailPhase === "loading" && (
              <Typography role="status">در حال دریافت جزئیات آزمایشی…</Typography>
            )}
            {detailPhase === "missing" && (
              <Alert severity="info" role="status">
                دوره در دسترس نیست.
              </Alert>
            )}
            {detailPhase === "error" && (
              <Alert severity="warning" role="alert">
                دریافت جزئیات دوره ممکن نیست.
              </Alert>
            )}
            {detailPhase === "ready" && detail && (
              <Typography component="h3" variant="h6" fontWeight={700}>
                {detail.title}
              </Typography>
            )}
            <Button onClick={() => setSelectedId(null)} sx={{ mt: 1 }}>
              بستن جزئیات
            </Button>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}
