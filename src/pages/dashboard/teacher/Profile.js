import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Button, Grid } from "@mui/material";
import { Container } from "@mui/system";
import { toastify } from "../../../helper/toast";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { ToastContainer } from "react-toastify";
import { profileAuth } from "../../../auth/profile";
import { useContext } from "react";
import { DefiContext } from "../../../context/DefiContext";
import Documnets from "./Documnets";
import TeacherInfo from "../../../components/dashboard/students/profile/TeacherInfo";
import MultiDocumnets from "./MultiDocumnets";
import { setLocalStorageLogin } from "../../localStorage";

const Profile = () => {
  const { auth, user, role, setRole, setAuth, setUser } = useAuth();
  const { reaload, setReload } = useContext(DefiContext);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [form, setForm] = useState({
    first_name: user?.first_name,
    last_name: user?.last_name,
    national_id: role?.national_id,
    phone: user?.phone,
    picture: "",
    sex: role?.sex,
    ages: role?.ages,
    certificates: [],
    role: "teacher",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLastCertificate, setShowLastCertificate] = useState("");
  const [showCertificate, setShowCertificate] = useState([]);

  useEffect(() => {
    if (role?.confirm !== 1) {
      toastify("warning", "اکانت شما هنوز توسط ادمین فعال نشده است.");
    }
  }, [role]);
  useEffect(() => {
    setErrors(profileAuth(form));
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
    formData.append("role", "teacher");
    formData.append("first_name", form.first_name);
    formData.append("sex", form.sex);
    formData.append("ages", form.ages);
    formData.append("last_name", form.last_name);
    if (!Object.keys(errors).length) {
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

        baseURL: "http://127.0.0.1:5000/edit_user/",
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
        toastify("success", "اطلاعات شما با موفقیت تغییر کرد.");
        window.location.reload();
      } else {
        toastify("error-login", response?.data?.error);
      }
    } else {
      setLoading(false);
      toastify("warning", "لطفا فیلد هارا با دقت پر کنید");
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <TeacherInfo form={form} setForm={setForm} errors={errors} />
        </Grid>
        <Grid item xs={12}>
          <Documnets
            form={form}
            setForm={setForm}
            showLastCertificate={showLastCertificate}
            setShowLastCertificate={setShowLastCertificate}
            nameOfSection={"مدارک مربی"}
            nameOfButtonField={"آپلود تصویر آخرین مدرک تحصیلی"}
          />
        </Grid>
        <Grid item xs={12}>
          <MultiDocumnets
            form={form}
            setForm={setForm}
            showCertificate={showCertificate}
            setShowCertificate={setShowCertificate}
            nameOfSection={"گواهی مربی"}
            nameOfButtonField={"آپلود تصویر گواهی"}
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
      {/* <Backdrop open={loading} /> */}
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Profile;
