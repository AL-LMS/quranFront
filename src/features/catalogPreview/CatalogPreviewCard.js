import React from "react";
import { ArrowBackRounded, AutoStoriesOutlined, ComputerOutlined, PlaceOutlined } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

/** Only the five-field candidate catalog contract; no legacy assets or private fields. */
export default function CatalogPreviewCard({ course, returnQuery = "" }) {
  const modeLabel = course.is_online ? "مجازی" : "حضوری";
  const ModeIcon = course.is_online ? ComputerOutlined : PlaceOutlined;

  return (
    <Card
      component="article"
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid #e5e8f0",
        borderRadius: 3,
        boxShadow: "0 8px 28px rgba(38, 42, 89, 0.035)",
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: "#b7bee2",
          boxShadow: "0 18px 36px rgba(38, 42, 89, 0.11)",
        },
        "&:focus-within": {
          borderColor: "#514ca1",
          boxShadow: "0 0 0 3px rgba(81, 76, 161, 0.16)",
        },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          minHeight: 84,
          px: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(115deg, rgba(230,233,255,0.85), rgba(244,240,255,0.94) 68%, rgba(252,241,222,0.75))",
          borderBottom: "1px solid #edf0f7",
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            display: "grid",
            placeItems: "center",
            bgcolor: "#ffffffd9",
            border: "1px solid #dadcf5",
            color: "#49458f",
            borderRadius: 2.5,
          }}
        >
          <AutoStoriesOutlined fontSize="medium" />
        </Box>
        <Typography color="#666491" fontWeight={600} fontSize="0.78rem">
          پیش‌نمایش دوره
        </Typography>
      </Box>

      <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={2} sx={{ height: "100%", flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontSize: "1rem",
              lineHeight: 1.95,
              fontWeight: 700,
              color: "#252748",
              overflowWrap: "anywhere",
              minHeight: "3.9em",
            }}
          >
            {course.name}
          </Typography>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
            <Chip
              size="small"
              variant="filled"
              label={course.category || "بدون دسته‌بندی"}
              sx={{ bgcolor: "#f1f2fb", color: "#454186", fontWeight: 600 }}
            />
            <Chip
              size="small"
              variant="outlined"
              icon={<ModeIcon sx={{ fontSize: "0.95rem !important" }} />}
              label={modeLabel}
              sx={{ borderColor: "#dce0ea", color: "#535b6e", "& .MuiChip-icon": { color: "#5b6291" } }}
            />
          </Stack>

          <Typography
            color="text.secondary"
            sx={{
              flexGrow: 1,
              lineHeight: 2,
              fontSize: "0.87rem",
              minHeight: "4em",
              overflowWrap: "anywhere",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {course.summary || "خلاصه‌ای برای این دوره ثبت نشده است."}
          </Typography>

          <Button
            component={Link}
            to={"/__preview/catalog/" + course.id + returnQuery}
            variant="contained"
            fullWidth
            endIcon={<ArrowBackRounded />}
            aria-label={"مشاهده جزئیات " + course.name}
            sx={{
              py: 1.15,
              mt: "auto",
              bgcolor: "#3d3c91",
              borderRadius: 2,
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { bgcolor: "#302f7a", boxShadow: "0 5px 13px rgba(61,60,145,0.2)" },
            }}
          >
            مشاهده جزئیات
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
