import React from "react";
import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Stack } from "@mui/system";

import NoImage from "../../../assets/img/class1.jpeg";
import {
  convert_ages,
  convert_degree,
  convert_sex,
} from "../../../helper/converter";
import { shamsi_format } from "../../../helper/shamsi_format";

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

const CourseInfo = ({ data_course }) => {
  const { id } = useParams();
  const navigate = useNavigate();

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
              data_course?.picture
                ? `http://daarolquran.com/back_request/get_course_pic/${data_course?.picture}`
                : NoImage
            }
            alt="course"
            style={{ maxWidth: "100%", height: "100%", borderRadius: "5px" }}
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
                {data_course["name"]}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ borderBottom: "1px solid #e8e8e8" }}
              ></Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack
                sx={{
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { md: "space-between" },
                }}
              >
                <Stack spacing={1} direction="column">
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
                  <Typography color="mainText">
                    نوع دوره:
                    <span style={{ color: "black" }}>
                      {" " + data_course["is_onlie"] ? "حضوری" : "مجازی"}
                    </span>
                  </Typography>
                </Stack>
                <Stack spacing={1} direction="column">
                  <Typography color="mainText">
                    روزهای برگزاری:
                    <span style={{ color: "black" }}>
                      {days_show(data_course["days"])}
                    </span>
                  </Typography>
                  <Typography color="mainText">
                    مدت دوره:
                    <span style={{ color: "black" }}>
                      {shamsi_format(data_course["start_date"]) +
                        " تا " +
                        shamsi_format(data_course["end_date"])}
                    </span>
                  </Typography>
                  <Typography color="mainText">
                    ساعت برگزاری:
                    <span style={{ color: "black" }}>
                      {data_course["start_time"].slice(0, 5) +
                        " تا " +
                        data_course["end_time"].slice(0, 5)}
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
                    // onClick={() => register_course()}
                    onClick={() => navigate("/panel/payment/" + id)}
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
