import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import Loader from "../../../../../../components/site/shared/Loader";
import toastify from "../../../../../../helper/toast";
import { useParams } from "react-router-dom";
import HomeWorksAnswerLists from "../ObjectLists/HomeWorksAnswerLists";
import { getUrl } from "../../../../../../helper/getUrl";

const CourseHomeWorksAnswer = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const get_uploaded_homework = async () => {
    let data = {
      table: "courses",
      method_type: "get_uploaded_homework",
      data: {
        homework_id: id,
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
    get_uploaded_homework().then(() => {
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
            پاسخ تکالیف قرآن‌آموز
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <HomeWorksAnswerLists data={data} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseHomeWorksAnswer;
