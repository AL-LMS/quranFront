import { Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoursePageInfo from "./CoursePage/CoursePageInfo";
import CoursePageNotifs from "./CoursePage/CoursePageNotifs";
import CoursePageQuizes from "./CoursePage/CoursePageQuizes";
import CoursePageHomeWorks from "./CoursePage/CoursePageHomeWorks";
import CoursePageResources from "./CoursePage/CoursePageResources";
import axios from "axios";
import toastify from "../../../../helper/toast";

const CoursePage = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const get_course = async () => {
    let config = {
      url: "select_request",
    };
    let data = {
      table: "courses",
      method_type: "get_course",
      data: {
        id: id,
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
      toastify("error-login", response?.data?.error);
    }
  };
  useEffect(() => {
    get_course().then(() => {});
  }, [id]);
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <CoursePageInfo data_course={data} />
        </Grid>
        <Grid item xs={12}>
          <CoursePageNotifs data_course={[]} id={id} />
        </Grid>
        <Grid item xs={12}>
          <CoursePageHomeWorks data_course={[]} id={id} />
        </Grid>
        <Grid item xs={12}>
          <CoursePageQuizes data_course={[]} id={id} />
        </Grid>
        <Grid item xs={12}>
          <CoursePageResources data_course={[]} id={id} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CoursePage;
