import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Container } from "@mui/system";
import { Grid, Typography } from "@mui/material";

import Loader from "../../../components/site/shared/Loader";

import CourseList from "../../../components/dashboard/teacher/course/CourseList";

const MyCourse = () => {
  const { auth, user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      const response = await axios.get(`course/teacherCourse/?id=${user.pk}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setData(response.data.filter((item) => item.showforTeacher === true));
      setLoading(false);
      console.log(response.data);
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <Container maxWidth="lg">
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader />
          </Grid>
        </Grid>
      </Container>
    );

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Typography
            component="h4"
            variant="h6"
            color="mainText"
            fontWeight={500}
          >
            دوره های من
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CourseList data={data} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MyCourse;
