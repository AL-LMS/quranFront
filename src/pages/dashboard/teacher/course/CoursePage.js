import { Container, Grid } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import CoursePageInfo from "./CoursePage/CoursePageInfo";
import CoursePageNotifs from "./CoursePage/CoursePageNotifs";
import CourseHomework from "./CourseHomework";
import CoursePageQuizes from "./CoursePage/CoursePageQuizes";
import CoursePageHomeWorks from "./CoursePage/CoursePageHomeWorks";
import CoursePageResources from "./CoursePage/CoursePageResources";

const CoursePage = () => {
  const { id } = useParams();
  let data = [{}, {}];
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <CoursePageInfo data_course={data} />
        </Grid>
        <Grid item xs={12}>
          <CoursePageNotifs data_course={[]} />
        </Grid>

        <Grid item xs={12}>
          <CoursePageHomeWorks data_course={[]} />
        </Grid>

        <Grid item xs={12}>
          <CoursePageQuizes data_course={[]} />
        </Grid>

        <Grid item xs={12}>
          <CoursePageResources data_course={[]} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CoursePage;
