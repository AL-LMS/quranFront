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
import { Link, useNavigate } from "react-router-dom";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const ConfirmPhone = () => {
  const { setAuth, setUser } = useAuth();
  const navigate = useNavigate();
  const [sendCode, setSendCode] = useState(false);
  const [time, setTime] = useState(0);
  const [confirm, setConfirm] = useState({
    phone: "",
    code: "",
    request_id: "",
    type: "student",
  });

  const sendCodeHandler = async () => {
    try {
      const response = await axios.get(
        `authen/sms/register?receiver=${confirm.phone}`
      );
      setConfirm({ ...confirm, request_id: response.data.request_id });
      setSendCode(true);
      setTime(60);
      toastify(
        "success-login",
        `کد تایید برای شماره ${confirm.phone} ارسال شد`
      );
      console.log(response);
    } catch (err) {
      console.log(err);
      toastify("error");
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

  const confirmPhoneHandler = async () => {
    try {
      const response = await axios.post(
        `authen/sms/register?receiver=${confirm.phone}`,
        {
          request_id: confirm.request_id,
          type: confirm.type,
          receiver: confirm.phone,
          password: confirm.code,
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
      navigate("/register");
    } catch (err) {
      if (err.response.status === 401) {
        toastify("error-login", "کد تایید اشتباه است یا منقضی شده است");
      } else {
        toastify("error-login", "شما قبلا ثبت نام کرده اید");
      }
      console.log(err);
    }
  };
  return (
    <Container maxWidth="lg">
      <Grid container mt={8} sx={{ height: "70vh" }}>
        <Grid item xs={12} md={4} sx={{ margin: "0 auto" }}>
          <Card
            sx={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              borderRadius: "20px",
              padding: 2,
            }}
          >
            <Typography mb={3} color="mainText" textAlign="center">
              تایید شماره همراه
            </Typography>

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
                  value={confirm.phone}
                  fullWidth
                  onChange={(e) =>
                    setConfirm({ ...confirm, phone: e.target.value })
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
                    value={confirm.code}
                    fullWidth
                    onChange={(e) =>
                      setConfirm({ ...confirm, code: e.target.value })
                    }
                  />
                </Box>
                <Button
                  sx={{ margin: "10px 0" }}
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
                  onClick={sendCodeHandler}
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
                  onClick={confirmPhoneHandler}
                  sx={{
                    borderRadius: "10px",
                    padding: "6px 30px",
                    boxShadow: "none",
                  }}
                >
                  تایید کد
                </Button>
              )}
              {!sendCode && (
                <Link to="/panel/dashboard">
                  <Button fullWidth>ورود</Button>
                </Link>
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default ConfirmPhone;
