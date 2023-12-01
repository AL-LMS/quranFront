import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "@mui/system";
import { Grid, Pagination, Typography } from "@mui/material";
import Loader from "../../../../../../components/site/shared/Loader";
import CourseNotifsForm from "../../../../../../components/dashboard/teacher/course/CourseNotifsForm";
import toastify from "../../../../../../helper/toast";
import NotifsLists from "../ObjectLists/NotifsLists";
import { useParams } from "react-router-dom";
import { getUrl } from "../../../../../../helper/getUrl";

const CourseNotifes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const { id } = useParams();
  const [count, setCount] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(5);
  const [getNotifs, setGetNotifs] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const get_notifs = async () => {
    let data = {
      table: "courses",
      method_type: "get_notifs",
      data: {
        course_id: id,
        from: from,
        to: to,
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

      baseURL: getUrl() + "back_request/select_request/",
    });
    if (response?.data?.tracking_code !== null) {
      setData(response?.data?.response?.all_course);
      setCount(response?.data?.response?.len);
      setFrom(response?.data?.response?.from);
      setTo(response?.data?.response?.to);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };

  const handlePagination = (value) => {
    setFrom((value - 1) * 5);
    setTo(value * 5);
    setGetNotifs(!getNotifs);
  };
  useEffect(() => {
    get_notifs().then(() => {
      setLoading(false);
    });
  }, [userInfo || reload || getNotifs]);

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
            اطلاعیه‌های دوره
          </Typography>
          <CourseNotifsForm type="create" setReload={setReload} />
        </Grid>
        <Grid item xs={12}>
          <NotifsLists data={data} />
        </Grid>
        <Grid item xs={12} mt={6}>
          <Pagination
            count={Math.ceil(count / 5)}
            color="primary"
            sx={{ display: "flex", justifyContent: "center" }}
            onChange={(event, value) => handlePagination(value)}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseNotifes;
