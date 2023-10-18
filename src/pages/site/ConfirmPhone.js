import React, { useEffect, useState } from "react";
import { Card, Typography, Grid, Box, Button, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { getUrl } from "../../helper/getUrl";
import { registerAuth } from "../../auth/register";

const ConfirmPhone = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [time, setTime] = useState(0);
  const [kind, setKind] = useState("student");
  const [confirm, setConfirm] = useState({
    phone: "",
    first_name: "",
    last_name: "",
    password: "",
    repassword: "",
    type: "student",
  });
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
    if (!Object.keys(errors).length) {
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

        baseURL: getUrl() + "back_request/register/",
      });
      if (response?.data?.tracking_code !== null) {
        toastify(
          "success",
          "ثبت‌نام اولیه شما در سامانه انجام شد.برای تکمیل ثبت‌نام وارد سامانه شوید."
        );
        navigate("/signin");
      } else {
        toastify("error-login", response?.data?.error);
      }
    } else {
      toastify("warning", "لطفا فیلد هارا با دقت پر کنید");
    }
  };
  useEffect(() => {
    setErrors(registerAuth(confirm));
  }, [confirm]);

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
            <Box>
              <TextField
                label="نام"
                name="first_name"
                value={confirm.first_name}
                fullWidth
                onChange={(e) =>
                  setConfirm({ ...confirm, first_name: e.target.value })
                }
                size="small"
                helperText={errors.first_name && errors.first_name}
              />
            </Box>
            <Box>
              <TextField
                label="نام خانوادگی"
                name="last_name"
                value={confirm.last_name}
                fullWidth
                onChange={(e) =>
                  setConfirm({ ...confirm, last_name: e.target.value })
                }
                size="small"
                helperText={errors.last_name && errors.last_name}
              />
            </Box>
            <Box>
              <TextField
                label="شماره تلفن"
                name="phone"
                value={confirm.phone}
                fullWidth
                onChange={(e) =>
                  setConfirm({ ...confirm, phone: e.target.value })
                }
                size="small"
                helperText={errors.phone && errors.phone}
              />
            </Box>
            <Box>
              <TextField
                label="رمز عبور"
                name="password"
                value={confirm.password}
                fullWidth
                type="password"
                onChange={(e) =>
                  setConfirm({ ...confirm, password: e.target.value })
                }
                size="small"
                helperText={errors.password && errors.password}
              />
            </Box>
            <Box>
              <TextField
                label="تکرار رمز عبور"
                name="repassword"
                value={confirm.repassword}
                fullWidth
                type="password"
                onChange={(e) =>
                  setConfirm({ ...confirm, repassword: e.target.value })
                }
                size="small"
                helperText={errors.repassword && errors.repassword}
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
