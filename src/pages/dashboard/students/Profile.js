import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Backdrop, Button, Grid } from "@mui/material";
import { Container } from "@mui/system";
import { toastify } from "../../../helper/toast";
import StudentInfo from "../../../components/dashboard/students/profile/StudentInfo";
import ParentsInfo from "../../../components/dashboard/students/profile/ParentsInfo";
import Documnets from "../../../components/dashboard/students/profile/Documnets";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { ToastContainer } from "react-toastify";
import { profileAuth } from "../../../auth/profile";
import { useContext } from "react";
import { DefiContext } from "../../../context/DefiContext";

const Profile = () => {
  const { auth, user } = useAuth();
  const { reaload, setReload } = useContext(DefiContext);
  const [form, setForm] = useState({
    birth: "",
    department: "",
    disipcline: "",
    first_name: "",
    gpaverage: "",
    grade: "",
    last_name: "",
    national_code: "",
    parentName: "",
    parentNationalCode: "",
    pbirthday: "",
    peducation: "",
    phone: "",
    picture: "",
    pjob: "",
    role: "Student",
    school: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showBirthCertificate, setShowBirthCertificate] = useState("");

  useEffect(() => {
    setErrors(profileAuth(form));
  }, [form]);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `authen/users/?type=student&id=${user.pk}`,
          {
            headers: { Authorization: `Bearer ${auth}` },
          }
        );
        const data = await response.data;
        setLoading(false);
        setForm(data[0]);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [reaload]);

  const submitData = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("phone", form.phone);
    formData.append("grade", form.grade);
    formData.append("department", form.department);
    form.birth && formData.append("birth", form.birth);
    formData.append("national_code", form.national_code);
    formData.append("role", "student");
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("pk", user.pk);
    form.gpaverage && formData.append("gpaverage", form.gpaverage);
    form.disipcline && formData.append("disipcline", form.disipcline);
    form.school && formData.append("school", form.school);
    form.parentName && formData.append("parentName", form.parentName);
    form.parentNationalCode &&
      formData.append("parentNationalCode", form.parentNationalCode);
    form.pbirthday && formData.append("pbirthday", form.pbirthday);
    form.peducation && formData.append("peducation", form.peducation);
    form.pjob && formData.append("pjob", form.pjob);
    form.address && formData.append("address", form.address);
    showBirthCertificate && formData.append("picture", form.picture);
    formData.append("type", "student");
    if (!Object.keys(errors).length) {
      try {
        const response = await axios.put("authen/update_profile/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth}`,
          },
        });
        toastify("success", "اطلاعات با موفقیت ثبت شد");
        setLoading(false);
        setReload((prevState) => !prevState);
      } catch (err) {
        setLoading(false);
        if (err.response.status === 400) {
          toastify("error-login", "اطلاعات ناقص است");
        } else {
          toastify("error", "خطا در برقراری ارتباط با سرور");
        }
        console.log(err);
      }
    } else {
      setLoading(false);
      toastify("warning", "لطفا فیلد هارا با دقت پر کنید");
      console.log(form);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <StudentInfo form={form} setForm={setForm} errors={errors} />
        </Grid>
        <Grid item xs={12}>
          <ParentsInfo form={form} setForm={setForm} />
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
