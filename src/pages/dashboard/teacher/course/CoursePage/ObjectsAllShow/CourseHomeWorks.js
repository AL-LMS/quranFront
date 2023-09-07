import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../../../hooks/useAuth";
import { Container } from "@mui/system";
import { Button, Grid, Typography } from "@mui/material";

import Loader from "../../../../../../components/site/shared/Loader";

import CourseList from "../../../../../../components/dashboard/teacher/course/CourseList";
import { useNavigate, useParams } from "react-router-dom";
import toastify from "../../../../../../helper/toast";

const CourseHomeWorks = () => {
  const { id } = useParams();
  const { auth, user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const get_course = async () => {
    let config = {
      url: "select_request",
    };
    let data = {
      table: "courses",
      method_type: "get_teacher_course",
      data: {
        user_id: userInfo.user_id,
      },
    };
    let response = await axios({
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: {
        ...data,
      },

      baseURL: "http://127.0.0.1:5000/select_request/",
    });
    if (response?.data?.tracking_code !== null) {
      setData(response?.data?.response);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };

  useEffect(() => {
    get_course().then(() => {
      setLoading(false);
    });
  }, [userInfo]);

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
      <Grid container mt={3}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            component="h4"
            variant="h6"
            color="mainText"
            fontWeight={500}
          >
            تمرین‌های دوره
          </Typography>
          <Button
            variant="contained"
            sx={{ boxShadow: "none" }}
            onClick={() => navigate("/panel/new-coures")}
          >
            افزودن تمرین جدید
          </Button>
        </Grid>
        <Grid item xs={12}>
          <CourseList data={data} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseHomeWorks;
