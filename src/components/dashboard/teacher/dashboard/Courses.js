import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import CircleIcon from "../../../../assets/img/circle-small.svg";
import toastify from "../../../../helper/toast";

const Courses = () => {
  const { auth, user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const get_course = async () => {
    setLoading(true);
    let config = {
      url: "select_request",
    };
    let data = {
      table: "courses",
      method_type: "get_teacher_course",
      data: {
        user_id: userInfo.user_id,
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

      baseURL: "http://127.0.0.1:5000/select_request/",
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
  }, [userInfo]);
  if (loading) return <Typography>درحال بارگزاری...</Typography>;

  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "25px",
        padding: 2,
      }}
    >
      <Typography variant="h6" color="mainText" fontWeight={500}>
        دوره‌های ارائه شده
      </Typography>
      <Grid container spacing={4}>
        {data.length > 0 ? (
          data.map((item) => (
            <Grid item xs={12} mt={3} md={6} key={item.id}>
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" spacing={1}>
                  <img src={CircleIcon} alt="circle" />
                  <Typography color="mainText" fontWeight={400}>
                    {item.name}
                  </Typography>
                </Stack>
                <Typography
                  fontFamily="iranyekanFn"
                  color={item.active ? "success.main" : "error"}
                >
                  {item.active ? "فعال" : "غیرفعال"}
                </Typography>
              </Stack>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h5" color="#888" textAlign="center">
              درحال حاضر دوره‌ای برای شما ثبت نشده
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to="/panel/my-coures">
            <Button>مشاهده همه دوره‌ها</Button>
          </Link>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Courses;
