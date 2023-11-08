import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Backdrop, Button, Grid } from "@mui/material";
import { Container } from "@mui/system";
import { toastify } from "../../../helper/toast";
import StudentInfo from "../../../components/dashboard/students/profile/StudentInfo";
import Documnets from "../../../components/dashboard/students/profile/Documnets";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { ToastContainer } from "react-toastify";
import { setLocalStorageLogin } from "../../localStorage";
import { useNavigate } from "react-router-dom";
import { getUrl } from "../../../helper/getUrl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { regex_national_id } from "../../../helper/regex";
const Profile = () => {
  const { user, role, setAuth, setUser, setRole } = useAuth();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

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
    role: "student",
  };
  const RegistrationSchema = Yup.object().shape({
    national_id: Yup.string()
      .required("کد ملی ضروری است.")
      .matches(regex_national_id, "کد ملی را به درستی وارد نمایید."),
    sex: Yup.string().required("انتخاب جنسیت ضروری است."),
    birth_day: Yup.string().required("انتخاب تاریخ تولد ضروری است."),
    degree: Yup.string().required("انتخاب تحصیلات ضروری است."),
    // picture: Yup.string().required("افزودن مدرک الزامیست"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      edit_user().then(() => {});
    },
  });
  const [loading, setLoading] = useState(false);
  const [showBirthCertificate, setShowBirthCertificate] = useState("");
  const navigate = useNavigate();

  const edit_user = async () => {
    let config = {
      url: "update_request",
    };
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
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <form
          onSubmit={formik.handleSubmit}
          style={{ backgroundColor: "#fff", padding: 10 }}
        >
          <Grid item xs={12}>
            <StudentInfo formik={formik} />
          </Grid>
          <Grid item xs={12}>
            <Documnets
              formik={formik}
              showBirthCertificate={showBirthCertificate}
              setShowBirthCertificate={setShowBirthCertificate}
            />
          </Grid>
          <Grid item xs={12}>
            {/* <Button
              type="submit"
              variant="contained"
              endIcon={<SaveOutlinedIcon />}
              sx={{
                boxShadow: "none",
                position: "fixed",
                bottom: "1rem",
                right: "1rem",
                width: "120px",
              }}
            >
              ذخیره
            </Button> */}
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
      <Backdrop open={loading} />
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Profile;
