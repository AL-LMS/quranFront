import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowBackRounded, ArrowForwardRounded, AutoStoriesOutlined,
  CloseRounded, SearchRounded, TuneRounded,
} from "@mui/icons-material";
import {
  Alert, Box, Button, Chip, Container, Grid, InputAdornment, Paper,
  Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { fetchCatalogPage } from "./catalogApi";
import { MAX_OFFSET, readCatalogFilters } from "./catalogContract";
import { syntheticCatalogPage, syntheticCategories } from "./catalogFixtures";
import { localCatalogApiAllowed } from "./catalogPreviewRoutes";
import CatalogPreviewCard from "./CatalogPreviewCard";

const primaryButtonSx = {
  bgcolor: "#5144ba", color: "#fff",
  fontWeight: 800, borderRadius: 2.3, boxShadow: "none",
  "&:hover": { bgcolor: "#40349e", boxShadow: "0 8px 18px rgba(57,44,148,.19)" },
};
const filterButtonSx = {
  borderRadius: 8, px: 2.2, py: .75,
  minWidth: 0, fontSize: ".82rem", fontWeight: 700,
  border: "1px solid #e3e4ed", color: "#50536f",
  bgcolor: "#fff", boxShadow: "none",
  "&:hover": { bgcolor: "#f2f0ff", borderColor: "#a49ce3" },
  "&[aria-pressed='true']": { color: "#fff", bgcolor: "#5144ba", borderColor: "#5144ba" },
};
const modeButtonSx = {
  fontSize: ".81rem", fontWeight: 700,
  border: "0 !important", borderRadius: "8px !important",
  px: { xs: 1.35, sm: 2 },
  color: "#555774", textTransform: "none",
  "&.Mui-selected": { color: "#463d9e", bgcolor: "#fff", boxShadow: "0 2px 8px rgba(42,43,95,.07)" },
};

export default function CatalogPreviewPage() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readCatalogFilters(params), [params]);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState({ status: "loading", items: [], error: "" });
  const requestId = useRef(0);
  const resultsRef = useRef(null);

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
    const request = ++requestId.current;
    setResult({ status: "loading", items: [], error: "" });
    async function load() {
      try {
        const page = usingApi
          ? await fetchCatalogPage(filters, { signal: controller.signal })
          : syntheticCatalogPage(filters);
        if (!controller.signal.aborted && request === requestId.current) {
          setResult({ status: "ready", items: page.items, error: "" });
        }
      } catch (error) {
        if (!controller.signal.aborted && request === requestId.current) {
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

  function changePage(offset) {
    changeParam("offset", offset);
    if (resultsRef.current && typeof resultsRef.current.scrollIntoView === "function") {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const hasActiveFilters = Boolean(filters.search || filters.category || filters.is_online);
  const hasPrevious = filters.offset > 0;
  const hasNext = result.status === "ready" && result.items.length === filters.limit &&
    filters.offset + filters.limit <= MAX_OFFSET;
  const returnQuery = queryString ? "?" + queryString : "";
  const visiblePage = Math.floor(filters.offset / filters.limit) + 1;

  return (
    <Box dir="rtl" lang="fa" sx={{ minHeight: "100vh", pb: { xs: 6, md: 10 }, bgcolor: "#f8f9fc" }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 2.5, md: 4 } }}>
        <Box
          sx={{
            minHeight: { xs: 256, md: 270 },
            position: "relative", overflow: "hidden",
            borderRadius: { xs: 3.5, md: 5 },
            px: { xs: 2.8, sm: 4, md: 6 },
            pt: { xs: 3.2, md: 5 },
            pb: { xs: 8.5, md: 11 },
            bgcolor: "#27255f",
            background: "linear-gradient(114deg, #272558 0%, #3b3389 58%, #5848b7 100%)",
            color: "#fff",
          }}
        >
          <Box aria-hidden="true" sx={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(circle at 5% 80%, rgba(151,139,255,.45), transparent 32%), radial-gradient(circle at 90% 0%, rgba(100,225,199,.13), transparent 38%)",
          }} />
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute", width: { xs: 175, md: 295 },
              height: { xs: 175, md: 295 }, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,.16)",
              left: { xs: -88, md: 100 }, top: { xs: 10, md: -40 },
              boxShadow: "0 0 0 25px rgba(255,255,255,.045), 0 0 0 56px rgba(255,255,255,.025)",
              pointerEvents: "none",
            }}
          />
          <Box aria-hidden="true" sx={{
            position: "absolute", left: { xs: -30, md: "18%" },
            bottom: { xs: -48, md: -75 }, opacity: .15,
            transform: "rotate(-15deg)", pointerEvents: "none",
          }}>
            <AutoStoriesOutlined sx={{ fontSize: { xs: 165, md: 255 } }} />
          </Box>

          <Stack spacing={1.4} sx={{ position: "relative", zIndex: 1, maxWidth: 650 }}>
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <Box sx={{
                display: "flex", alignItems: "center", gap: .75, px: 1.3, py: .5,
                borderRadius: 5, bgcolor: "rgba(255,255,255,.13)",
                border: "1px solid rgba(255,255,255,.18)",
              }}>
                <AutoStoriesOutlined sx={{ fontSize: 17 }} />
                <Typography fontSize=".76rem" fontWeight={750}>دارالقرآن • مسیر یادگیری</Typography>
              </Box>
            </Stack>
            <Typography component="h1" sx={{
              fontSize: { xs: "1.75rem", sm: "2.1rem", md: "2.55rem" },
              lineHeight: 1.65, fontWeight: 900, letterSpacing: "-.035em",
            }}>
              دوره‌های آموزشی
            </Typography>
            <Typography sx={{
              fontSize: { xs: ".89rem", md: "1rem" }, lineHeight: 2.05,
              color: "#e9e7ff", maxWidth: 550,
            }}>
              از روخوانی تا تجوید و مفاهیم؛ موضوع موردعلاقه‌تان را پیدا کنید و با هر دوره آشنا شوید.
            </Typography>
            <Typography sx={{ fontSize: ".75rem", color: "#d5d2f4", lineHeight: 1.8 }}>
              پیش‌نمایش آزمایشی فهرست دوره‌ها؛ بدون ثبت‌نام یا پرداخت
            </Typography>
          </Stack>
        </Box>

        <Paper
          component="section"
          aria-label="جستجو و فیلتر دوره‌ها"
          elevation={0}
          sx={{
            position: "relative", zIndex: 2,
            mx: { xs: 1.3, md: 4 }, mt: { xs: -6.1, md: -7 },
            p: { xs: 2, sm: 2.7, md: 3.5 },
            border: "1px solid #eeedf5", borderRadius: 3.5,
            boxShadow: "0 16px 44px rgba(32,30,85,.09)", bgcolor: "#fff",
          }}
        >
          <Stack spacing={2.4}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }} gap={.7}>
              <Stack direction="row" alignItems="center" gap={.75}>
                <TuneRounded sx={{ fontSize: 20, color: "#5446a7" }} />
                <Typography fontWeight={850} color="#292b52" fontSize=".95rem">
                  جستجو و فیلتر دوره‌ها
                </Typography>
              </Stack>
              <Typography fontSize=".72rem" color="#83829b">
                {usingApi ? "حالت آزمایشی API محلی" : "این فهرست با داده‌های مصنوعی نمایش داده می‌شود."}
              </Typography>
            </Stack>

            {allowApi && (
              <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                <Typography fontSize=".83rem" color="text.secondary">منبع داده:</Typography>
                <Button
                  aria-pressed={!usingApi}
                  onClick={() => changeParam("source", "")}
                  size="small" sx={filterButtonSx}
                >داده مصنوعی</Button>
                <Button
                  aria-pressed={usingApi}
                  onClick={() => changeParam("source", "api")}
                  size="small" sx={filterButtonSx}
                >API محلی</Button>
              </Stack>
            )}

            <Box component="form" onSubmit={submitSearch}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <TextField
                  label="جستجوی نام دوره"
                  placeholder="مثلاً: روخوانی، تجوید یا مفاهیم قرآن"
                  inputProps={{ type: "search", maxLength: 100 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRounded sx={{ color: "#8986a9" }} />
                      </InputAdornment>
                    ),
                  }}
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2.3, bgcolor: "#fbfbff" },
                    "& .MuiInputBase-input": { py: 1.6 },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ ...primaryButtonSx, minWidth: { xs: "100%", sm: 120 }, py: 1.25 }}
                >جستجو</Button>
              </Stack>
            </Box>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}
              alignItems={{ xs: "stretch", md: "center" }} justifyContent="space-between">
              <Stack spacing={1} sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography fontSize=".75rem" color="#777891" fontWeight={800}>موضوع دوره</Typography>
                {usingApi ? (
                  <TextField
                    label="دسته‌بندی" size="small"
                    inputProps={{ maxLength: 100 }}
                    value={filters.category}
                    onChange={(event) => changeParam("category", event.target.value)}
                    sx={{ maxWidth: 320, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                ) : (
                  <Stack direction="row" gap={.85} flexWrap="wrap">
                    {["", ...syntheticCategories].map((category) => (
                      <Button
                        key={category || "all"} size="small"
                        aria-pressed={filters.category === category}
                        onClick={() => changeParam("category", category)}
                        sx={filterButtonSx}
                      >
                        {category || "همه دوره‌ها"}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Stack>
              <Stack spacing={1} sx={{ minWidth: { xs: 0, md: 246 } }}>
                <Typography fontSize=".75rem" color="#777891" fontWeight={800}>نوع برگزاری</Typography>
                <ToggleButtonGroup
                  value={filters.is_online}
                  exclusive
                  size="small"
                  aria-label="نوع برگزاری"
                  onChange={(_event, value) => {
                    if (value !== null) changeParam("is_online", value);
                  }}
                  sx={{
                    width: { xs: "100%", md: "auto" }, p: .45,
                    bgcolor: "#f3f3fa", borderRadius: 2.3,
                    "& .MuiToggleButton-root": { flex: 1 },
                  }}
                >
                  <ToggleButton value="" sx={modeButtonSx}>همه</ToggleButton>
                  <ToggleButton value="true" sx={modeButtonSx}>مجازی</ToggleButton>
                  <ToggleButton value="false" sx={modeButtonSx}>حضوری</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Stack>

            {hasActiveFilters && (
              <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap"
                sx={{ pt: .7, borderTop: "1px solid #f1f1f6" }}>
                <Typography fontSize=".73rem" color="#777891" fontWeight={750}>فیلترهای فعال:</Typography>
                {filters.search && (
                  <Chip size="small" label={"جستجو: " + filters.search}
                    onDelete={() => changeParam("search", "")} sx={{ borderRadius: 2 }} />
                )}
                {filters.category && (
                  <Chip size="small" label={filters.category}
                    onDelete={() => changeParam("category", "")} sx={{ borderRadius: 2 }} />
                )}
                {filters.is_online && (
                  <Chip size="small" label={filters.is_online === "true" ? "مجازی" : "حضوری"}
                    onDelete={() => changeParam("is_online", "")} sx={{ borderRadius: 2 }} />
                )}
              </Stack>
            )}
            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              <Button
                size="small" startIcon={<CloseRounded />}
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                sx={{ color: "#5345a5", fontWeight: 750, borderRadius: 2, px: 1.5 }}
              >
                پاک کردن فیلترها
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Box component="section" ref={resultsRef} aria-label="فهرست دوره‌ها" sx={{ mt: { xs: 4, md: 5 }, scrollMarginTop: 88 }}>
          <Stack direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}
            gap={1.1} sx={{ mb: 2.3, px: { xs: .7, sm: .4 } }}>
            <Box>
              <Typography component="h2" sx={{ fontSize: { xs: "1.16rem", md: "1.35rem" }, fontWeight: 900, color: "#27284e" }}>
                فهرست دوره‌ها
              </Typography>
              <Typography fontSize=".8rem" color="#7d7d92" sx={{ mt: .45 }}>
                {hasActiveFilters ? "دوره‌های مرتبط با انتخاب شما" : "دوره‌های آموزشی را مرور کنید"}
              </Typography>
            </Box>
            {result.status === "ready" && (
              <Chip
                aria-live="polite"
                variant="outlined"
                label={result.items.length.toLocaleString("fa-IR") + " دوره در این صفحه"}
                sx={{ fontSize: ".76rem", fontWeight: 750, color: "#4e4795", borderColor: "#dddaef", bgcolor: "#f3f1ff" }}
              />
            )}
          </Stack>

          {result.status === "loading" && (
            <Box role="status">
              <Grid container spacing={{ xs: 1.7, md: 2.5 }}>
                {Array.from({ length: 6 }, (_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Skeleton variant="rounded" height={315} sx={{ borderRadius: 3 }} />
                  </Grid>
                ))}
              </Grid>
              <Typography sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
                در حال بارگذاری دوره‌ها…
              </Typography>
            </Box>
          )}

          {result.status === "error" && (
            <Alert severity="error" sx={{ borderRadius: 3, p: 2 }}>
              {result.error}
              <Button onClick={() => setReload((value) => value + 1)} sx={{ mx: 1 }}>تلاش مجدد</Button>
            </Alert>
          )}

          {result.status === "ready" && result.items.length === 0 && (
            <Paper elevation={0} sx={{
              border: "1px dashed #d8d5eb", bgcolor: "#fff",
              borderRadius: 3, py: 6, px: 2, textAlign: "center",
            }}>
              <SearchRounded sx={{ fontSize: 42, color: "#bbb4e6", mb: 1 }} />
              <Typography fontWeight={850} color="#292a55" gutterBottom>دوره‌ای پیدا نشد</Typography>
              <Typography fontSize=".85rem" color="text.secondary" sx={{ mb: 2 }}>
                جستجو یا فیلترها را تغییر دهید و دوباره امتحان کنید.
              </Typography>
              {hasActiveFilters && (
                <Button onClick={resetFilters} variant="outlined" sx={{ borderRadius: 2 }}>
                  نمایش همه دوره‌ها
                </Button>
              )}
            </Paper>
          )}

          {result.status === "ready" && result.items.length > 0 && (
            <Grid container spacing={{ xs: 1.8, md: 2.5 }}>
              {result.items.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <CatalogPreviewCard
                    course={course}
                    returnQuery={returnQuery}
                    isSynthetic={!usingApi}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {result.status === "ready" && (
            <Stack direction="row" justifyContent="center" alignItems="center"
              gap={{ xs: .6, sm: 2 }} sx={{ pt: 4, pb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowForwardRounded />}
                disabled={!hasPrevious}
                onClick={() => changePage(Math.max(0, filters.offset - filters.limit))}
                sx={{ borderRadius: 2.5, borderColor: "#dfddea", color: "#50489f", px: { xs: 1, sm: 2 }, fontWeight: 750 }}
              >
                صفحه قبل
              </Button>
              <Box sx={{
                borderRadius: 2.5, bgcolor: "#eae8fa", px: { xs: 1.6, sm: 2.2 }, py: 1,
                textAlign: "center", color: "#433c95", whiteSpace: "nowrap",
              }}>
                <Typography aria-label="شماره صفحه" fontWeight={850} fontSize=".85rem">
                  صفحه {visiblePage.toLocaleString("fa-IR")}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                endIcon={<ArrowBackRounded />}
                disabled={!hasNext}
                onClick={() => changePage(filters.offset + filters.limit)}
                sx={{ borderRadius: 2.5, borderColor: "#dfddea", color: "#50489f", px: { xs: 1, sm: 2 }, fontWeight: 750 }}
              >
                صفحه بعد
              </Button>
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
}
