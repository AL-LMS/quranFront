import React from "react";
import { Typography, Grid, Box, Button, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { setLocalStorageLogin } from "../localStorage";
import { getUrl } from "../../helper/getUrl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { regex_phone } from "../../helper/regex";
const Login = () => {
  const { setAuth, setUser, setRole } = useAuth();
  const navigate = useNavigate();
  const signin = async () => {
    let data = {
      table: "users",
      method_type: "",
      data: {
        phone: formik.values.phone,
        password: formik.values.password,
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

      baseURL: getUrl() + "back_request/token/",
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
  const initialValues = {
    phone: null,
    password: "",
  };
  const RegistrationSchema = Yup.object().shape({
    phone: Yup.string()
      .required("لطفا شماره تلفن خود را وارد کنید")
      .matches(regex_phone, "شماره تلفن را به درستی وارد نمایید."),
    password: Yup.string().required("لطفا رمز عبور خود را وارد نمایید."),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      signin().then(() => {});
    },
  });

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
              ورود به حساب کاربری
            </Typography>
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
                lang="en"
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
            <Button
              type="submit"
              variant="contained"
              fullWidth
              // onClick={() => signin().then(() => {})}
              sx={{
                borderRadius: "5px",
                padding: "6px 30px",
                boxShadow: "none",
                marginBottom: "20px",
              }}
            >
              ورود
            </Button>
            <Link to="/signup">
              <Button
                fullWidth
                sx={{
                  marginBottom: "20px",
                }}
              >
                ثبت نام
              </Button>
            </Link>
          </form>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Login;
