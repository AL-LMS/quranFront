import React, { useContext, useState } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { DefiContext } from "../../../context/DefiContext";
import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Stack } from "@mui/system";

import { toastify } from "../../../helper/toast";

import NoImage from "../../../assets/img/class1.jpeg";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import {
  convert_ages,
  convert_degree,
  convert_sex,
} from "../../../helper/converter";

const CourseInfo = ({ data_course }) => {
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

      baseURL: "http://127.0.0.1:5000/register_course/",
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <img
            src={
              data_course?.picture1
                ? // ? `https://api.srvschool.ir${data_course.picture1}`
                  data_course?.picture1
                : NoImage
            }
            alt="course"
            style={{ maxWidth: "100%", borderRadius: "20px" }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                component="h2"
                variant="h4"
                color="#000"
                fontWeight={800}
              >
                {data_course["name"]}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ borderBottom: "1px solid #e8e8e8", paddingBottom: 1 }}
              ></Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack
                sx={{
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                }}
              >
                <Stack spacing={2} direction="column">
                  <Typography color="mainText">
                    موضوع دوره:
                    <span style={{ color: "black" }}>
                      {" " + data_course["type"]}
                    </span>
                  </Typography>
                  <Typography color="mainText">
                    مقطع سنی:
                    <span style={{ color: "black" }}>
                      {" " + convert_ages(data_course["ages"])}
                    </span>
                  </Typography>
                  <Typography color="mainText">
                    حداقل مدرک تحصیلی:
                    <span style={{ color: "black" }}>
                      {" " + convert_degree(data_course["degree"])}
                    </span>
                  </Typography>
                  <Typography color="mainText">
                    پیشنیازها:
                    <span style={{ color: "black" }}>
                      {" " + data_course["prerequisite"]}
                    </span>
                  </Typography>
                  <Typography color="mainText">
                    جنسیت:
                    <span style={{ color: "black" }}>
                      {" " + convert_sex(data_course["sex"])}
                    </span>
                  </Typography>
                </Stack>
                <Stack spacing={2} sx={{ marginTop: { xs: 2, md: 0 } }}>
                  <Stack direction="row" spacing={5}>
                    <Typography color="mainText">هزینه آموزش دوره:</Typography>
                    <Typography
                      fontWeight={400}
                      color={data_course["price"] ? "#000" : "error"}
                      fontFamily="iranyekanFn"
                      sx={{
                        textDecoration: !data_course["price"]
                          ? "line-through"
                          : "initial",
                        color: data_course["price"] ? "#000" : "#666",
                      }}
                    >
                      {" " + data_course["price"]?.toLocaleString()} تومان
                    </Typography>
                  </Stack>
                  {data_course.price2 && (
                    <Stack direction="row" spacing={5}>
                      <Typography color="mainText">قیمت با تخفیف:</Typography>
                      <Typography
                        fontWeight={400}
                        color="error"
                        fontFamily="iranyekanFn"
                      >
                        {data_course.price2?.toLocaleString()} تومان
                      </Typography>
                    </Stack>
                  )}
                  {/* <Stack direction="row" spacing={5}>
                    <Typography color="mainText">وضعیت دوره:</Typography>
                    <Typography
                      fontWeight={400}
                      color={data_course.active ? "success.main" : " error"}
                      fontFamily="iranyekanFn"
                    >
                      {data_course.active ? "فعال" : " غیرفعال"}
                    </Typography>
                  </Stack> */}

                  <Divider />
                  <Button
                    sx={{
                      boxShadow: "none",
                      borderRadius: "12px",
                      padding: "10px 0",
                    }}
                    variant="contained"
                    fullWidth
                    fontSize="17px"
                    onClick={() => register_course()}
                    disabled={data_course.enableforbuy}
                  >
                    ثبت نام دوره
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CourseInfo;
