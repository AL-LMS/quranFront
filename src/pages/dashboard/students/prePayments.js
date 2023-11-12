import React, { useEffect, useState } from "react";
import { Container, Stack } from "@mui/system";
import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getUrl } from "../../../helper/getUrl";
import toastify from "../../../helper/toast";
import "./prepayment.css";
import useAuth from "../../../hooks/useAuth";
const PrePayments = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
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
      setData(response?.data?.response);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };
  useEffect(() => {
    get_course().then(() => {});
  }, [id]);
  const register_course = async () => {
    setLoading(true);
    let data = {
      table: "courses",
      method_type: "register_course",
      data: {
        course_id: data.course_id,
        student_id: user.user_id,
        student_name: user.first_name + " " + user.last_name,
        teacher_id: data.teacher_user_id,
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
  return (
    <Container
      sx={{
        width: "300px",
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
                  fontSize={30}
                  color={data["price"] ? "#888" : "error"}
                  sx={{
                    textDecoration: !data["price"] ? "line-through" : "initial",
                    color: data["price"] ? "#888" : "#666",
                    textAlign: "center",
                  }}
                >
                  {" " + data["price"]?.toLocaleString()} تومان
                </Typography>
              </Stack>
              <Typography color="mainText">
                نام دوره:
                <span style={{ color: "black" }}>{data["type"]}</span>
              </Typography>
              <Typography color="mainText">
                توضیح دوره:
                <span
                  style={{ color: "black", fontSize: 10, fontStyle: "bold" }}
                >
                  {data["explain"]}
                </span>
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Divider />
        <Button
          sx={{
            boxShadow: "none",
            borderRadius: "12px",
            padding: "10px 0",
            marginTop: "20px",
          }}
          variant="contained"
          fullWidth
          fontSize="17px"
          onClick={() => register_course()}
          disabled={data.enableforbuy}
        >
          پرداخت
        </Button>
      </Card>
    </Container>
  );
};

export default PrePayments;
