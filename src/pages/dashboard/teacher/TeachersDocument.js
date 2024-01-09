import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Button, Divider, Grid } from "@mui/material";
import { Container } from "@mui/system";
import { toastify } from "../../../helper/toast";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getUrl } from "../../../helper/getUrl";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import TDocumnets from "./Document/TDocumnets";
import TMultiDocumnets from "./Document/TMultiDocumnets";
const TeachersDocument = () => {
  const { user, role } = useAuth();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [showLastCertificate, setShowLastCertificate] = useState("");
  const [showDocuments, setShowDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const certificateFormik = useFormik({
    initialValues: {
      phone: user?.phone,
      certificate: "",
      role: "teacher",
    },
    validationSchema: Yup.object().shape({}),
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      upload_certificate().then(() => {});
    },
  });
  const documentsFormik = useFormik({
    initialValues: {
      phone: user?.phone,
      documents: [],
      role: "teacher",
    },
    validationSchema: Yup.object().shape({}),
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      upload_certificate().then(() => {});
    },
  });

  useEffect(() => {
    if (role?.national_id === null) {
      toastify(
        "warning",
        "مربی گرامی، برای فعال سازی امکانات سامانه لطفا اطلاعات خود را در بخش پروفایل ثبت نمایید."
      );
    } else if (role?.confirm !== 1) {
      toastify(
        "warning",
        "برای افزودن دوره ابتدا بایستی اکانت شما توسط ادمین تایید شود."
      );
    }
  }, [role]);
  const upload_certificate = async () => {
    const formData = new FormData();
    formData.append("phone", userInfo?.phone);
    formData.append("role", userInfo?.role);
    formData.append("user_id", userInfo?.user_id);
    formData.append("certificate", certificateFormik.values.certificate);
    if (certificateFormik.values.certificate instanceof File) {
      let response = await axios.post(
        getUrl() + "back_request/update_teacher_certificate/",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response?.data?.tracking_code !== null) {
        if (role?.confirm !== 1) {
          toastify(
            "success",
            "مربی گرامی،اطلاعات شما در سامانه ثبت شد. پس از تائید مدیر سامانه امکانات سایت برای شما فعال خواهد شد."
          );
        } else {
          toastify("success", "اطلاعات شما با موفقیت ثبت شد");
        }
        navigate("/panel/dashboard");
      } else {
        setLoading(false);
        toastify("error-login", response?.data?.error);
      }
    } else {
      setLoading(false);
      toastify("error-login", "محتوای آپلود شده مناسب نیست.");
    }
  };
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <form
          onSubmit={certificateFormik.handleSubmit}
          style={{
            backgroundColor: "#fff",
            padding: 10,
            marginBottom: "50px",
            width: "100%",
            borderRadius: "8px",
          }}
        >
          <TDocumnets
            formik={certificateFormik}
            showLastCertificate={showLastCertificate}
            setShowLastCertificate={setShowLastCertificate}
            nameOfSection={"آخرین مدرک مربی"}
            nameOfButtonField={"آپلود تصویر آخرین مدرک تحصیلی"}
          />
          <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                boxShadow: "none",
                padding: "12px 0",
                marginTop: "20px",
                borderRadius: "8px",
              }}
            >
              بارگذاری مدرک مربی
            </Button>
          </Grid>
        </form>
        <form
          onSubmit={documentsFormik.handleSubmit}
          style={{
            backgroundColor: "#fff",
            padding: 10,
            marginBottom: "50px",
            width: "100%",
            borderRadius: "8px",
          }}
        >
          <TMultiDocumnets
            formik={documentsFormik}
            showDocuments={showDocuments}
            setShowDocuments={setShowDocuments}
            nameOfSection={"گواهی‌های مربی"}
            nameOfButtonField={"آپلود تصاویر گواهی"}
          />
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                boxShadow: "none",
                padding: "12px 0",
                marginTop: "20px",
                borderRadius: "8px",
              }}
            >
              ذخیره اطلاعات
            </Button>
          </Grid>
        </form>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default TeachersDocument;

export const DocumentsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
  }
  @media screen and (max-width: 480px) {
    flex-wrap: wrap;
    margin-top: 10px;
  }
`;
export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  @media screen and (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
  @media screen and (max-width: 480px) {
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 10px;
  }
`;
