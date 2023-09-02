import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import CourseImage from "../../../../assets/img/online-education.png";
import { Stack } from "@mui/system";

const CourseCard = ({ data }) => {
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "30px",
      }}
    >
      <CardMedia component="img" src={CourseImage} height={210} />
      <CardContent>
        <Typography variant="body1" color="mainText">
          {data.course_name}
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ marginTop: 1, fontFamily: "iranyekanFn", marginBottom: 2 }}
        ></Typography>
        <Stack direction="row" justifyContent="space-between">
          <Link
            to={`/panel/quiz/quiz-details/${data.courseID}`}
            style={{ display: "block" }}
          >
            <Button variant="outlined" sx={{ borderRadius: "30px" }}>
              آزمون
            </Button>
          </Link>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
