import React from "react";
import { Button } from "@mui/material";

const CourseRequestFeedback = ({ state, onRetry }) => {
  if (state === "loading") {
    return (
      <p role="status" aria-live="polite">
        در حال دریافت دوره‌ها…
      </p>
    );
  }

  if (state === "empty") {
    return <p role="status">در حال حاضر دوره‌ای برای نمایش وجود ندارد.</p>;
  }

  if (state === "error") {
    return (
      <div role="alert" aria-live="assertive">
        <p>دریافت دوره‌ها با خطا مواجه شد. لطفاً دوباره تلاش کنید.</p>
        <Button onClick={onRetry}>تلاش دوباره</Button>
      </div>
    );
  }

  return null;
};

export default CourseRequestFeedback;
