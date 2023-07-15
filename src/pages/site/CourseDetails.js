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
import { ToastContainer } from "react-toastify";
import { classData } from "./courseData";

const CourseDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(classData[id - 1]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axios.get(`course/course/?id=${id}`);
  //     const data = await response.data;
  //     setData(data);
  //   };
  //   fetchData();
  // }, []);
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
