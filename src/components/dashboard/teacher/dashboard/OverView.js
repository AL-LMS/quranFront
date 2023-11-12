import React from "react";
import { Card, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

import StudentsIcon from "../../../../assets/img/users-alt.svg";
import CourseIcon from "../../../../assets/img/e-learning.svg";
import Charts from "../../../../assets/img/chart-line-up.svg";

const OverView = ({ type, count }) => {

  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "5px",
        padding: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Box
          component="span"
          sx={{
            width: "60px",
            height: "60px",
            borderRadius: "10px",
            display: "inline-block",
            backgroundColor: "#651fff",
            textAlign: "center",
            lineHeight: "75px",
          }}
        >
          <img
            src={type === "student" ? StudentsIcon : CourseIcon}
            alt="icon"
          />
        </Box>
        <img src={Charts} alt="chart" />
      </Stack>
      <Stack direction="row" justifyContent="space-between" mt={2}>
        <Typography variant="h6" fontWeight={400} color="mainText">
          {type === "student" ? " تعداد دانش آموزان :" : "دوره های آموزشی :"}
        </Typography>
        <Typography
          variant="h6"
          color="primary"
          fontWeight={600}
          fontFamily="iranyekanFn"
        >
          {count} {type === "student" ? "نفر" : "دوره"}
        </Typography>
      </Stack>
    </Card>
  );
};

export default OverView;
