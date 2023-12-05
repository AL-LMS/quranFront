import React, { useEffect, useState } from "react";
import { Container, Stack } from "@mui/system";
import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getUrl } from "../../../helper/getUrl";
import toastify from "../../../helper/toast";
import "./prepayment.css";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/site/shared/Loader";
const PrePayments = () => {
  const { id } = useParams();
  const [dataCourse, setDataCourse] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
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
      setDataCourse(response?.data?.response);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };
  useEffect(() => {
    setLoading(true);
    get_course().then(() => {
      setLoading(false);
    });
  }, [id]);
  const register_course = async () => {
    setLoading(true);
    let data = {
      table: "courses",
      method_type: "register_course",
      data: {
        course_id: id,
        user_id: user.user_id,
        user_name: user.first_name + " " + user.last_name,
        user_type: user.role,
        teacher_id: dataCourse.teacher_user_id,
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

      baseURL: getUrl() + "back_request/insert_request/",
    });
    if (response?.data?.tracking_code !== null) {
      toastify("success", response?.data?.response);
      navigate("/panel/dashboard");
    } else {
      toastify("error-login", response?.data?.error);
    }
  };
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
    <Container
      sx={{
        width: "auto",
        marginTop: "15px",
      }}
    >
      <Card
        sx={{
          boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
          borderRadius: "5px",
          padding: 2,
        }}
      >
        <Grid item xs={12}>
          <Stack
            sx={{
              flexDirection: { xs: "column", md: "row" },
              justifyContent: { md: "space-between" },
            }}
          >
            <Stack spacing={2} direction="column">
              <Stack direction="row" spacing={5}>
                <Typography
                  fontWeight={400}
                  color={"#000"}
                  fontFamily="iranyekanFn"
                  sx={{
                    textAlign: "center",
                    color: "#000",
                  }}
                >
                  {dataCourse["price"] === 0
                    ? " رایگان"
                    : " " + dataCourse["price"]?.toLocaleString() + "تومان"}
                </Typography>
              </Stack>
              <Typography color="mainText">
                نام دوره:
                <span style={{ color: "black" }}>{dataCourse["type"]}</span>
              </Typography>
              <Typography color="mainText">
                توضیح دوره:
                <span
                  style={{ color: "black", fontSize: 10, fontStyle: "bold" }}
                >
                  {dataCourse["explain"]}
                </span>
              </Typography>
              <Typography color="mainText">
                نام مربی:
                <span
                  style={{ color: "black", fontSize: 10, fontStyle: "bold" }}
                >
                  {dataCourse["teacher_name"]}
                </span>
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Divider />
        <Button
          sx={{
            boxShadow: "none",
            borderRadius: "5px",
            padding: "10px 0",
            marginTop: "20px",
          }}
          variant="contained"
          fullWidth
          fontSize="17px"
          onClick={() => register_course()}
          disabled={loading}
        >
          پرداخت
        </Button>
      </Card>
    </Container>
  );
};

export default PrePayments;
