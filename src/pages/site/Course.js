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
// import Data from "../../test";
const Course = () => {
  const [data, setData] = useState([]);
  const [params, setParams] = useSearchParams();
  const [notFound, setNotFound] = useState(false);
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState({});
  const [filtered, setFiltred] = useState(false);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(6);
  const [getNotifs, setGetNotifs] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("role"))
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo?.national_id === null) {
      toastify("warning", "لطفا اطلاعات خود را تکمیل کنید.");
      navigate("/panel/profile");
    } else {
      get_courses().then(() => {});
    }
  }, [userInfo || query || getNotifs]);
  const get_courses = async () => {
    let data = {
      table: "courses",
      method_type: "get_courses",
      data: {
        query: query,
        from: from,
        to: to,
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
      setData(response?.data?.response?.all_course);
      setCount(response?.data?.response?.len);
      setFrom(response?.data?.response?.from);
      setTo(response?.data?.response?.to);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };
  const handlePagination = (value) => {
    setFrom((value - 1) * 6);
    setTo(value * 6);
    setGetNotifs(!getNotifs);
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
              {data.map((course) => (
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
                onChange={(event, value) => handlePagination(value)}
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
