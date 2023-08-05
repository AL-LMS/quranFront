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
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

const ConfirmPhone = () => {
  const { setAuth, setUser } = useAuth();
  const navigate = useNavigate();
  const [sendCode, setSendCode] = useState(false);
  const [time, setTime] = useState(0);
  const [kind, setKind] = useState("student");
  const [confirm, setConfirm] = useState({
    phone: "",
    first_name: "",
    last_name: "",
    password: "",
    repassword: "",
    type: "",
  });
  const handleChange = () => {
    if (kind === "student") {
      setKind("teacher");
    } else {
      setKind("student");
    }
  };
  // const sendCodeHandler = async () => {
  //   try {
  //     const response = await axios.get(
  //       `authen/sms/register?receiver=${confirm.phone}`
  //     );
  //     setConfirm({ ...confirm, request_id: response.data.request_id });
  //     setSendCode(true);
  //     setTime(60);
  //     toastify(
  //       "success-login",
  //       `کد تایید برای شماره ${confirm.phone} ارسال شد`
  //     );
  //     console.log(response);
  //   } catch (err) {
  //     console.log(err);
  //     toastify("error");
  //   }
  // };
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

  const signup = async () => {
    let config = {
      url: "signup",
    };
    let data = {
      table: "users",
      method_type: "",
      data: {
        first_name: confirm.first_name,
        last_name: confirm.last_name,
        phone: confirm.phone,
        role: confirm.type,
        password: confirm.password,
        re_password: confirm.repassword,
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

      baseURL: "http://127.0.0.1:5000/register/",
    });
    if (response?.data?.tracking_code !== null) {
      // setLocalStorageLogin("persist:root", data, () => {});
      toastify("success", "ثبت نام شما با موفقیت انجام شد");
      navigate("/signin");
    } else {
      toastify("error-login", response?.data?.error);
    }
  };

  const handleCheckboxChange = (event) => {
    setKind(event.target.name);
    setConfirm({ ...confirm, type: event.target.name });
  };
  return (
    <Container maxWidth="lg">
      <Grid container mt={8} sx={{ height: "100vh" }}>
        <Grid item xs={12} md={4} sx={{ margin: "0 auto" }}>
          <Card
            sx={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              borderRadius: "20px",
              padding: 2,
              marginBottom: "40px",
            }}
          >
            <Typography mb={3} color="mainText" textAlign="center">
              فرم اولیه ثبت‌نام
            </Typography>
            <Box
              sx={{
                backgroundColor: "#e8e8e8",
                borderRadius: "10px",
                padding: "4px 15px",
                marginBottom: "2rem",
              }}
            >
              <InputBase
                placeholder="نام"
                value={confirm.first_name}
                fullWidth
                onChange={(e) =>
                  setConfirm({ ...confirm, first_name: e.target.value })
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
                placeholder="نام خانوادگی"
                value={confirm.last_name}
                fullWidth
                onChange={(e) =>
                  setConfirm({ ...confirm, last_name: e.target.value })
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
                placeholder="شماره تلفن"
                value={confirm.phone}
                fullWidth
                onChange={(e) =>
                  setConfirm({ ...confirm, phone: e.target.value })
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
                value={confirm.password}
                fullWidth
                type="password"
                onChange={(e) =>
                  setConfirm({ ...confirm, password: e.target.value })
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
                placeholder="تکرار رمز عبور"
                value={confirm.repassword}
                fullWidth
                type="password"
                onChange={(e) =>
                  setConfirm({ ...confirm, repassword: e.target.value })
                }
              />
            </Box>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={kind == "student" ? true : false}
                    onChange={handleCheckboxChange}
                    name="student"
                    color="primary"
                  />
                }
                label="من قرآن آموز هستم"
              />
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={kind == "teacher" ? true : false}
                    onChange={handleCheckboxChange}
                    name="teacher"
                    color="primary"
                  />
                }
                label="من مربی هستم"
                sx={{
                  marginBottom: "2rem",
                }}
              />
            </FormGroup>
            <Button
              variant="contained"
              fullWidth
              onClick={() => signup().then(() => {})}
              sx={{
                borderRadius: "10px",
                padding: "6px 30px",
                boxShadow: "none",
                marginBottom: "20px",
              }}
            >
              ثبت نام
            </Button>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default ConfirmPhone;
