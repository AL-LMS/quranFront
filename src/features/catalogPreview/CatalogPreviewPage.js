import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert, Box, Button, CircularProgress, Container, FormControl, Grid,
  InputLabel, MenuItem, Select, Stack, TextField, Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { fetchCatalogPage } from "./catalogApi";
import { MAX_OFFSET, readCatalogFilters } from "./catalogContract";
import { syntheticCatalogPage, syntheticCategories } from "./catalogFixtures";
import { localCatalogApiAllowed } from "./catalogPreviewRoutes";
import CatalogPreviewCard from "./CatalogPreviewCard";

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

  return (
    <Container maxWidth="lg" dir="rtl" lang="fa" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Box>
          <Typography component="h1" variant="h4" gutterBottom>
            دوره‌های آموزشی
          </Typography>
          <Typography color="text.secondary">
            پیش‌نمایش آزمایشی فهرست دوره‌ها؛ بدون ثبت‌نام یا پرداخت
          </Typography>
        </Box>

        <Alert severity="info">
          {usingApi
            ? "حالت آزمایشی API محلی؛ فقط با اتصال مجاز به سرویس توسعه"
            : "این فهرست با داده‌های مصنوعی نمایش داده می‌شود."}
        </Alert>

        {allowApi && (
          <FormControl size="small" sx={{ maxWidth: 320 }}>
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
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="stretch">
            <TextField
              label="جستجوی نام دوره"
              inputProps={{ maxLength: 100 }}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              size="small"
              fullWidth
            />
            <Button type="submit" variant="contained">جستجو</Button>
          </Stack>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="stretch">
          {usingApi ? (
            <TextField
              label="دسته‌بندی"
              size="small"
              inputProps={{ maxLength: 100 }}
              value={filters.category}
              onChange={(event) => changeParam("category", event.target.value)}
              sx={{ minWidth: 200 }}
            />
          ) : (
            <FormControl size="small" sx={{ minWidth: 200 }}>
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
          <FormControl size="small" sx={{ minWidth: 180 }}>
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
          <Button variant="outlined" onClick={resetFilters}>پاک کردن فیلترها</Button>
        </Stack>

        {result.status === "loading" && (
          <Box role="status" sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <CircularProgress size={24} />
            <Typography>در حال بارگذاری دوره‌ها…</Typography>
          </Box>
        )}
        {result.status === "error" && (
          <Alert severity="error">
            {result.error}
            <Button onClick={() => setReload((value) => value + 1)}>تلاش مجدد</Button>
          </Alert>
        )}
        {result.status === "ready" && result.items.length === 0 && (
          <Alert severity="info">دوره‌ای مطابق جستجوی شما پیدا نشد.</Alert>
        )}

        {result.status === "ready" && result.items.length > 0 && (
          <Grid container spacing={2}>
            {result.items.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <CatalogPreviewCard course={course} returnQuery={returnQuery} />
              </Grid>
            ))}
          </Grid>
        )}

        {result.status === "ready" && (
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
            <Button
              onClick={() => changeParam("offset", Math.max(0, filters.offset - filters.limit))}
              disabled={!hasPrevious}
            >
              صفحه قبل
            </Button>
            <Typography aria-label="شماره صفحه">
              صفحه {Math.floor(filters.offset / filters.limit) + 1}
            </Typography>
            <Button
              onClick={() => changeParam("offset", filters.offset + filters.limit)}
              disabled={!hasNext}
            >
              صفحه بعد
            </Button>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
