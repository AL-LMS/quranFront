import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Button, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import CourseCard from "../../../components/dashboard/students/quiz/CourseCard";
import Loader from "../../../components/site/shared/Loader";

import NoDataImage from "../../../assets/img/no-data.png";
import { Link } from "react-router-dom";
import QuizList from "../../../components/dashboard/students/quiz/QuizList";

const Quiz = () => {
  const { auth, user } = useAuth();
  const [course, setCourse] = useState([]);
  const [courseID, setCourseID] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      // setLoading(true);
      const response = await axios.get(
        `course/specificstudentCourse/?id=${user.pk}`,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      const data = await response.data;
      setCourse(data);
      setLoading(false);
      console.log(response);
      data.map((item) =>
        setCourseID((prevState) => [...prevState, item.courseID])
      );
    };
    fetchCourse();
  }, []);

  if (loading)
    return (
      <Container maxWidth="lg">
        <Grid container mt={3}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                component="h5"
                variant="h6"
                fontWeight={500}
                color="mainText"
              >
                دوره های من
              </Typography>
            </Grid>
            {course.length > 0 ? (
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {course.map((item) => (
                    <Grid item xs={12} md={3} key={item.id}>
                      <CourseCard data={item} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <img
                  src={NoDataImage}
                  alt="no-data"
                  style={{
                    width: "220px",
                    height: "220px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
                <Typography
                  variant="h5"
                  color="#ccc"
                  fontWeight={500}
                  textAlign="center"
                  marginTop={1}
                >
                  دوره ای برای شما ثبت نشده است
                </Typography>
                <Link to="/course">
                  <Button
                    variant="contained"
                    sx={{
                      boxShadow: "none",
                      display: "block",
                      margin: "1rem auto",
                      padding: "8px 25px",
                      borderRadius: 3,
                    }}
                  >
                    خرید دوره
                  </Button>
                </Link>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <QuizList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Quiz;
