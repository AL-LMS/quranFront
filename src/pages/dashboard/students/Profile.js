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
import { profileAuthStudent } from "../../../auth/profile";
import { useContext } from "react";
import { DefiContext } from "../../../context/DefiContext";
import { setLocalStorageLogin } from "../../localStorage";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, role, setAuth, setUser, setRole } = useAuth();
  const { reaload, setReload } = useContext(DefiContext);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [form, setForm] = useState({
    first_name: user?.first_name,
    last_name: user?.last_name,
    national_id: role?.national_id,
    phone: user?.phone,
    sex: role?.sex,
    ages: role?.ages,
    degree: role?.degree,
    picture: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showBirthCertificate, setShowBirthCertificate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setErrors(profileAuthStudent(form));
  }, [form]);

  useEffect(() => {
    const fetchStudentData = async () => {};
    fetchStudentData();
  }, [reaload]);
  const submitData = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("phone", form.phone);
    formData.append("national_id", form.national_id);
    formData.append("role", "student");
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("type", "student");
    formData.append("sex", form.sex);
    formData.append("ages", form.ages);
    formData.append("degree", form.degree);
    if (!Object.keys(errors).length) {
      if (
        String(form?.national_id) &&
        String(form?.sex) &&
        String(form?.ages) &&
        String(form?.degree)
      ) {
        let config = {
          url: "update_request",
        };
        let data = {
          table: "teachers",
          method_type: "edit_user",
          data: {
            user_id: userInfo?.user_id,
            phone: form.phone,
            national_id: form.national_id,
            first_name: form.first_name,
            last_name: form.last_name,
            sex: form.sex,
            ages: form.ages,
            degree: form.degree,
            role: form.role,
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

          baseURL: "http://127.0.0.1:5000/update_request/",
        });
        if (response?.data?.tracking_code !== null) {
          localStorage.clear("role");
          localStorage.clear("user");
          localStorage.clear("token");
          setLocalStorageLogin(
            "token",
            response?.data?.response?.token,
            () => {}
          );
          setLocalStorageLogin("user", response?.data?.response, () => {});
          setLocalStorageLogin(
            "role",
            response?.data?.response?.role_data,
            () => {}
          );
          setAuth(response?.data?.response?.token);
          setUser(response?.data?.response);
          setRole(response?.data?.response?.role_data);
          toastify("success", "ثبت‌نام شما در سامانه با موفقیت انجام شد.");
          setLoading(false);
          navigate("/panel/dashboard");
        } else {
          toastify("error-login", response?.data?.error);
        }
      } else {
        setLoading(false);
        toastify("warning", "لطفا تمامی فیلدها را با دقت پر کنید");
      }
    } else {
      setLoading(false);
      toastify("warning", "لطفا فیلدها را با دقت پر کنید");
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <StudentInfo form={form} setForm={setForm} errors={errors} />
        </Grid>
        <Grid item xs={12}>
          <Documnets
            form={form}
            setForm={setForm}
            showBirthCertificate={showBirthCertificate}
            setShowBirthCertificate={setShowBirthCertificate}
          />
        </Grid>
        <Button
          variant="contained"
          endIcon={<SaveOutlinedIcon />}
          onClick={submitData}
          sx={{
            boxShadow: "none",
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            width: "120px",
          }}
        >
          ذخیره
        </Button>
      </Grid>
      <Backdrop open={loading} />
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Profile;
