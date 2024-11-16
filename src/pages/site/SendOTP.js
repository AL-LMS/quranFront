import React from "react";
import { Typography, Grid, Box, Button, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { getUrl } from "../../helper/getUrl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setLocalStorageLogin } from "../localStorage";
import { regex_phone } from "../../helper/regex";
const SendOTP = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const send_otp = async () => {
    let data = {
      table: "users",
      method_type: "send_otp",
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

      baseURL: getUrl() + "back_request/insert_request/",
    });
    if (response?.data?.tracking_code !== null) {
      toastify("success", response?.data?.response?.message);
      setLocalStorageLogin("phone", response?.data?.response?.phone, () => {});
      navigate("/check-otp");
    } else {
      setLoading(false);
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
      setLoading(true);
      send_otp().then(() => {});
    },
  });

  return (
    <Container maxWidth="lg" sx={{ height: "100vh", marginTop: "100px" }}>
      <Grid container mt={8} sx={{ height: "100vh" }}>
        <Grid item xs={12} md={4} sx={{ margin: "0 auto" }}>
          <form
            onSubmit={formik.handleSubmit}
            style={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              borderRadius: "5px",
              padding: "20px",
              marginBottom: "40px",
            }}
          >
            <Typography mb={3} color="mainText" textAlign="center">
              ورود با پیامک
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
                onChange={(event) => {
                  const englishDigits = event.target.value.replace(
                    /[۰-۹]/g,
                    (char) =>
                      String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0030)
                  );
                  formik.setFieldValue(
                    "phone",
                    englishDigits.replace(/[^0-9]/g, "")
                  );
                }}
                // onChange={(e) => formik.setFieldValue("phone", e.target.value)}
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
            <Link to="/login">
              <Button
                fullWidth
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginBottom: "20px",
                }}
              >
                ورود با رمزعبور
              </Button>
            </Link>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{
                borderRadius: "5px",
                padding: "6px 30px",
                boxShadow: "none",
                marginBottom: "20px",
              }}
            >
              ارسال کد
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

export default SendOTP;
