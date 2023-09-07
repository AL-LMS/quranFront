import React from "react";
import { Card, Divider, Grid, Typography } from "@mui/material";
import ShowCourseResouces from "./ShowObjects/ShowCourseResouces";

const CoursePageResources = ({ data_course }) => {
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "25px",
        padding: 2,
      }}
    >
      <Grid container spacing={3} style={{ justifyContent: "center" }}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                component="h2"
                variant="h4"
                color="#000"
                fontWeight={800}
                marginBottom={5}
                textAlign={"center"}
              >
                منابع
              </Typography>
            </Grid>
            <Divider />
            <Grid container spacing={3}>
              <ShowCourseResouces data={data_course} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CoursePageResources;
