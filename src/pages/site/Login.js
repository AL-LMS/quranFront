import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Grid,
  Box,
  InputBase,
  Stack,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { Container } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { setLocalStorageLogin } from "../localStorage";

const Login = () => {
  const { setAuth, setUser, user, setRole } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [login, setLogin] = useState({
    phone: "",
    password: "",
  });
  const signin = async () => {
    let config = {
      url: "login",
    };
    let data = {
      table: "users",
      method_type: "",
      data: {
        phone: login.phone,
        password: login.password,
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

      baseURL: "http://daarolquran.com/back_request/token/",
    });
    if (response?.data?.tracking_code !== null) {
      toastify("success", "ورود شما با موفقیت انجام شد");
      setLocalStorageLogin("token", response?.data?.response?.token, () => {});
      setLocalStorageLogin("user", response?.data?.response, () => {});
      setLocalStorageLogin(
        "role",
        response?.data?.response?.role_data,
        () => {}
      );
      setAuth(response?.data?.response?.token);
      setUser(response?.data?.response);
      setRole(response?.data?.response?.role_data);
      navigate("/panel/dashboard");
    } else {
      toastify("error-login", response?.data?.error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              borderRadius: "20px",
              padding: 2,
            }}
          >
            <Typography mb={3} color="mainText" textAlign="center">
              ورود به حساب کاربری
            </Typography>
            <form onSubmit={signin}>
              <Box
                sx={{
                  backgroundColor: "#e8e8e8",
                  borderRadius: "10px",
                  padding: "4px 15px",
                  marginBottom: "2rem",
                }}
              >
                <InputBase
                  placeholder="شماره همراه"
                  value={login.phone}
                  fullWidth
                  onChange={(e) =>
                    setLogin({ ...login, phone: e.target.value })
                  }
                />
              </Box>
              <Box
                sx={{
                  backgroundColor: "#e8e8e8",
                  borderRadius: "10px",
                  padding: "4px 15px",
                  marginBottom: "2rem",
                }}
              >
                <InputBase
                  placeholder="رمز عبور"
                  value={login.password}
                  fullWidth
                  type="password"
                  onChange={(e) =>
                    setLogin({ ...login, password: e.target.value })
                  }
                />
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={() => signin().then(() => {})}
                sx={{
                  borderRadius: "10px",
                  padding: "6px 30px",
                  boxShadow: "none",
                  marginBottom: "20px",
                }}
              >
                ورود
              </Button>
            </form>
            <Link to="/confirm-phone">
              <Button
                fullWidth
                sx={{
                  marginBottom: "20px",
                }}
              >
                ثبت نام
              </Button>
            </Link>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Login;
