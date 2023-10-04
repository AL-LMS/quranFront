import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import Loader from "../../../../../../components/site/shared/Loader";
import { useNavigate, useParams } from "react-router-dom";
import toastify from "../../../../../../helper/toast";
import CourseQuizForm from "../../../../../../components/dashboard/teacher/course/CourseQuizForm";
import QuizLists from "../ObjectLists/QuizLists";
import { getUrl } from "../../../../../../helper/getUrl";

const CourseQuize = () => {
  const { id } = useParams();
  const [reload, setReload] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const get_quizzes = async () => {
    let config = {
      url: "select_request",
    };
    let data = {
      table: "courses",
      method_type: "get_quizzes",
      data: {
        course_id: id,
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
      setData(response?.data?.response);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };

  useEffect(() => {
    get_quizzes().then(() => {
      setLoading(false);
    });
  }, [userInfo, reload]);

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
            آزمون‌های دوره
          </Typography>
          <CourseQuizForm type="create" setReload={setReload} />
        </Grid>
        <Grid item xs={12}>
          <QuizLists data={data} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseQuize;
