import React, { useContext, useState } from "react";
import axios from "axios";
import useAuth from "../../../../../hooks/useAuth";
import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Stack } from "@mui/system";

import { toastify } from "../../../../../helper/toast";

import NoImage from "../../../../../assets/img/class1.jpeg";
import {
  convert_ages,
  convert_degree,
  convert_sex,
} from "../../../../../helper/converter";
import ShowCourseHWs from "./ShowCourseHWs";

const CoursePageHomeWorks = ({ data_course }) => {
  const { id } = useParams();
  const { auth, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const register_course = async () => {
    setLoading(true);
    let config = {
      url: "insert_request",
    };
    let data = {
      table: "courses",
      method_type: "register_course",
      data: {
        course_id: data_course.course_id,
        student_id: user.user_id,
        student_name: user.first_name + " " + user.last_name,
        teacher_id: data_course.teacher_user_id,
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

      baseURL: "http://127.0.0.1:5000/insert_request/",
    });
    if (response?.data?.tracking_code !== null) {
      toastify("success", response?.data?.response);
      navigate("/panel/dashboard");
    } else {
      toastify("error-login", response?.data?.error);
    }
  };

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
                تمرین‌ها
              </Typography>
            </Grid>
            <Divider />
            <Grid container spacing={3}>
              <ShowCourseHWs data={data_course} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CoursePageHomeWorks;
