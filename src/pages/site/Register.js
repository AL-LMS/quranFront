import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { DefiContext } from "../../context/DefiContext";
import {
  Avatar,
  Backdrop,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { registerAuth } from "../../auth/register";
import Policy from "../../components/site/Policy";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import { shamsi_be_miladi } from "../../helper/miladi";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";

const Register = () => {
  const { auth, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    first_name: "",
    last_name: "",
    phone: user?.phone,
    password: "",
    repete_password: "",
    national_code: "",
    birthday: "",
    departement: "",
    grade: "",
    school: "",
    gavrage: "",
    sex: "female",
    parent_name: "",
    parent_phone: "",
    address: "",
    presenter: "",
    picture: "",
    policy: false,
  });
  const [errors, setErrors] = useState({});
  const [showFile, setShowFile] = useState("");
  const [loading, setLoading] = useState(false);
  const { departmentID, gradeID } = useContext(DefiContext);
  const [birthday, setBirthday] = useState("");

  const fileHandler = (e) => {
    setRegister({ ...register, picture: e.target.files[0] });
    setShowFile(URL.createObjectURL(e.target.files[0]));
  };

  const changeHandler = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setErrors(registerAuth(register));
  }, [register]);

  useEffect(() => {
    if (birthday.year) {
      setRegister({
        ...register,
        birth: shamsi_be_miladi(birthday.year, birthday.month, birthday.day),
      });
    }
  }, [birthday]);

  //Custom DatePicker
  const studentBirth = ({ ref }) => (
    <input
      readOnly
      ref={ref} // necessary
      placeholder="تاریخ تولد"
      value={
        birthday ? `${birthday.year}/${birthday.month}/${birthday.day}` : ""
      }
      style={{
        padding: "0 8px",
        height: "40px",
        fontSize: "1rem",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        width: "100%",
        borderRadius: "5px",
        color: "#666",
        outline: "none",
        display: "block",
        backgroundColor: "transparent",
        fontFamily: "iranyekanFn",
      }}
    />
  );

  const submitHandler = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("phone", register.phone);
    formData.append("grade", register.grade);
    formData.append("department", register.departement);
    formData.append("birth", register.birthday);
    formData.append("national_code", register.national_code);
    formData.append("role", "student");
    formData.append("type", "student");
    formData.append("first_name", register.first_name);
    formData.append("last_name", register.last_name);
    formData.append("picture", register.picture);
    formData.append("gpaverage", register.gavrage);
    formData.append("school", register.school);
    formData.append("parentName", register.parent_name);
    formData.append("peducation", "");
    formData.append("pjob", "");
    formData.append("address", register.address);
    formData.append("pk", user.pk);
    if (!Object.keys(errors).length) {
      try {
        const response = await axios.put("authen/update_profile/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth}`,
          },
        });
        const userInfo = await axios.get("/authen/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        });
        setUser(userInfo.data);
        localStorage.setItem("user", JSON.stringify(userInfo.data));
        toastify("success");
        setLoading(false);
        navigate("/panel/dashboard");
      } catch (err) {
        if (err.response.status === 400) {
          toastify("error-login", "کد ملی شما قبلا ثبت شده است");
        } else {
          toastify("error-login", "خطا در برقراری ارتباط با سرور");
        }
        setLoading(false);
      }
    } else {
      setLoading(false);
      toastify("warning", "لطفا فیلد هارا با دقت پر کنید");
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container mt={5}>
        <Grid item xs={12}>
          <Card
            sx={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              padding: 4,
              borderRadius: "5px",
              overflow: "initial",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography color="mainText" textAlign="center">
                  ثبت نام
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="نام"
                  name="first_name"
                  value={register.first_name}
                  onChange={changeHandler}
                  fullWidth
                  size="small"
                  helperText={errors.first_name && errors.first_name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="نام خانوادگی"
                  name="last_name"
                  value={register.last_name}
                  onChange={changeHandler}
                  fullWidth
                  size="small"
                  helperText={errors.last_name && errors.last_name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="شماره همراه"
                  name="phone"
                  value={register.phone}
                  onChange={changeHandler}
                  fullWidth
                  size="small"
                  disabled
                  helperText={errors.phone && errors.phone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="کد ملی"
                  name="national_code"
                  value={register.national_code}
                  onChange={changeHandler}
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  fullWidth
                  size="small"
                  helperText={errors.national_code && errors.national_code}
                />
              </Grid>
              {/* <Grid
                item
                xs={12}
                md={6}
                sx={{ position: "relative" }}
                className="register-date"
              >
                <DatePicker
                  value={birthday}
                  onChange={(value) => setBirthday(value)}
                  shouldHighlightWeekends
                  locale="fa"
                  // renderInput={studentBirth}
                  inputClassName="my-date-picker"
                  colorPrimary="#3f3f97"
                  calendarPopperPosition="bottom"
                  selectorEndingYear={1401}
                />
                {errors.birth && (
                  <span className="MuiFormHelperText-root">{errors.birth}</span>
                )}
              </Grid> */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="departement">رشته تحصیلی</InputLabel>
                  <Select
                    label="رشته تحصیلی"
                    value={register.departement}
                    id="departement"
                    name="departement"
                    onChange={changeHandler}
                  >
                    {departmentID.map((item) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.departement && (
                    <FormHelperText>{errors.departement}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="grade">مقطع تحصیلی</InputLabel>
                  <Select
                    label="مقطع تحصیلی"
                    value={register.grade}
                    id="grade"
                    name="grade"
                    onChange={changeHandler}
                  >
                    {gradeID.map((item) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.grade && (
                    <FormHelperText>{errors.grade}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="نام مدرسه"
                  name="school"
                  value={register.school}
                  onChange={changeHandler}
                  fullWidth
                  size="small"
                  helperText={errors.school && errors.school}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="معدل کل"
                  name="gavrage"
                  value={register.gavrage}
                  onChange={(e) =>
                    setRegister({
                      ...register,
                      gavrage: e.target.value > 20 ? 20 : e.target.value,
                    })
                  }
                  fullWidth
                  size="small"
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  helperText={errors.gavrage && errors.gavrage}
                  InputProps={{
                    inputProps: {
                      max: 20,
                      min: 0,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="نام پدر"
                  name="parent_name"
                  value={register.parent_name}
                  onChange={changeHandler}
                  fullWidth
                  size="small"
                  helperText={errors.parent_name && errors.parent_name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="شماره همراه ولی"
                  name="parent_phone"
                  value={register.parent_phone}
                  onChange={changeHandler}
                  fullWidth
                  size="small"
                  helperText={errors.parent_phone && errors.parent_phone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="آدرس"
                  name="address"
                  value={register.address}
                  onChange={changeHandler}
                  fullWidth
                  size="small"
                  helperText={errors.address && errors.address}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="کد معرف"
                  name="presenter"
                  value={register.presenter}
                  onChange={changeHandler}
                  fullWidth
                  size="small"
                  helperText={errors.presenter && errors.presenter}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="BirthCertificate"
                  multiple
                  onChange={fileHandler}
                />
                <label htmlFor="BirthCertificate">
                  <Button variant="outlined" fullWidth component="span">
                    آپلود تصویر شناسنامه یا کارت ملی
                  </Button>
                </label>
                {register.picture ? (
                  <Avatar
                    alt="BirthCertificate"
                    src={showFile}
                    sx={{
                      width: 140,
                      height: 140,
                      display: "block",
                      margin: "10px auto",
                      borderRadius: 2,
                    }}
                  />
                ) : (
                  <Typography color="error" textAlign="center" mt={2}>
                    {errors.picture}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography color="mainText" lineHeight={2}>
                  در صورتی که اطلاعات وارد شده با مدارک شناسایی مطابقت نداشته
                  باشد، دسترسی شما به پنل کاربری و کلاس‌ها، قطع خواهد شد
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={register.policy}
                      onChange={(e) =>
                        setRegister({ ...register, policy: e.target.checked })
                      }
                    />
                  }
                  label={
                    <Typography
                      color="mainText"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      تمامی <Policy /> را خوانده را قبول دارم
                    </Typography>
                  }
                />
                {errors.policy && (
                  <span className="MuiFormHelperText-root">
                    {errors.policy}
                  </span>
                )}
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{
                    boxShadow: "none",
                    padding: "12px 0",
                    borderRadius: "15px",
                  }}
                  fullWidth
                  onClick={submitHandler}
                >
                  ثبت نام
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
      <Backdrop open={loading} />
    </Container>
  );
};

export default Register;
