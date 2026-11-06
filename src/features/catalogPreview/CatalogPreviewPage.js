import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowBackRounded, ArrowForwardRounded, AutoStoriesOutlined,
  RestartAltRounded, SearchRounded, TuneRounded,
} from "@mui/icons-material";
import {
  Alert, Box, Button, CircularProgress, Container, FormControl, Grid,
  InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { fetchCatalogPage } from "./catalogApi";
import { MAX_OFFSET, readCatalogFilters } from "./catalogContract";
import { syntheticCatalogPage, syntheticCategories } from "./catalogFixtures";
import { localCatalogApiAllowed } from "./catalogPreviewRoutes";
import CatalogPreviewCard from "./CatalogPreviewCard";

const selectSx = {
  minWidth: { xs: "100%", sm: 188 },
  "& .MuiOutlinedInput-root": { bgcolor: "#fff", borderRadius: 2 },
};
const primaryButtonSx = {
  bgcolor: "#3d3c91",
  boxShadow: "none",
  borderRadius: 2,
  fontWeight: 700,
  "&:hover": { bgcolor: "#302f7a", boxShadow: "0 6px 16px rgba(61,60,145,.19)" },
};

export default function CatalogPreviewPage() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readCatalogFilters(params), [params]);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState({ status: "loading", items: [], error: "" });
  const currentRequest = useRef(0);
  const allowApi = localCatalogApiAllowed({
    dev: import.meta.env.DEV,
    routeFlag: import.meta.env.VITE_ENABLE_CATALOG_UI_PREVIEW,
    apiFlag: import.meta.env.VITE_ALLOW_CATALOG_LOCAL_API,
  });
  const usingApi = allowApi && params.get("source") === "api";
  const queryString = params.toString();

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const controller = new AbortController();
    const request = ++currentRequest.current;
    setResult({ status: "loading", items: [], error: "" });

    async function load() {
      try {
        const page = usingApi
          ? await fetchCatalogPage(filters, { signal: controller.signal })
          : syntheticCatalogPage(filters);
        if (!controller.signal.aborted && request === currentRequest.current) {
          setResult({ status: "ready", items: page.items, error: "" });
        }
      } catch (error) {
        if (!controller.signal.aborted && request === currentRequest.current) {
          setResult({
            status: "error", items: [],
            error: error instanceof Error ? error.message : "خطا در دریافت دوره‌ها.",
          });
        }
      }
    }
    load();
    return () => controller.abort();
  }, [filters, usingApi, reload]);

  function changeParam(name, value) {
    const next = new URLSearchParams(params);
    if (value === "") next.delete(name);
    else next.set(name, String(value));
    if (name !== "offset") next.delete("offset");
    setParams(next);
  }

  function submitSearch(event) {
    event.preventDefault();
    changeParam("search", searchInput.trim().slice(0, 100));
  }

  function resetFilters() {
    const next = new URLSearchParams();
    if (usingApi) next.set("source", "api");
    setParams(next);
    setSearchInput("");
  }

  const hasPrevious = filters.offset > 0;
  const hasNext = result.status === "ready" &&
    result.items.length === filters.limit &&
    filters.offset + filters.limit <= MAX_OFFSET;
  const returnQuery = queryString ? "?" + queryString : "";
  const visiblePage = Math.floor(filters.offset / filters.limit) + 1;
  const hasActiveFilters = !!(filters.search || filters.category || filters.is_online);

  return (
    <Box
      dir="rtl"
      lang="fa"
      sx={{
        minHeight: "100vh",
        pb: { xs: 7, md: 10 },
        background: "linear-gradient(180deg, #f5f5fd 0%, #fafaff 400px, #f8f9fc 100%)",
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              overflow: "hidden",
              position: "relative",
              px: { xs: 3, sm: 5, md: 6 },
              py: { xs: 4, md: 5 },
              borderRadius: 4,
              border: "1px solid #e4e5f7",
              background: "linear-gradient(112deg, #fff 0%, #f3f2ff 62%, #eceaff 100%)",
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                position: "absolute", left: { xs: -85, md: 35 }, top: -95,
                width: 245, height: 245, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(126,116,223,.13), transparent 68%)",
                pointerEvents: "none",
              }}
            />
            <Stack spacing={1.4} sx={{ position: "relative", maxWidth: 650 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AutoStoriesOutlined sx={{ color: "#5450a6" }} />
                <Typography sx={{ color: "#4b479f", fontWeight: 750, fontSize: ".83rem" }}>
                  یادگیری، قدم به قدم
                </Typography>
              </Stack>
              <Typography
                component="h1"
                variant="h4"
                sx={{ color: "#25264f", fontWeight: 800, letterSpacing: "-.035em", lineHeight: 1.6 }}
              >
                دوره‌های آموزشی
              </Typography>
              <Typography color="#606580" sx={{ lineHeight: 2.1, fontSize: { xs: ".91rem", md: "1rem" } }}>
                دوره مناسب خود را جستجو کنید، دسته‌بندی‌ها را ببینید و با جزئیات هر دوره آشنا شوید.
              </Typography>
              <Typography sx={{ color: "#666889", fontSize: ".77rem", lineHeight: 1.8 }}>
                پیش‌نمایش آزمایشی فهرست دوره‌ها؛ بدون ثبت‌نام یا پرداخت
              </Typography>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid #e8eaf2",
              borderRadius: 3,
              p: { xs: 2, md: 3 },
              boxShadow: "0 10px 36px rgba(43,45,88,.035)",
              bgcolor: "#fff",
            }}
          >
            <Stack spacing={2.2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Stack direction="row" gap={1} alignItems="center">
                  <TuneRounded fontSize="small" sx={{ color: "#514da1" }} />
                  <Typography fontWeight={700} color="#2e3152">جستجو و فیلتر دوره‌ها</Typography>
                </Stack>
                <Typography fontSize=".75rem" color="text.secondary">
                  {usingApi ? "حالت آزمایشی API محلی" : "این فهرست با داده‌های مصنوعی نمایش داده می‌شود."}
                </Typography>
              </Stack>
              {allowApi && (
                <FormControl size="small" sx={{ width: { xs: "100%", sm: 300 } }}>
                  <InputLabel id="preview-data-source-label">منبع داده</InputLabel>
                  <Select
                    labelId="preview-data-source-label"
                    label="منبع داده"
                    value={usingApi ? "api" : "synthetic"}
                    onChange={(event) => changeParam("source",
                      event.target.value === "api" ? "api" : "")}
                  >
                    <MenuItem value="synthetic">داده مصنوعی</MenuItem>
                    <MenuItem value="api">API محلی (آزمایشی)</MenuItem>
                  </Select>
                </FormControl>
              )}
              <Box component="form" onSubmit={submitSearch}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <TextField
                    label="جستجوی نام دوره"
                    placeholder="نام دوره دلخواهتان را بنویسید…"
                    inputProps={{ maxLength: 100, type: "search" }}
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    size="small"
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#fcfcff", borderRadius: 2 } }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SearchRounded />}
                    sx={{ ...primaryButtonSx, minWidth: { xs: "100%", sm: 132 }, py: 1 }}
                  >
                    جستجو
                  </Button>
                </Stack>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="stretch">
                {usingApi ? (
                  <TextField
                    label="دسته‌بندی"
                    size="small"
                    inputProps={{ maxLength: 100 }}
                    value={filters.category}
                    onChange={(event) => changeParam("category", event.target.value)}
                    sx={selectSx}
                  />
                ) : (
                  <FormControl size="small" sx={selectSx}>
                    <InputLabel id="preview-category-label">دسته‌بندی</InputLabel>
                    <Select
                      labelId="preview-category-label"
                      label="دسته‌بندی"
                      value={filters.category}
                      onChange={(event) => changeParam("category", event.target.value)}
                    >
                      <MenuItem value="">همه دسته‌ها</MenuItem>
                      {syntheticCategories.map((category) => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <FormControl size="small" sx={selectSx}>
                  <InputLabel id="preview-online-label">نوع برگزاری</InputLabel>
                  <Select
                    labelId="preview-online-label"
                    label="نوع برگزاری"
                    value={filters.is_online}
                    onChange={(event) => changeParam("is_online", event.target.value)}
                  >
                    <MenuItem value="">همه</MenuItem>
                    <MenuItem value="true">مجازی</MenuItem>
                    <MenuItem value="false">حضوری</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<RestartAltRounded />}
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  sx={{
                    borderRadius: 2, borderColor: "#d6d9e9", color: "#4b4a86",
                    fontWeight: 600, px: 2, "&:hover": { borderColor: "#8884c8", bgcolor: "#f7f6ff" },
                  }}
                >
                  پاک کردن فیلترها
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              gap={1}
            >
              <Stack spacing={0.4}>
                <Typography component="h2" variant="h6" sx={{ fontWeight: 800, color: "#2d2d54" }}>
                  فهرست دوره‌ها
                </Typography>
                <Typography color="text.secondary" fontSize=".82rem">
                  {hasActiveFilters ? "نتایج جستجو و فیلتر انتخابی شما" : "نگاهی به دوره‌های موجود در پیش‌نمایش"}
                </Typography>
              </Stack>
              {result.status === "ready" && (
                <Typography color="#555a76" fontSize=".83rem" aria-live="polite">
                  {result.items.length} دوره در این صفحه
                </Typography>
              )}
            </Stack>

            {result.status === "loading" && (
              <Paper elevation={0} role="status" sx={{ p: 6, borderRadius: 3, display: "flex", justifyContent: "center", gap: 2, alignItems: "center" }}>
                <CircularProgress size={24} />
                <Typography>در حال بارگذاری دوره‌ها…</Typography>
              </Paper>
            )}
            {result.status === "error" && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {result.error}
                <Button onClick={() => setReload((value) => value + 1)}>تلاش مجدد</Button>
              </Alert>
            )}
            {result.status === "ready" && result.items.length === 0 && (
              <Paper elevation={0} sx={{ textAlign: "center", py: 7, borderRadius: 3, border: "1px solid #e7e9f1" }}>
                <AutoStoriesOutlined sx={{ fontSize: 40, color: "#adaed3", mb: 1 }} />
                <Typography fontWeight={700} color="#30345d" gutterBottom>دوره‌ای پیدا نشد</Typography>
                <Typography color="text.secondary" fontSize=".9rem">جستجو یا فیلترها را تغییر دهید و دوباره امتحان کنید.</Typography>
              </Paper>
            )}

            {result.status === "ready" && result.items.length > 0 && (
              <Grid container spacing={{ xs: 2, md: 2.5 }}>
                {result.items.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <CatalogPreviewCard course={course} returnQuery={returnQuery} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>

          {result.status === "ready" && (
            <Stack
              direction="row" spacing={2} alignItems="center" justifyContent="center"
              sx={{ pt: 2.5, flexWrap: "wrap", gap: 1 }}
            >
              <Button
                startIcon={<ArrowForwardRounded />}
                variant="outlined"
                onClick={() => changeParam("offset", Math.max(0, filters.offset - filters.limit))}
                disabled={!hasPrevious}
                sx={{ borderRadius: 2, borderColor: "#d6d9ea", color: "#3d3c91" }}
              >
                صفحه قبل
              </Button>
              <Box
                sx={{
                  py: 0.95, px: 2.2, borderRadius: 2, bgcolor: "#ececfa",
                  color: "#36347f", fontWeight: 700, whiteSpace: "nowrap",
                }}
              >
                <Typography aria-label="شماره صفحه" fontWeight={700} fontSize=".85rem">
                  صفحه {visiblePage.toLocaleString("fa-IR")}
                </Typography>
              </Box>
              <Button
                endIcon={<ArrowBackRounded />}
                variant="outlined"
                onClick={() => changeParam("offset", filters.offset + filters.limit)}
                disabled={!hasNext}
                sx={{ borderRadius: 2, borderColor: "#d6d9ea", color: "#3d3c91" }}
              >
                صفحه بعد
              </Button>
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
