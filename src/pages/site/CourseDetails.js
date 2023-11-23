import React, { useState } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import CourseInfo from "../../components/site/course/CourseInfo";
import CourseDescrption from "../../components/site/course/CourseDescrption";
import { Container } from "@mui/system";
import { useParams } from "react-router-dom";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import { getUrl } from "../../helper/getUrl";
import CourseTeacherInfo from "../../components/site/course/CourseTeacherInfo";
import Loader from "../../components/site/shared/Loader";
const CourseDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState({
    course_id: 11,
    days: ["یکشنبه", "دوشنبه", "سه شنبه"],
    end_date: "1402-11-28",
    start_date: "1402-08-28",
    teacher_name: "محمدرضا قادری",
    teacher_user_id: 1,
    teacher_pic: "Fi0SsaPWYAghPcM.jpeg",
    teacher_description: "سوابق من",
    explain: "قرائت بایستی بتوانیم انجام دهیم.",
    is_online: false,
    ages: 2,
    degree: 1,
    sex: 0,
    type: "قرائت",
    name: "دوره تست قرائت",
    min: 1,
    max: 50,
    price: 100000,
    prerequisite: [],
    start_time: "09:00:00",
    end_time: "11:00:00",
    picture: "catsee.jpg",
  });
  const [loading, setLoading] = useState(false);
  const get_course = async () => {
    console.log("set api");
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
  // useEffect(() => {
  //   setLoading(true);
  //   get_course().then(() => {
  //     setLoading(false);
  //   });
  // }, [id]);
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
        <Grid item xs={12} style={{ marginBottom: "50px" }}>
          <CourseDescrption data={data} />
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default CourseDetails;
