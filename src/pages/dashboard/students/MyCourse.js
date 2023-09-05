import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Button, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import CourseList from "../../../components/dashboard/students/myCourse/CourseList";

import NoDataImage from "../../../assets/img/no-data.png";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "../../../components/site/shared/Loader";
import toastify from "../../../helper/toast";

const MyCourse = () => {
  const { auth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const get_register_course = async () => {
    setLoading(true);
    let config = {
      url: "select_request",
    };
    let data = {
      table: "courses",
      method_type: "get_register_course",
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
      toastify("error-login", response?.detail);
    }
  };
  useEffect(() => {
    get_register_course().then(() => {
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
          <Typography
            component="h5"
            variant="h6"
            fontWeight={500}
            color="mainText"
          >
            دوره های من
          </Typography>
        </Grid>
        {data.length > 0 ? (
          data.map((course) => (
            <Grid
              key={course.id}
              item
              xs={12}
              sx={{ margin: { sx: "0 auto", md: "0" } }}
            >
              <CourseList data={course} />
            </Grid>
          ))
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
            <Link to="/panel/dashboard">
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
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default MyCourse;
