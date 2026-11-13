import React, { useEffect, useState } from "react";
import { Link as RouterLink, useParams, useSearchParams } from "react-router-dom";
import {
  Alert, Box, Button, Card, CardActionArea, Chip, Container,
  CircularProgress, Divider, Paper, Stack, Typography,
} from "@mui/material";
import { AutoStoriesOutlined, ArrowBackRounded, RefreshRounded } from "@mui/icons-material";
import { getLocalUuidCourse, listLocalUuidCourses, validCourseId } from "./uuidCatalogApi";

const BASE = "/__preview/m5-uuid";
const PAGE_SIZE = 6;

function useLocalCourses(id, offset) {
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState({ status: "loading", items: [], item: null, message: "" });
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading", items: [], item: null, message: "" });
    async function load() {
      try {
        const item = id
          ? await getLocalUuidCourse(id, { signal: controller.signal })
          : null;
        const items = id
          ? []
          : await listLocalUuidCourses({ limit: PAGE_SIZE, offset, signal: controller.signal });
        if (!controller.signal.aborted) {
          setState({ status: "ready", items, item, message: "" });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            status: "error", items: [], item: null,
            message: error instanceof Error ? error.message : "خطای ناشناخته",
          });
        }
      }
    }
    load();
    return () => controller.abort();
  }, [id, offset, retry]);
  return { ...state, retry: () => setRetry((count) => count + 1) };
}

export default function UuidCatalogLocalPage() {
  const { courseId } = useParams();
  const [params] = useSearchParams();
  const rawOffset = params.get("offset");
  const proposedOffset = rawOffset === null ? 0 : Number(rawOffset);
  const validOffset =
    Number.isSafeInteger(proposedOffset) &&
    proposedOffset >= 0 && proposedOffset <= 10000 && proposedOffset % PAGE_SIZE === 0;
  const offset = validOffset ? proposedOffset : 0;
  const detail = courseId !== undefined;
  const result = useLocalCourses(detail ? courseId : null, offset);

  return (
    <Box dir="rtl" lang="fa" sx={{ minHeight: "100vh", bgcolor: "#f6f7fc", py: { xs: 3, md: 6 } }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{
          p: { xs: 3, sm: 4.5 }, borderRadius: 4, bgcolor: "#28255c",
          color: "white", background: "linear-gradient(115deg, #27255c, #5444a9)",
        }}>
          <Stack spacing={1.2}>
            <Chip label="فقط آزمایش محلی • دادهٔ ساختگی" sx={{
              width: "fit-content", bgcolor: "rgba(255,255,255,.17)", color: "white",
            }} />
            <Typography variant="h4" component="h1" fontWeight={900}>
              {detail ? "جزئیات دوره" : "فهرست دوره‌های قرآن"}
            </Typography>
            <Typography sx={{ opacity: .87, lineHeight: 1.9 }}>
              پیش‌نمایش محلی دوره‌های UUID؛ بدون حساب کاربری، ثبت‌نام یا پرداخت.
            </Typography>
          </Stack>
        </Paper>

        <Stack spacing={2.4} sx={{ mt: 3 }}>
          {detail && (
            <Button component={RouterLink} to={BASE} sx={{ alignSelf: "flex-start" }}>
              بازگشت به دوره‌ها
            </Button>
          )}
          {result.status === "loading" && (
            <Stack direction="row" spacing={1.5} alignItems="center" role="status">
              <CircularProgress size={22} />
              <Typography>در حال دریافت دوره‌های آزمایشی…</Typography>
            </Stack>
          )}
          {result.status === "error" && (
            <Alert severity="error" action={
              <Button color="inherit" size="small" onClick={result.retry} startIcon={<RefreshRounded />}>
                تلاش دوباره
              </Button>
            }>
              {result.message}
            </Alert>
          )}

          {result.status === "ready" && detail && (
            !validCourseId(courseId) || result.item === null ? (
              <Alert severity="info" role="status">
                دوره پیدا نشد یا برای نمایش در فهرست آزمایشی مجاز نیست.
              </Alert>
            ) : (
              <Card variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, sm: 3 } }}>
                <Stack spacing={2}>
                  <AutoStoriesOutlined sx={{ fontSize: 45, color: "#5444a9" }} />
                  <Typography variant="h5" component="h2" fontWeight={800}>
                    {result.item.title}
                  </Typography>
                  <Divider />
                  <Typography color="text.secondary" fontSize=".82rem" dir="ltr">
                    UUID: {result.item.id}
                  </Typography>
                  <Alert severity="info">
                    این یک دورهٔ ساختگی است و هیچ دسترسی واقعی به محتوای آموزشی ندارد.
                  </Alert>
                </Stack>
              </Card>
            )
          )}
          {result.status === "ready" && !detail && (
            !validOffset ? (
              <Alert severity="warning">صفحه‌بندی معتبر نیست.</Alert>
            ) : (
              <>
                {result.items.length === 0 ? (
                  <Alert severity="info">دوره‌ای در این صفحه پیدا نشد.</Alert>
                ) : (
                  <Box sx={{
                    display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}>
                    {result.items.map((course) => (
                      <Card key={course.id} variant="outlined" sx={{
                        borderRadius: 3, borderColor: "#e7e5f3",
                      }}>
                        <CardActionArea component={RouterLink} to={BASE + "/" + course.id}
                          aria-label={"مشاهده جزئیات " + course.title}
                          sx={{ p: 2.5, height: "100%" }}>
                          <Stack spacing={1.4} alignItems="flex-start">
                            <AutoStoriesOutlined sx={{ fontSize: 31, color: "#5444a9" }} />
                            <Typography fontWeight={800} lineHeight={1.9}>{course.title}</Typography>
                            <Typography color="primary" fontSize=".85rem">
                              مشاهده جزئیات <ArrowBackRounded sx={{ verticalAlign: "middle", fontSize: 17 }} />
                            </Typography>
                          </Stack>
                        </CardActionArea>
                      </Card>
                    ))}
                  </Box>
                )}
                <Stack direction="row" gap={2} alignItems="center" justifyContent="center">
                  <Button component={RouterLink}
                    to={offset <= PAGE_SIZE ? BASE : BASE + "?offset=" + (offset - PAGE_SIZE)}
                    disabled={offset === 0} variant="outlined">
                    صفحه قبل
                  </Button>
                  <Typography fontSize=".85rem">صفحه {Math.floor(offset / PAGE_SIZE) + 1}</Typography>
                  <Button component={RouterLink}
                    to={BASE + "?offset=" + (offset + PAGE_SIZE)}
                    disabled={result.items.length < PAGE_SIZE || offset + PAGE_SIZE > 10000}
                    variant="outlined">
                    صفحه بعد
                  </Button>
                </Stack>
              </>
            )
          )}
        </Stack>
      </Container>
    </Box>
  );
}
