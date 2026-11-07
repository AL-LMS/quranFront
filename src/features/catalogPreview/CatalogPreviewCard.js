import React from "react";
import { ArrowBackRounded, AutoStoriesOutlined, ComputerOutlined, PlaceOutlined } from "@mui/icons-material";
import { Box, Card, CardActionArea, Chip, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { getCatalogVisual } from "./catalogVisuals";

/** Clickable card based only on public course fields. No invented photos/price/teacher. */
export default function CatalogPreviewCard({ course, returnQuery = "", isSynthetic = false }) {
  const theme = getCatalogVisual(course.category);
  const ModeIcon = course.is_online ? ComputerOutlined : PlaceOutlined;
  return (
    <Card
      component="article"
      variant="outlined"
      sx={{
        height: "100%", borderRadius: { xs: 3, md: 3.5 },
        overflow: "hidden", border: "1px solid #e8e9f0", bgcolor: "#fff",
        boxShadow: "0 3px 15px rgba(28,29,68,.035)",
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        "@media (hover: hover)": {
          "&:hover": {
            transform: "translateY(-5px)",
            borderColor: "#cbc8e8",
            boxShadow: "0 20px 36px rgba(32,32,83,.10)",
          },
        },
        "&:focus-within": {
          borderColor: "#5045a8", boxShadow: "0 0 0 3px rgba(80,69,168,.14)",
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={"/__preview/catalog/" + course.id + returnQuery}
        aria-label={"مشاهده جزئیات " + course.name}
        sx={{
          display: "flex", flexDirection: "column", alignItems: "stretch",
          height: "100%", textAlign: "right", borderRadius: 3,
          "&:focus-visible": { outline: "3px solid #5045a8", outlineOffset: -3 },
        }}
      >
        <Box
          sx={{
            minHeight: { xs: 94, sm: 116 },
            p: { xs: 1.8, sm: 2 },
            position: "relative", overflow: "hidden",
            background: theme.gradient, isolation: "isolate",
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1px solid rgba(46,40,104,.045)",
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute", top: -61, left: -30, width: 160, height: 160,
              border: "1px solid rgba(255,255,255,.75)",
              borderRadius: "50%", boxShadow: "0 0 0 20px rgba(255,255,255,.15)",
            }}
          />
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute", bottom: -80, right: "28%",
              width: 150, height: 150,
              transform: "rotate(30deg)", borderRadius: 8,
              background: "rgba(255,255,255,.18)",
            }}
          />
          <Box
            sx={{
              position: "relative", zIndex: 1, display: "inline-flex",
              alignItems: "center", gap: .7, px: 1.25, py: .55,
              borderRadius: 5, bgcolor: "rgba(255,255,255,.83)",
              color: theme.ink, fontWeight: 800, fontSize: ".76rem",
              border: "1px solid rgba(255,255,255,.65)",
            }}
          >
            <AutoStoriesOutlined sx={{ fontSize: 17 }} />
            {course.category || "آموزشی"}
          </Box>
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute", bottom: { xs: -24, sm: -31 },
              left: { xs: 25, sm: 30 }, fontFamily: "inherit",
              fontSize: { xs: 110, sm: 138 }, fontWeight: 900, lineHeight: 1.25,
              color: theme.accent, opacity: .12, userSelect: "none",
            }}
          >
            {theme.glyph}
          </Box>
          {isSynthetic && (
            <Typography
              sx={{
                position: "relative", zIndex: 1, fontSize: ".69rem",
                color: theme.ink, opacity: .8, mt: .7, fontWeight: 600,
              }}
            >
              نمونه نمایشی
            </Typography>
          )}
        </Box>

        <Stack sx={{ px: { xs: 2, sm: 2.5 }, pt: 2.1, pb: 2, flexGrow: 1, minHeight: 0 }} spacing={1.5}>
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: "1.03rem", md: "1.07rem" },
              lineHeight: 1.85, color: "#25274c", fontWeight: 800,
              minHeight: "3.7em", overflowWrap: "anywhere",
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}
          >
            {course.name}
          </Typography>

          <Typography
            sx={{
              color: "#6a6c83", fontSize: ".83rem", lineHeight: 2,
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
              minHeight: "4em", flexGrow: 1, overflowWrap: "anywhere",
            }}
          >
            {course.summary || "خلاصه‌ای برای این دوره ثبت نشده است."}
          </Typography>

          <Box
            sx={{
              pt: 1.3, borderTop: "1px solid #f0f0f5",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: 1,
            }}
          >
            <Chip
              size="small"
              icon={<ModeIcon sx={{ fontSize: "1rem !important" }} />}
              label={course.is_online ? "مجازی" : "حضوری"}
              variant="outlined"
              sx={{
                height: 27, bgcolor: "#fafafd", color: "#53566f",
                fontWeight: 600, border: "1px solid #e6e7f0",
                "& .MuiChip-icon": { color: "#6b67a8" },
              }}
            />
            <Stack direction="row" alignItems="center" gap={.4}>
              <Typography fontSize=".83rem" fontWeight={800} color="#463d9f">
                مشاهده جزئیات
              </Typography>
              <Box
                sx={{
                  bgcolor: "#f0eeff", display: "grid", placeItems: "center",
                  borderRadius: "50%", width: 29, height: 29, color: "#5148ae",
                }}
              >
                <ArrowBackRounded sx={{ fontSize: 19 }} />
              </Box>
            </Stack>
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
