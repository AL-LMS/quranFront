import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "@mui/system";
import { Grid, Pagination, Typography } from "@mui/material";
import Loader from "../../../../../../components/site/shared/Loader";
import { useParams } from "react-router-dom";
import toastify from "../../../../../../helper/toast";
import ResourcesLists from "../ObjectLists/ResourcesLists";
import CourseResourceForm from "../../../../../../components/dashboard/teacher/course/CourseResourceForm";
import { getUrl } from "../../../../../../helper/getUrl";
import NoDataImage from "../../../../../../assets/img/no-data.png";

const CourseResources = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const [count, setCount] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(5);
  const [getNotifs, setGetNotifs] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const get_resource = async () => {
    let data1 = {
      table: "courses",
      method_type: "get_resources",
      data: {
        course_id: id,
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
        ...data1,
      },

      baseURL: getUrl() + "back_request/select_request/",
    });
    if (response?.data?.tracking_code !== null) {
      if (data.length === 0) {
        setData(response?.data?.response?.all_course);
        setCount(response?.data?.response?.len);
        setFrom(response?.data?.response?.from);
        setTo(response?.data?.response?.to);
        window.location.reload();
      } else {
        setData(response?.data?.response?.all_course);
        setCount(response?.data?.response?.len);
        setFrom(response?.data?.response?.from);
        setTo(response?.data?.response?.to);
      }
    } else {
      toastify("error-login", response?.data?.error);
    }
  };

  const handlePagination = (value) => {
    setFrom((value - 1) * 5);
    setTo(value * 5);
    setGetNotifs(!getNotifs);
  };

  useEffect(() => {
    get_resource().then(() => {
      setLoading(false);
    });
  }, [userInfo || reload || getNotifs]);

  if (loading)
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
      <Grid container mt={3}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            component="h4"
            variant="h6"
            color="mainText"
            fontWeight={500}
          >
            منابع دوره
          </Typography>
          <CourseResourceForm type="create" setReload={setReload} />
        </Grid>
        {data?.length ? (
          <>
            <Grid item xs={12}>
              <ResourcesLists data={data} />
            </Grid>
            <Grid item xs={12} mt={6}>
              <Pagination
                count={Math.ceil(count / 5)}
                color="primary"
                sx={{ display: "flex", justifyContent: "center" }}
                onChange={(event, value) => handlePagination(value)}
              />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <img
              src={NoDataImage}
              alt="no-data"
              style={{
                width: "220px",
                height: "220px",
                display: "block",
                margin: "0 auto",
              }}
            />
            <Typography
              variant="h5"
              color="#ccc"
              fontWeight={500}
              textAlign="center"
              marginTop={1}
            >
              اطلاعات منابع یافت نشد
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default CourseResources;
