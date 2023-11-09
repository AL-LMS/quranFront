import React from "react";
import { Typography, Grid, Box, Button, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { getUrl } from "../../helper/getUrl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setLocalStorageLogin } from "../localStorage";
import { regex_phone } from "../../helper/regex";
const SendOTP = () => {
  const navigate = useNavigate();
  const send_otp = async () => {
    let data = {
      table: "users",
      method_type: "",
      data: {
        phone: formik.values.phone,
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

      baseURL: getUrl() + "back_request/send_otp/",
    });
    if (response?.data?.tracking_code !== null) {
      setLocalStorageLogin("phone", response?.data?.response?.phone, () => {});
      navigate("/check-otp");
    } else {
      toastify("error-login", response?.data?.error);
    }
  };

  const initialValues = {
    phone: "",
  };
  const RegistrationSchema = Yup.object().shape({
    phone: Yup.string()
      .required("لطفا شماره تلفن خود را وارد کنید")
      .matches(regex_phone, "شماره تلفن را به درستی وارد نمایید."),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      send_otp().then(() => {});
    },
  });

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
              ارسال کد فراموشی
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
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.phone}
                  </p>
                </div>
              ) : null}
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "10px",
                padding: "6px 30px",
                boxShadow: "none",
                marginBottom: "20px",
              }}
            >
              ارسال کد
            </Button>
          </form>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default SendOTP;
