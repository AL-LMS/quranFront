import React from "react";
import { Card, Typography } from "@mui/material";
import sanitizeHtml from "sanitize-html";

const CourseDescrption = ({ data }) => {
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "25px",
        padding: 2,
      }}
    >
      <Typography variant="h6" fontWeight={500} color="mainText">
        توضیحات دوره
      </Typography>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(data.description),
        }}
      ></div>
    </Card>
  );
};

export default CourseDescrption;
