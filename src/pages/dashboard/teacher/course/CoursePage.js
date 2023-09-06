import { Container, Grid } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import CoursePageInfo from "./CoursePage/CoursePageInfo";

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
          <>notifications</>
        </Grid>

        <Grid item xs={12}>
          <>homeworks</>
        </Grid>

        <Grid item xs={12}>
          <>quiz</>
        </Grid>

        <Grid item xs={12}>
          <>resources</>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CoursePage;
