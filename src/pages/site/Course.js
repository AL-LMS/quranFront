import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Pagination } from "@mui/material";
import Filter from "../../components/site/course/Filter";
import CourseCard from "../../components/site/course/CourseCard";
import { Container } from "@mui/system";
import Loader from "../../components/site/shared/Loader";
import { useSearchParams, useNavigate } from "react-router-dom";
import NotFound from "../../components/site/shared/NotFound";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import { getUrl } from "../../helper/getUrl";
import Data from "../../test";
const Course = () => {
  const [data, setData] = useState(Data);
  const [item, setItem] = useState([]);
  const [params, setParams] = useSearchParams();
  const [notFound, setNotFound] = useState(false);
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState({});
  const [filtered, setFiltred] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("role"))
  );
  useEffect(() => {
    setItem(data.slice(0, 6));
    setCount(data.length);
  }, [data]);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (userInfo?.national_id === null) {
  //     toastify("warning", "لطفا اطلاعات خود را تکمیل کنید.");
  //     navigate("/panel/profile");
  //   }
  //   get_courses().then(() => {});
  // }, [userInfo, query]);
  const get_courses = async () => {
    let data = {
      table: "courses",
      method_type: "get_courses",
      data: {
        query: query,
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
              {item.map((course) => (
                <Grid item xs={12} md={4} key={course.id}>
                  <CourseCard data={course} />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} mt={6}>
              <Pagination
                count={Math.ceil(count / 6)}
                color="primary"
                sx={{ display: "flex", justifyContent: "center" }}
                onChange={(event, value) => {
                  setItem(data.slice((value - 1) * 6, value * 6));
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
