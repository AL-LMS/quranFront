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
import Loader from "../../../../components/site/shared/Loader";
import { getUrl } from "../../../../helper/getUrl";

const CoursePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const { id } = useParams();
  const get_course = async () => {
    let data = {
      table: "courses",
      method_type: "get_course_page",
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
    get_course().then(() => {
      setLoading(false);
    });
  }, []);
  if ((loading, reload))
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
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <CoursePageInfo data_course={data} />
        </Grid>
        <Grid item xs={12}>
          <CoursePageNotifs data_course={data?.notifications} id={id} />
        </Grid>
        <Grid item xs={12}>
          <CoursePageHomeWorks
            data_course={data?.homeworks}
            id={id}
            setReload={setReload}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <CoursePageQuizes data_course={data?.quiz} id={id} />
        </Grid> */}
        <Grid item xs={12} style={{ marginBottom: "50px" }}>
          <CoursePageResources data_course={data?.resources} id={id} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CoursePage;
