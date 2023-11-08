import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Button, Divider, Grid } from "@mui/material";
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
const Profile = () => {
  const { user, role, setRole, setAuth, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [showLastCertificate, setShowLastCertificate] = useState("");
  const [showCertificate, setShowCertificate] = useState("");

  const initialValues = {
    first_name: user?.first_name,
    last_name: user?.last_name,
    national_id: role?.national_id,
    phone: user?.phone,
    picture: null,
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
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      edit_user().then(() => {});
    },
  });

  useEffect(() => {
    if (role?.confirm !== 1) {
      toastify(
        "warning",
        "مربی گرامی، برای فعال سازی امکانات سامانه لطفا اطلاعات خود را در بخش پروفایل ثبت نمایید."
      );
    }
  }, [role]);
  const edit_user = async () => {
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

      baseURL: getUrl() + "back_request/update_request/",
    });
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
      toastify(
        "success",
        "مربی گرامی،اطلاعات شما در سامانه ثبت شد. پس از تائید مدیر سامانه امکانات سایت برای شما فعال خواهد شد."
      );
      navigate("/panel/dashboard");
    } else {
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
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
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
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
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
