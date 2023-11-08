import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import CourseInfo from "../../components/site/course/CourseInfo";
import CourseDescrption from "../../components/site/course/CourseDescrption";
import { Container } from "@mui/system";
import { useParams } from "react-router-dom";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import { getUrl } from "../../helper/getUrl";
const CourseDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const get_course = async () => {
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

      baseURL: getUrl() + "back_request/select_request/",
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
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12}>
          <CourseInfo data_course={data} />
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
