import React, { useState } from "react";
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
import useAuth from "../../hooks/useAuth";
import { useV2Preview } from "../../features/authV2/V2PreviewContext";
import { v2AuthApi, v2AuthErrorMessage } from "../../features/authV2/v2AuthApi";
import { toAsciiDigits } from "../../features/authV2/phoneEntry";
const ConfirmPhone = ({ v2Preview = false }) => {
  const v2 = useV2Preview();
  const navigate = useNavigate();
  const { setAuth, setUser, setRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const confirm_phone = async () => {
    if (v2Preview) {
      try {
        if (v2?.challenge?.purpose !== "verify_phone") throw new Error("missing challenge");
        await v2AuthApi.verifyPhone(v2.challenge.challengeId, formik.values.code);
        v2.setChallenge(null);
        toastify("success", "شمارهٔ آزمایشی تأیید شد. اکنون وارد شوید.");
        navigate("/__preview/m3-auth/login"); // Verification never auto-logs in.
      } catch (error) {
        toastify("error-login", v2AuthErrorMessage(error));
      } finally {
        setLoading(false);
      }
      return;
    }
    let data = {
      table: "users",
      method_type: "confirm_phone",
      data: {
        phone: JSON.parse(localStorage.getItem("phone")),
        code: formik.values.code,
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
      toastify(
        "success",
        "ثبت‌نام اولیه شما در سامانه انجام شد.برای تکمیل ثبت‌نام وارد سامانه شوید."
      );
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
      setLoading(false);
      toastify("error-login", response?.data?.error);
    }
  };

  const initialValues = {
    code: "",
  };
  const RegistrationSchema = Yup.object().shape({
    code: Yup.string()
      .required()
      .matches(/^[0-9]+$/, "کد وارد شده بایستی عدد باشد.")
      .min(6, "کد بایستی 6 رقمی باشد.")
      .max(6, "کد بایستی 6 رقمی باشد."),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      confirm_phone().then(() => {});
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
              borderRadius: "5px",
              padding: "20px",
              marginBottom: "40px",
            }}
          >
            <Typography mb={3} color="mainText" textAlign="center">
              تایید شماره تلفن
            </Typography>
            <Box
              sx={{
                marginBottom: "2rem",
              }}
            >
              <TextField
                label="کد تایید"
                name="code"
                value={formik.values.code}
                fullWidth
                onChange={(e) => formik.setFieldValue("code", v2Preview ? toAsciiDigits(e.target.value) : e.target.value)}
                size="small"
              />
              {formik.touched.code && formik.errors.code ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.code}
                  </p>
                </div>
              ) : null}
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                borderRadius: "5px",
                padding: "6px 30px",
                boxShadow: "none",
                marginBottom: "20px",
              }}
            >
              احراز هویت
            </Button>
          </form>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default ConfirmPhone;
