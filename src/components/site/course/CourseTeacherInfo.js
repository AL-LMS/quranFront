import React from "react";
import { Card, Typography } from "@mui/material";
import sanitizeHtml from "sanitize-html";

const CourseTeacherInfo = ({ data }) => {
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "5px",
        padding: 2,
      }}
    >
      <Typography variant="h6" fontWeight={500} color="mainText">
        اطلاعات مربی
      </Typography>
      <div
        style={{ display: "flex", flexDirection: "column", padding: "20px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <span style={{ fontSize: "20px" }}>{data.teacher_name}</span>
          <img
            src={
              data.teacher_pic
                ? `http://daarolquran.com/back_request/get_teacher_pic/${data.teacher_pic}`
                : NoImage
            }
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </div>
        <Divider />
        <div
          style={{ marginTop: "5px", textAlign: "right" }}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(data["teacher_description"]),
          }}
        ></div>
      </div>
    </Card>
  );
};

export default CourseTeacherInfo;
