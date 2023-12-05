import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../../../../hooks/useAuth";
import { Button, Card, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Stack } from "@mui/system";
import { toastify } from "../../../../../helper/toast";
import NoImage from "../../../../../assets/img/class1.jpeg";
import persianDate from "persian-date";
import { getUrl } from "../../../../../helper/getUrl";

const days_show = (days) => {
  let days_string = "";
  for (let index = 0; index < days.length; index++) {
    if (index === 0) {
      days_string = days[index];
    } else {
      days_string = days_string + ", " + days[index];
    }
  }
  return days_string;
};

const edit_show_date = (date) => {
  let date_string = "";
  let date_array = date.split("-");
  date_string = date_array[2] + "-" + date_array[1] + "-" + date_array[0];
  return date_string;
};

const check_time_for_class = (start_date, end_date, time, days) => {
  let today = new persianDate().toLocale("en").format("").slice(0, 10);
  let day = new persianDate(today).toLocale("fa").format("dddd");
  let time_now = new persianDate()
    .subtract("milliseconds", 600000)
    .toLocale("en")
    .format("HH:mm:ss");
  if (today < start_date || today > end_date) {
    toastify("error", "بازه تاریخی دوره صحیح نیست");
  }
  if (today >= start_date && today <= end_date) {
    if (days.includes(day)) {
      toastify("success", "روز برگزاری دوره صحیح است");
      if (time_now >= time) {
        toastify("error", "امروز روز برگزاری دوره نیست");
      }
    } else {
      toastify("error", "امروز روز برگزاری دوره نیست");
    }
  }
};

const CoursePageInfo = ({ data_course }) => {
  const { id } = useParams();
  const { auth, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const register_course = async () => {
    setLoading(true);
    let data = {
      table: "courses",
      method_type: "register_course",
      data: {
        course_id: data_course.course_id,
        user_id: user.user_id,
        user_name: user.first_name + " " + user.last_name,
        user_type: user.role,
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

      baseURL: getUrl() + "back_request/insert_request/",
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
        borderRadius: "5px",
        padding: 2,
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <img
            src={
              data_course?.picture === "default"
                ? NoImage
                : `http://daarolquran.com/back_request/get_course_pic/${data_course?.picture}`
            }
            alt="course"
            style={{ maxWidth: "100%", borderRadius: "5px" }}
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
                textAlign={"center"}
              >
                {data_course?.["name"]}
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
                  <Typography color="mainText" style={{ textAlign: "right" }}>
                    روزهای برگزاری:{" "}
                    <span style={{ color: "black" }}>
                      {data_course?.["days"]
                        ? days_show(data_course?.["days"])
                        : ""}
                    </span>
                  </Typography>
                  <Typography color="mainText" style={{ textAlign: "right" }}>
                    مدت دوره:
                    <span style={{ color: "black" }}>
                      {data_course?.["start_date"]
                        ? " " +
                          edit_show_date(data_course?.["start_date"]) +
                          " تا " +
                          edit_show_date(data_course?.["end_date"])
                        : ""}
                    </span>
                  </Typography>
                  <Typography color="mainText" style={{ textAlign: "right" }}>
                    ساعت برگزاری:
                    <span style={{ color: "black" }}>
                      {data_course?.["start_time"]
                        ? " " +
                          data_course?.["start_time"].slice(0, 5) +
                          " تا " +
                          data_course?.["end_time"].slice(0, 5)
                        : ""}
                    </span>
                  </Typography>
                </Stack>
                <Stack spacing={2} sx={{ marginTop: { xs: 2, md: 0 } }}>
                  <Button
                    sx={{
                      boxShadow: "none",
                      borderRadius: "5px",
                      padding: "10px 10px",
                    }}
                    variant="contained"
                    fullWidth
                    fontSize="17px"
                    onClick={() =>
                      check_time_for_class(
                        data_course?.["start_date"],
                        data_course?.["end_date"],
                        data_course?.["time"],
                        data_course?.["days"]
                      )
                    }
                    disabled={data_course?.enableforbuy}
                  >
                    ورود به کلاس
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

export default CoursePageInfo;
