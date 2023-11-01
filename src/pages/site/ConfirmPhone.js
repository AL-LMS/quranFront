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
import { useFormik } from "formik";
import * as Yup from "yup";
import { regex_phone } from "../../helper/regex";
const ConfirmPhone = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [kind, setKind] = useState("student");
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
        first_name: formik.values.first_name,
        last_name: formik.values.last_name,
        phone: formik.values.phone,
        role: formik.values.type,
        password: formik.values.password,
        re_password: formik.values.repassword,
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
  };

  const initialValues = {
    phone: null,
    first_name: "",
    last_name: "",
    password: "",
    repassword: "",
    type: "student",
  };
  const RegistrationSchema = Yup.object().shape({
    first_name: Yup.string().required("لطفا نام خود را وارد نمایید."),
    last_name: Yup.string().required("لطفا نام‌خانوادگی خود را وارد نمایید."),
    phone: Yup.string()
      .required("لطفا شماره تلفن خود را وارد کنید")
      .matches(regex_phone, "شماره تلفن را به درستی وارد نمایید."),
    password: Yup.string().required("لطفا رمز عبور خود را وارد نمایید."),
    repassword: Yup.string()
      .required("لطفا رمز عبور خود را وارد نمایید")
      .oneOf(
        [Yup.ref("password"), null],
        "رمزعبور و تکرار رمز  با هم مطابقت ندارند"
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      signup().then(() => {});
    },
  });

  const handleCheckboxChange = (event) => {
    setKind(event.target.name);
    formik.setFieldValue("type", event.target.name);
  };
  return (
    <Container maxWidth="lg" sx={{ height: "100vh" }}>
      <Grid container mt={8} sx={{ height: "100vh" }}>
        <Grid item xs={12} md={4} sx={{ margin: "0 auto" }}>
          <form
            onSubmit={formik.handleSubmit}
            style={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "40px",
            }}
          >
            <Typography mb={3} color="mainText" textAlign="center">
              فرم اولیه ثبت‌نام
            </Typography>
            <Box
              sx={{
                marginBottom: "2rem",
              }}
            >
              <TextField
                label="نام"
                name="first_name"
                value={formik.values.first_name}
                fullWidth
                onChange={(e) =>
                  formik.setFieldValue("first_name", e.target.value)
                }
                size="small"
              />
              {formik.touched.first_name && formik.errors.first_name ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.first_name}
                  </p>
                </div>
              ) : null}
            </Box>
            <Box
              sx={{
                marginBottom: "2rem",
              }}
            >
              <TextField
                label="نام خانوادگی"
                name="last_name"
                value={formik.values.last_name}
                fullWidth
                onChange={(e) =>
                  formik.setFieldValue("last_name", e.target.value)
                }
                size="small"
              />
              {formik.touched.last_name && formik.errors.last_name ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.last_name}
                  </p>
                </div>
              ) : null}
            </Box>
            <Box
              sx={{
                marginBottom: "2rem",
              }}
            >
              <TextField
                label="شماره تلفن"
                name="phone"
                value={formik.values.phone}
                fullWidth
                onChange={(e) => formik.setFieldValue("phone", e.target.value)}
                size="small"
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.phone}
                  </p>
                </div>
              ) : null}
            </Box>
            <Box
              sx={{
                marginBottom: "2rem",
              }}
            >
              <TextField
                label="رمز عبور"
                name="password"
                value={formik.values.password}
                fullWidth
                type="password"
                onChange={(e) =>
                  formik.setFieldValue("password", e.target.value)
                }
                size="small"
              />
              {formik.touched.password && formik.errors.password ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.password}
                  </p>
                </div>
              ) : null}
            </Box>
            <Box
              sx={{
                marginBottom: "2rem",
              }}
            >
              <TextField
                label="تکرار رمز عبور"
                name="repassword"
                value={formik.values.repassword}
                fullWidth
                type="password"
                onChange={(e) =>
                  formik.setFieldValue("repassword", e.target.value)
                }
                size="small"
              />
              {formik.touched.repassword && formik.errors.repassword ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.repassword}
                  </p>
                </div>
              ) : null}
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
              type="submit0"
              variant="contained"
              fullWidth
              // onClick={() => submit_api().then(() => {})}
              sx={{
                borderRadius: "10px",
                padding: "6px 30px",
                boxShadow: "none",
                marginBottom: "20px",
              }}
            >
              ثبت نام
            </Button>
          </form>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default ConfirmPhone;
