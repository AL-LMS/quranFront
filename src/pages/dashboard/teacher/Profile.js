import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Button, Divider, Grid, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { toastify } from "../../../helper/toast";
import { ToastContainer } from "react-toastify";
import Documnets from "./Documnets";
import TeacherInfo from "../../../components/dashboard/students/profile/TeacherInfo";
import MultiDocumnets from "./MultiDocumnets";
import { setLocalStorageLogin } from "../../localStorage";
import { useNavigate } from "react-router-dom";
import { getUrl } from "../../../helper/getUrl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { regex_national_id } from "../../../helper/regex";
import styled from "styled-components";
import Image from "../../../helper/base64Images";
const Profile = () => {
  const { user, role, setRole, setAuth, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [showLastCertificate, setShowLastCertificate] = useState("");
  const [showCertificate, setShowCertificate] = useState("");
  const [loading, setLoading] = useState(false);
  const initialValues = {
    first_name: user?.first_name,
    last_name: user?.last_name,
    national_id: role?.national_id,
    phone: user?.phone,
    picture: role?.picture,
    description: role?.description,
    sex: role?.sex ? role?.sex : null,
    birth_day: role?.birth_day ? role?.birth_day : null,
    degree: role?.degree ? role?.degree : null,
    certificates: [],
    role: "teacher",
  };
  const RegistrationSchema = Yup.object().shape({
    national_id: Yup.string()
      .required("کد ملی ضروری است.")
      .matches(regex_national_id, "کد ملی را به درستی وارد نمایید."),
    sex: Yup.string().required("انتخاب جنسیت ضروری است."),
    birth_day: Yup.string().required("انتخاب تاریخ تولد ضروری است."),
    degree: Yup.string().required("انتخاب تحصیلات ضروری است."),
    // description: Yup.string().required("توضیحات سوابق ضروری است."),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      edit_user().then(() => {});
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
  const edit_user = async () => {
    const formData = new FormData();
    formData.append("national_id", formik.values.national_id);
    formData.append("phone", userInfo?.phone);
    formData.append("role", userInfo?.role);
    formData.append("user_id", userInfo?.user_id);
    formData.append("sex", formik.values.sex);
    formData.append("birth_day", formik.values.birth_day);
    formData.append("degree", formik.values.degree);
    formData.append("picture", formik.values.picture);
    formData.append("description", formik.values.description);
    formData.append("certificates", JSON.stringify(formik.values.certificates));
    if (formik.values.picture instanceof File) {
      let response = await axios.post(
        getUrl() + "back_request/update_teacher_info/",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } else {
      let data = {
        table: "teachers",
        method_type: "edit_user",
        data: {
          user_id: userInfo?.user_id,
          phone: userInfo?.phone,
          national_id: formik.values.national_id,
          first_name: userInfo?.first_name,
          last_name: userInfo?.last_name,
          sex: formik.values.sex,
          birth_day: formik.values.birth_day,
          degree: formik.values.degree,
          role: userInfo?.role,
          picture: formik.values.picture,
          description: formik.values.description,
        },
      };
      let response = await axios({
        method: "POST",
        headers: {
          "content-type": "application/json",
          // "content-type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          ...data,
        },

        baseURL: getUrl() + "back_request/update_request/",
      });
    }
    if (response?.data?.tracking_code !== null) {
      localStorage.clear("role");
      localStorage.clear("user");
      localStorage.clear("token");
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
  };
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <form
          onSubmit={formik.handleSubmit}
          style={{ backgroundColor: "#fff", padding: 10 }}
        >
          <Grid item xs={12} style={{ marginBottom: "30px" }}>
            <TeacherInfo formik={formik} />
          </Grid>
          <DescriptionContainer>
            <Image formik={formik} />
            <TextField
              label="توضیحات سوابق"
              value={formik.values.description}
              fullWidth
              multiline
              rows={2}
              maxRows={4}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                formik.setFieldValue("description", e.target.value)
              }
            />
            {formik.touched.description && formik.errors.description ? (
              <div>
                <p style={{ fontSize: 10, color: "red" }}>
                  {formik.errors.description}
                </p>
              </div>
            ) : null}
          </DescriptionContainer>
          <DocumentsContainer>
            <Documnets
              formik={formik}
              showLastCertificate={showLastCertificate}
              setShowLastCertificate={setShowLastCertificate}
              nameOfSection={"آخرین مدرک مربی"}
              nameOfButtonField={"آپلود تصویر آخرین مدرک تحصیلی"}
            />
            <Divider />
            <MultiDocumnets
              formik={formik}
              showCertificate={showCertificate}
              setShowCertificate={setShowCertificate}
              nameOfSection={"گواهی‌های مربی"}
              nameOfButtonField={"آپلود تصاویر گواهی"}
            />
          </DocumentsContainer>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              sx={{ boxShadow: "none", padding: "12px 0" }}
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

export default Profile;

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
