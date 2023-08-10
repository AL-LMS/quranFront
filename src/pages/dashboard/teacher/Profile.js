import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Backdrop, Button, Grid } from "@mui/material";
import { Container } from "@mui/system";
import { toastify } from "../../../helper/toast";
import StudentInfo from "../../../components/dashboard/students/profile/StudentInfo";
import ParentsInfo from "../../../components/dashboard/students/profile/ParentsInfo";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { ToastContainer } from "react-toastify";
import { profileAuth } from "../../../auth/profile";
import { useContext } from "react";
import { DefiContext } from "../../../context/DefiContext";
import Documnets from "./Documnets";
import TeacherInfo from "../../../components/dashboard/students/profile/TeacherInfo";
import MultiDocumnets from "./MultiDocumnets";

const Profile = () => {
  const { auth, user, role } = useAuth();
  const { reaload, setReload } = useContext(DefiContext);
  const [form, setForm] = useState({
    first_name: user?.first_name,
    last_name: user?.last_name,
    national_code: role?.national_id,
    phone: user?.phone,
    picture: "",
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
  console.log("form", form);
  useEffect(() => {
    const fetchStudentData = async () => {
      // setLoading(true);
      // try {
      //   const response = await axios.get(
      //     `authen/users/?type=student&id=${user.pk}`,
      //     {
      //       headers: { Authorization: `Bearer ${auth}` },
      //     }
      //   );
      //   const data = await response.data;
      //   setLoading(false);
      //   setForm(data[0]);
      // } catch (err) {
      //   console.log(err);
      //   setLoading(false);
      // }
    };
    fetchStudentData();
  }, [reaload]);

  // const submitData = async () => {
  //   // setLoading(true);
  //   const formData = new FormData();
  //   formData.append("phone", form.phone);
  //   formData.append("grade", form.grade);
  //   formData.append("department", form.department);
  //   form.birth && formData.append("birth", form.birth);
  //   formData.append("national_code", form.national_code);
  //   formData.append("role", "student");
  //   formData.append("first_name", form.first_name);
  //   formData.append("last_name", form.last_name);
  //   formData.append("pk", user.pk);
  //   form.gpaverage && formData.append("gpaverage", form.gpaverage);
  //   form.disipcline && formData.append("disipcline", form.disipcline);
  //   form.school && formData.append("school", form.school);
  //   form.parentName && formData.append("parentName", form.parentName);
  //   form.parentNationalCode &&
  //     formData.append("parentNationalCode", form.parentNationalCode);
  //   form.pbirthday && formData.append("pbirthday", form.pbirthday);
  //   form.peducation && formData.append("peducation", form.peducation);
  //   form.pjob && formData.append("pjob", form.pjob);
  //   form.address && formData.append("address", form.address);
  //   showBirthCertificate && formData.append("picture", form.picture);
  //   formData.append("type", "student");
  //   // if (!Object.keys(errors).length) {
  //   //   try {
  //   //     const response = await axios.put("authen/update_profile/", formData, {
  //   //       headers: {
  //   //         "Content-Type": "multipart/form-data",
  //   //         Authorization: `Bearer ${auth}`,
  //   //       },
  //   //     });
  //   //     toastify("success", "اطلاعات با موفقیت ثبت شد");
  //   //     setLoading(false);
  //   //     setReload((prevState) => !prevState);
  //   //   } catch (err) {
  //   //     setLoading(false);
  //   //     if (err.response.status === 400) {
  //   //       toastify("error-login", "اطلاعات ناقص است");
  //   //     } else {
  //   //       toastify("error", "خطا در برقراری ارتباط با سرور");
  //   //     }
  //   //     console.log(err);
  //   //   }
  //   // } else {
  //   //   setLoading(false);
  //   //   toastify("warning", "لطفا فیلد هارا با دقت پر کنید");
  //   //   console.log(form);
  //   // }
  // };

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
          // onClick={submitData}
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
