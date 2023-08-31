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

const CourseInfo = ({ data }) => {
  const { departmentID, gradeID, courseTypeID, lessonID, yearID } =
    useContext(DefiContext);
  const { id } = useParams();
  const { auth, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const addToCart = () => {};

  console.log(data);

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
              data.picture1
                ? // ? `https://api.srvschool.ir${data.picture1}`
                  data.picture1
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
                {data["name"]}
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
                    <span style={{ color: "black" }}>{" " + data["type"]}</span>
                  </Typography>
                  <Typography color="mainText">
                    مقطع سنی:
                    <span style={{ color: "black" }}>
                      {" " + convert_ages(data["ages"])}
                    </span>
                  </Typography>
                  <Typography color="mainText">
                    حداقل مدرک تحصیلی:
                    <span style={{ color: "black" }}>
                      {" " + convert_degree(data["degree"])}
                    </span>
                  </Typography>
                  <Typography color="mainText">
                    پیشنیازها:
                    <span style={{ color: "black" }}>
                      {" " + data["prerequisite"]}
                    </span>
                  </Typography>
                  <Typography color="mainText">
                    جنسیت:
                    <span style={{ color: "black" }}>
                      {" " + convert_sex(data["sex"])}
                    </span>
                  </Typography>
                </Stack>
                <Stack spacing={2} sx={{ marginTop: { xs: 2, md: 0 } }}>
                  <Stack direction="row" spacing={5}>
                    <Typography color="mainText">هزینه آموزش دوره:</Typography>
                    <Typography
                      fontWeight={400}
                      color={data["price"] ? "#000" : "error"}
                      fontFamily="iranyekanFn"
                      sx={{
                        textDecoration: !data["price"]
                          ? "line-through"
                          : "initial",
                        color: data["price"] ? "#000" : "#666",
                      }}
                    >
                      {" " + data["price"]?.toLocaleString()} تومان
                    </Typography>
                  </Stack>
                  {data.price2 && (
                    <Stack direction="row" spacing={5}>
                      <Typography color="mainText">قیمت با تخفیف:</Typography>
                      <Typography
                        fontWeight={400}
                        color="error"
                        fontFamily="iranyekanFn"
                      >
                        {data.price2?.toLocaleString()} تومان
                      </Typography>
                    </Stack>
                  )}
                  {/* <Stack direction="row" spacing={5}>
                    <Typography color="mainText">وضعیت دوره:</Typography>
                    <Typography
                      fontWeight={400}
                      color={data.active ? "success.main" : " error"}
                      fontFamily="iranyekanFn"
                    >
                      {data.active ? "فعال" : " غیرفعال"}
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
                    onClick={addToCart}
                    disabled={data.enableforbuy}
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
