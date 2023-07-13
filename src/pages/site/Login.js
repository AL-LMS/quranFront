import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Grid,
  Box,
  InputBase,
  Stack,
  Button,
} from "@mui/material";
import { Container } from "@mui/system";
import { Link } from "react-router-dom";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { setAuth, setUser, user } = useAuth();

  const [sendCode, setSendCode] = useState(false);
  const [time, setTime] = useState(0);
  const [login, setLogin] = useState({
    phone: "",
    code: "",
    request_id: "",
    type: "student",
  });

  const sendCodeHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `authen/sms/login/?receiver=${login.phone}`
      );
      setLogin({ ...login, request_id: response.data.request_id });
      setSendCode(true);
      setTime(60);
      toastify("success-login", `کد تایید برای شماره ${login.phone} ارسال شد`);
      console.log(response);
    } catch (err) {
      console.log(err);
      if (err.response.status === 404) {
        toastify("error-login", "شما هنوز ثبت نام نکرده اید");
      } else {
        toastify("error");
      }
    }
  };
  let timer;
  useEffect(() => {
    timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
      if (time === 1) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `authen/sms/login/?receiver=${login.phone}`,
        {
          request_id: login.request_id,
          type: login.type,
          receiver: login.phone,
          password: login.code,
        }
      );
      const userInfo = await axios.get("/authen/user", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${response.data.access}`,
        },
      });
      setAuth(response.data.access);
      setUser(userInfo.data);
      localStorage.setItem("token", JSON.stringify(response.data.access));
      localStorage.setItem("user", JSON.stringify(userInfo.data));
    } catch (err) {
      if (err.response.status === 401) {
        toastify("error-login", "کد تایید اشتباه است یا منقضی شده است");
      } else {
        toastify("error");
      }
      console.log(err);
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
            <form onSubmit={!sendCode ? sendCodeHandler : loginHandler}>
              {!sendCode ? (
                <Box
                  sx={{
                    backgroundColor: "#e8e8e8",
                    borderRadius: "10px",
                    padding: "4px 15px",
                    marginBottom: "2rem",
                  }}
                >
                  <InputBase
                    placeholder="شماره همراه:09121234567"
                    value={login.phone}
                    fullWidth
                    sx={{ fontFamily: "iranyekanFn" }}
                    onChange={(e) =>
                      setLogin({ ...login, phone: e.target.value })
                    }
                  />
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      backgroundColor: "#e8e8e8",
                      borderRadius: "10px",
                      padding: "4px 15px",
                      marginBottom: "2rem",
                    }}
                  >
                    <InputBase
                      placeholder="کد تایید "
                      value={login.code}
                      sx={{ fontFamily: "iranyekanFn" }}
                      fullWidth
                      onChange={(e) =>
                        setLogin({ ...login, code: e.target.value })
                      }
                    />
                  </Box>
                  <Button
                    sx={{ margin: "10px 0", fontFamily: "iranyekanFn" }}
                    fullWidth
                    onClick={sendCodeHandler}
                    disabled={time > 0 ? true : false}
                  >
                    {time > 0 && `${time}ثانیه تا`} ارسال مجدد
                  </Button>
                </>
              )}
              <Stack direction="column" spacing={2}>
                {!sendCode ? (
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    sx={{
                      borderRadius: "10px",
                      padding: "6px 30px",
                      boxShadow: "none",
                    }}
                  >
                    ارسال کد تایید
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    sx={{
                      borderRadius: "10px",
                      padding: "6px 30px",
                      boxShadow: "none",
                    }}
                  >
                    ورود
                  </Button>
                )}
                <Link to="/confirm-phone">
                  <Button fullWidth>ثبت نام</Button>
                </Link>
              </Stack>
            </form>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Login;
