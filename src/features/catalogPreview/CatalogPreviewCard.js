import React from "react";
import { Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

/** Intentionally independent of legacy CourseCard's private/course payment fields. */
export default function CatalogPreviewCard({ course, returnQuery = "" }) {
  return (
    <Card variant="outlined" sx={{ height: "100%", borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={2} sx={{ height: "100%" }}>
          <Typography variant="h6" component="h2" sx={{ overflowWrap: "anywhere" }}>
            {course.name}
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={course.category || "بدون دسته‌بندی"} size="small" />
            <Chip
              label={course.is_online ? "مجازی" : "حضوری"}
              size="small"
              variant="outlined"
            />
          </Stack>
          <Typography color="text.secondary" sx={{ flexGrow: 1, overflowWrap: "anywhere" }}>
            {course.summary || "خلاصه‌ای برای این دوره ثبت نشده است."}
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to={"/__preview/catalog/" + course.id + returnQuery}
            aria-label={"مشاهده جزئیات " + course.name}
          >
            مشاهده جزئیات
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
