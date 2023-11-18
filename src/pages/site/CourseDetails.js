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
import { DataDetail } from "../../test";
import CourseTeacherInfo from "../../components/site/course/CourseTeacherInfo";
import Loader from "../../components/site/shared/Loader";
const CourseDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
      setLoading(false);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };
  useEffect(() => {
    get_course().then(() => {});
  }, [id]);
  if (loading)
    return (
      <Container maxWidth="lg">
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Loader />
          </Grid>
        </Grid>
      </Container>
    );

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12}>
          <CourseInfo data_course={data} />
        </Grid>
        <Grid item xs={12}>
          <CourseTeacherInfo data={data} />
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
