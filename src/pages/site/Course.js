import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Pagination } from "@mui/material";
import Filter from "../../components/site/course/Filter";
import CourseCard from "../../components/site/course/CourseCard";
import { Container } from "@mui/system";
import Loader from "../../components/site/shared/Loader";
import { useSearchParams, useLocation } from "react-router-dom";
import NotFound from "../../components/site/shared/NotFound";
import { classData } from "./courseData";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
const Course = () => {
  const [data, setData] = useState([]);
  const [params, setParams] = useSearchParams();
  const [notFound, setNotFound] = useState(false);
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState({});
  const [filtered, setFiltred] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // if (!location.search) {
    //   setParams({ page: 1 });
    // }
    // const fetchCount = async () => {
    //   const response = await axios.get("dashboard/");
    //   setCount(response.data.t_count);
    // };
    // fetchCount();
    get_courses().then(() => {});
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`course/course/?${params}`);
  //       const data = await response.data;
  //       setData(data);
  //       if (response.data === 404) {
  //         setNotFound(true);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchData();
  // }, [params]);
  const get_courses = async () => {
    let config = {
      url: "select_request",
    };
    let data = {
      table: "courses",
      method_type: "",
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

      baseURL: "http://127.0.0.1:5000/get_courses/",
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
      <Grid container spacing={3} mt={1} mb={12}>
        <Grid item xs={12} md={4}>
          <Filter
            setParams={setParams}
            query={query}
            setQuery={setQuery}
            setFiltred={setFiltred}
          />
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {data.map((course) => (
                <Grid item xs={12} md={4} key={course.id}>
                  <CourseCard data={course} />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} mt={6}>
              <Pagination
                count={Math.ceil(count / 9)}
                color="primary"
                sx={{ display: "flex", justifyContent: "center" }}
                onChange={(event, value) => {
                  setQuery({ ...query, page: value });
                }}
              />
            </Grid>
          </Grid>
        ) : notFound ? (
          <NotFound />
        ) : (
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              height: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader />
          </Grid>
        )}
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Course;
