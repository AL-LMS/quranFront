import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import CourseInfo from "../../components/site/course/CourseInfo";
import CourseDescrption from "../../components/site/course/CourseDescrption";
import CourseFreeVideos from "../../components/site/course/CourseFreeVideos";
import CourseTitle from "../../components/site/course/CourseTitle";
import RelatedCourse from "../../components/site/course/RelatedCourse";
import { Container } from "@mui/system";
import { useParams } from "react-router-dom";
import { classData } from "./courseData";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
const CourseDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    get_course().then(() => {});
  }, []);
  const get_course = async () => {
    let config = {
      url: "select_request",
    };
    let data = {
      table: "courses",
      method_type: "",
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

      baseURL: "http://127.0.0.1:5000/get_course/",
    });
    if (response?.data?.tracking_code !== null) {
      // setLocalStorageLogin("persist:root", data, () => {});
      // toastify("success", response?.data?.response);
      setData(response?.data?.response);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };
  console.log(data);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12}>
          <CourseInfo data={data} />
        </Grid>
        <Grid item xs={12}>
          <CourseDescrption data={data} />
        </Grid>
        {/* <Grid item xs={12}>
          <RelatedCourse />
        </Grid> */}
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default CourseDetails;
