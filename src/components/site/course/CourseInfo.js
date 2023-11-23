import React, { useState } from "react";
import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Stack } from "@mui/system";
import NoImage from "../../../assets/img/class1.jpeg";
import { convert_ages, convert_sex } from "../../../helper/converter";
import { getUrl } from "../../../helper/getUrl";
import toastify from "../../../helper/toast";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
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

const CourseInfo = ({ data_course }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [openModal, setOpenModal] = React.useState(false);
  const navigate = useNavigate();
  const handleClose = () => {
    setOpenModal(false);
  };
  const [loading, setLoading] = useState(false);
  const register_course = async () => {
    setLoading(true);
    let data = {
      table: "courses",
      method_type: "register_course",
      data: {
        course_id: id,
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

      baseURL: getUrl() + "back_request/insert_request/",
    });
    if (response?.data?.tracking_code !== null) {
      toastify("success", response?.data?.response);
      navigate("/panel/course-page/" + id);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };
  return (
    <>
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
                        {" " + days_show(data_course["days"])}
                      </span>
                    </Typography>
                    <Typography color="mainText">
                      مدت دوره:
                      <span style={{ color: "black" }}>
                        {" " +
                          edit_show_date(data_course["start_date"]) +
                          " تا " +
                          edit_show_date(data_course["end_date"])}
                      </span>
                    </Typography>
                    <Typography color="mainText">
                      ساعت برگزاری:
                      <span style={{ color: "black" }}>
                        {" " +
                          data_course["start_time"].slice(0, 5) +
                          " تا " +
                          data_course["end_time"].slice(0, 5)}
                      </span>
                    </Typography>
                  </Stack>
                  <Stack spacing={2} sx={{ marginTop: { xs: 2, md: 0 } }}>
                    <Stack direction="row" spacing={5}>
                      <Typography color="mainText">
                        هزینه آموزش دوره:
                      </Typography>
                      <Typography
                        fontWeight={400}
                        color={"#000"}
                        fontFamily="iranyekanFn"
                        sx={{
                          color: "#000",
                        }}
                      >
                        {data_course["price"] === 0
                          ? " رایگان"
                          : " " +
                            data_course["price"]?.toLocaleString() +
                            "تومان"}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Button
                      sx={{
                        boxShadow: "none",
                        borderRadius: "5px",
                        padding: "10px 0",
                      }}
                      variant="contained"
                      fullWidth
                      fontSize="17px"
                      onClick={
                        data_course["price"] === 0
                          ? () => register_course().then(() => {})
                          : () => setOpenModal(true)
                      }
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

      <Dialog
        open={openModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose()}
        aria-describedby="alert-dialog-slide-description"
        style={{ width: "100%", direction: "rtl", padding: "10px" }}
      >
        <Card
          sx={{
            width: "100%",
            // borderRadius: "5px",
            padding: 2,
          }}
        >
          <Grid item xs={12}>
            <Stack
              sx={{
                flexDirection: { xs: "column", md: "row" },
                justifyContent: { md: "space-between" },
              }}
            >
              <Stack spacing={2} direction="column">
                <Stack direction="row" spacing={5}>
                  <Typography
                    fontWeight={400}
                    color={"#000"}
                    fontFamily="iranyekanFn"
                    sx={{
                      textAlign: "center",
                      color: "#000",
                    }}
                  >
                    {data_course["price"] === 0
                      ? " رایگان"
                      : " " + data_course["price"]?.toLocaleString() + "تومان"}
                  </Typography>
                </Stack>
                <Typography color="mainText">
                  نام دوره:
                  <span style={{ color: "black" }}>
                    {" " + data_course["type"]}
                  </span>
                </Typography>
                <Typography color="mainText">
                  توضیح دوره:
                  <span
                    style={{ color: "black", fontSize: 10, fontStyle: "bold" }}
                  >
                    {" " + data_course["explain"]}
                  </span>
                </Typography>
                <Typography color="mainText">
                  نام مربی:
                  <span
                    style={{ color: "black", fontSize: 10, fontStyle: "bold" }}
                  >
                    {" " + data_course["teacher_name"]}
                  </span>
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Card>
        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button onClick={() => handleClose()}>برگشت</Button>
          <Button
            variant="contained"
            disabled={loading}
            onClick={() => register_course()}
          >
            پرداخت
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseInfo;
