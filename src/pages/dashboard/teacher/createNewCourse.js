import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Autocomplete,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { toastify } from "../../../helper/toast";
import { ToastContainer } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import "./style.css";
import { Days, ages, courseType, degree, sex_for_class } from "./CourseData";
import Documnets from "./Documnets";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { getUrl } from "../../../helper/getUrl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Picker, format } from "@persian-tools/persian-mobile-datepicker";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/fa_IR";
import defaultPic from "../../../assets/img/class1.jpeg";
const CreateCourse = () => {
  const [loading, setLoading] = useState(false);
  const [showLastCertificate, setShowLastCertificate] = useState(defaultPic);
  const [prerequisite, setPrerequisite] = useState([]);
  const [days, setDays] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [startValue, setStartValue] = useState(null);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [variant, setVariant] = useState(0);
  const config = {
    year: {
      caption: {
        text: "سال",
      },
    },
    month: {
      caption: {
        text: "ماه",
      },
    },
    day: {
      caption: {
        text: "روز",
      },
    },
  };
  function handleSubmit(selectedDate, field) {
    if (field === "start") {
      setStartValue(selectedDate.date);
    }
    const date = format(selectedDate.date, "yyyy-MM-dd");
    formik.setFieldValue(field, date);
  }
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const initialValues = {
    type: null,
    name: null,
    explain: null,
    isOnline: isOnline,
    start: null,
    end: null,
    start_time: null,
    end_time: null,
    days: [],
    max: null,
    min: 1,
    prerequisite: [],
    sex: null,
    ages: null,
    degree: 1,
    picture: defaultPic,
    price: 0,
  };
  const RegistrationSchema = Yup.object().shape({
    type: Yup.string().required("لطفا نوع دوره را وارد نمایید."),
    name: Yup.string().required("لطفا نام دوره را وارد نمایید."),
    explain: Yup.string().required("لطفا توضیحات دوره را وارد نمایید."),
    start: Yup.string().required("لطفا روز شروع دوره را وارد نمایید."),
    end: Yup.string().required("لطفا روز پایان دوره را وارد نمایید."),
    start_time: Yup.string().required(
      "لطفا ساعت شروع و پایان دوره را وارد نمایید."
    ),
    end_time: Yup.string().required("لطفا ساعت پایان دوره را وارد نمایید."),
    days: Yup.array().min(1, "لطفا روزهای دوره را وارد نمایید."),
    max: Yup.string().required("لطفا حداکثر تعداد نفرات دوره را وارد نمایید."),
    min: Yup.string().required("لطفا حداقل تعداد نفرات دوره را وارد نمایید."),
    prerequisite: Yup.array().min(1, "لطفا پیش نیاز دوره را وارد نمایید."),
    sex: Yup.string().required("لطفا جنسیت دوره را وارد نمایید."),
    ages: Yup.string().required("لطفا رده سنی دوره را وارد نمایید."),
    // degree: Yup.string().required("لطفا تحصیلات مورد نظر دوره را وارد نمایید."),
    price: Yup.string().required("لطفا هزینه دوره را وارد نمایید."),
  });
  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      add_course().then(() => {
        setLoading(false);
      });
    },
  });
  const handleCheckboxChange = () => {
    if (isOnline) {
      setIsOnline(false);
      formik.setFieldValue("isOnline", false);
    } else {
      setIsOnline(true);
      formik.setFieldValue("isOnline", true);
    }
  };
  const navigate = useNavigate();
  const add_course = async () => {
    console.log(formik.values);
    const formData = new FormData();
    formData.append("type", formik.values.type);
    formData.append("name", formik.values.name);
    formData.append("explain", formik.values.explain);
    formData.append("is_online", formik.values.isOnline);
    formData.append("start_date", formik.values.start);
    formData.append("end_date", formik.values.end);
    formData.append("days", JSON.stringify(formik.values.days));
    formData.append("start_time", formik.values.start_time);
    formData.append("end_time", formik.values.end_time);
    formData.append("sex", formik.values.sex);
    formData.append("min", formik.values.min);
    formData.append("max", formik.values.max);
    formData.append("prerequisite", JSON.stringify(formik.values.prerequisite));
    formData.append("ages", formik.values.ages);
    formData.append("degree", formik.values.degree);
    formData.append("price", formik.values.price);
    formData.append(
      "picture",
      formik.values.picture ? formik.values.picture : "default"
    );
    formData.append("t_name", userInfo.first_name + " " + userInfo.last_name);
    formData.append("teacher_user_id", userInfo.user_id);
    let response = await axios.post(
      getUrl() + "back_request/create_new_course/",
      formData,
      {
        headers: {
          "content-type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    if (response?.data?.tracking_code !== null) {
      toastify("success", response?.data?.response);
      navigate("/panel/dashboard");
    } else {
      toastify("error-login", response?.data?.error);
    }
  };
  const onChangeSetTime = (date) => {
    formik.setFieldValue("start_time", date[0].format("HH") + ":00");
    formik.setFieldValue("end_time", date[1].format("HH") + ":00");
  };

  useEffect(() => {
    formik.setFieldValue("days", days);
  }, [days]);

  useEffect(() => {
    formik.setFieldValue("prerequisite", prerequisite);
  }, [prerequisite]);
  return (
    <Container>
      <Structure>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3} padding={2}>
            <Grid item md={6} xs={12}>
              <Autocomplete
                fullWidth
                value={formik.values.type}
                onChange={(event, newValue) => {
                  formik.setFieldValue("type", newValue);
                }}
                id="controllable-states-demo"
                options={courseType}
                getOptionLabel={(option) => option || ""}
                renderInput={(params) => (
                  <TextField {...params} label="دسته بندی موضوعی" />
                )}
              />
              {formik.touched.type && formik.errors.type ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.type}
                  </p>
                </div>
              ) : null}
              <TextField
                fullWidth
                label="نام دوره"
                name="name"
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
                value={formik.values.name}
                sx={{ marginTop: 1 }}
              />
              {formik.touched.name && formik.errors.name ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.name}
                  </p>
                </div>
              ) : null}
              <TextField
                fullWidth
                multiline
                rows={5}
                label="توضیحات"
                name="explain"
                onChange={(e) =>
                  formik.setFieldValue("explain", e.target.value)
                }
                value={formik.values.explain}
                sx={{ marginTop: 1 }}
              />
              {formik.touched.explain && formik.errors.explain ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.explain}
                  </p>
                </div>
              ) : null}
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                fullWidth
                multiple
                limitTags={1}
                id="multiple-limit-tags"
                getOptionLabel={(option) => option}
                disableCloseOnSelect
                value={days}
                options={Days}
                onChange={(event, newValue) => {
                  setDays([...newValue.filter((option) => option)]);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="روز‌های برگزاری"
                    placeholder=""
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <MenuItem
                    {...props}
                    key={option}
                    value={option}
                    sx={{ justifyContent: "space-between" }}
                  >
                    {option}
                    {selected ? <CheckIcon color="info" /> : null}
                  </MenuItem>
                )}
                style={{ marginBottom: "2px" }}
              />
              {formik.touched.days && formik.errors.days ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.days}
                  </p>
                </div>
              ) : null}
              <Grid style={{ display: "flex", flexWrap: "wrap" }}>
                <ContainerX>
                  <TextField
                    label="تاربخ شروع"
                    name="start_date"
                    value={formik.values.start ? formik.values.start : ""}
                    fullWidth
                    onFocus={() => setOpenStart(true)}
                    sx={{ marginTop: 1 }}
                  />
                  {formik.touched.start && formik.errors.start ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.start}
                      </p>
                    </div>
                  ) : null}
                  <Picker
                    config={config}
                    isOpen={openStart}
                    highlightHolidays
                    highlightWeekends
                    addDayName
                    initialValue={new Date()}
                    minDate={new Date()}
                    maxDate={new Date("2026-03-20")}
                    onSubmit={(date) => {
                      handleSubmit(date, "start");
                      setOpenStart(false);
                    }}
                    onCancel={() => setOpenStart(false)}
                    onClose={() => setOpenStart(false)}
                    theme="light"
                  />
                </ContainerX>
                <ContainerX>
                  <TextField
                    label="تاربخ پایان"
                    name="end_date"
                    value={formik.values.end ? formik.values.end : ""}
                    fullWidth
                    onFocus={() => setOpenEnd(true)}
                    sx={{ marginTop: 1 }}
                  />
                  {formik.touched.end && formik.errors.end ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.end}
                      </p>
                    </div>
                  ) : null}
                  <Picker
                    config={config}
                    isOpen={openEnd}
                    highlightHolidays
                    highlightWeekends
                    addDayName
                    minDate={startValue ? startValue : new Date()}
                    maxDate={new Date("2026-03-20")}
                    initialValue={new Date()}
                    onSubmit={(date) => {
                      handleSubmit(date, "end");
                      setOpenEnd(false);
                    }}
                    onCancel={() => setOpenEnd(false)}
                    onClose={() => setOpenEnd(false)}
                    theme="light"
                  />
                </ContainerX>
              </Grid>
              <TimePicker.RangePicker
                defaultValue={dayjs("12:00", "HH:mm")}
                size="large"
                direction="rtl"
                format="HH"
                disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 23]}
                locale={{
                  ...locale,
                  lang: {
                    ...locale.lang,
                    now: "حال",
                    ok: "ثبت",
                  },
                }}
                style={{ width: "100%", height: "56px", marginTop: "10px" }}
                onChange={(date) => onChangeSetTime(date)}
              />
              {formik.touched.start_time && formik.errors.start_time ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.start_time}
                  </p>
                </div>
              ) : null}
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isOnline}
                      onChange={handleCheckboxChange}
                      name="isOnline"
                      color="primary"
                    />
                  }
                  label="کلاس به صورت مجازی برگزار می‌شود."
                  sx={{
                    fontSize: "13px",
                    padding: "4px 15px",
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!isOnline}
                      onChange={handleCheckboxChange}
                      name="isOffline"
                      color="primary"
                    />
                  }
                  label="کلاس به صورت حضوری برگزار می‌شود."
                  sx={{
                    fontSize: "13px",
                    padding: "4px 15px",
                    marginBottom: "2rem",
                  }}
                />
              </FormGroup>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={3} padding={2}>
            <Grid item md={6} xs={12}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <ContainerX>
                  <TextField
                    fullWidth
                    label="حدنصاب کلاس"
                    name="min"
                    type="number"
                    onChange={(e) =>
                      formik.setFieldValue("min", e.target.value)
                    }
                    value={formik.values.min}
                  />
                  {formik.touched.min && formik.errors.min ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.min}
                      </p>
                    </div>
                  ) : null}
                </ContainerX>
                <ContainerX>
                  <TextField
                    fullWidth
                    label="حداکثر کلاس"
                    name="max"
                    type="number"
                    onChange={(e) =>
                      formik.setFieldValue("max", e.target.value)
                    }
                    value={formik.values.max}
                  />
                  {formik.touched.max && formik.errors.max ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.max}
                      </p>
                    </div>
                  ) : null}
                </ContainerX>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                }}
              >
                <Autocomplete
                  fullWidth
                  multiple
                  limitTags={1}
                  id="multiple-limit-tags"
                  getOptionLabel={(option) => option}
                  disableCloseOnSelect
                  value={prerequisite}
                  options={courseType}
                  onChange={(event, newValue) => {
                    setPrerequisite([...newValue.filter((option) => option)]);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="پیشنیاز‌ها" placeholder="" />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <MenuItem
                      {...props}
                      key={option}
                      value={option}
                      sx={{ justifyContent: "space-between" }}
                    >
                      {option}
                      {selected ? <CheckIcon color="info" /> : null}
                    </MenuItem>
                  )}
                  style={{ marginBottom: "5px", marginTop: "5px" }}
                />
                {formik.touched.prerequisite && formik.errors.prerequisite ? (
                  <div>
                    <p style={{ fontSize: 10, color: "red" }}>
                      {formik.errors.prerequisite}
                    </p>
                  </div>
                ) : null}
              </div>
            </Grid>
            <Grid item md={6} xs={12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <ContainerX>
                  <Autocomplete
                    fullWidth
                    value={sex_for_class[formik.values.sex]}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("sex", newValue.id);
                    }}
                    id="controllable-states-demo"
                    options={sex_for_class}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} label="جنسیت" />
                    )}
                  />
                  {formik.touched.sex && formik.errors.sex ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.sex}
                      </p>
                    </div>
                  ) : null}
                </ContainerX>
                <ContainerX>
                  <Autocomplete
                    fullWidth
                    value={ages[formik.values.ages]}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("ages", newValue.id);
                    }}
                    id="controllable-states-demo"
                    options={ages}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} label="رده سنی" />
                    )}
                  />
                  {formik.touched.ages && formik.errors.ages ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.ages}
                      </p>
                    </div>
                  ) : null}
                </ContainerX>
              </div>
              <Grid
                style={{ display: "flex", marginTop: "5px", flexWrap: "wrap" }}
              >
                <ContainerX>
                  <FormControl>
                    <FormLabel>نوع کلاس</FormLabel>
                    <RadioGroup
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      value={variant}
                      onChange={(event) =>
                        setVariant(parseInt(event.target.value))
                      }
                    >
                      <Radio value={0} label="رایگان" />
                      <label>رایگان</label>
                      <Radio value={1} label="هزینه‌ای" />
                      <label>هزینه‌ای</label>
                    </RadioGroup>
                  </FormControl>
                </ContainerX>
                {variant !== 0 ? (
                  <ContainerX>
                    <TextField
                      fullWidth
                      label="هزینه ثبت نام"
                      name="price"
                      type="number"
                      onChange={(e) =>
                        formik.setFieldValue("price", e.target.value)
                      }
                      value={formik.values.price}
                    />
                    {formik.touched.price && formik.errors.price ? (
                      <div>
                        <p style={{ fontSize: 10, color: "red" }}>
                          {formik.errors.price}
                        </p>
                      </div>
                    ) : null}
                  </ContainerX>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Documnets
                formik={formik}
                showLastCertificate={showLastCertificate}
                setShowLastCertificate={setShowLastCertificate}
                nameOfSection={"پوستر دوره"}
                nameOfButtonField={"تغییر پوستر دوره"}
              />
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading}
                sx={{ boxShadow: "none", padding: "12px 0" }}
              >
                ثبت اطلاعات
              </Button>
            </Grid>
          </Grid>
        </form>
      </Structure>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default CreateCourse;

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export const Structure = styled.div`
  width: 75vw;
  background: #fff;
  @media screen and (max-width: 768px) {
    width: 100vw;
  }
  @media screen and (max-width: 480px) {
    width: 100vw;
  }
`;

export const ContainerX = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    flex-wrap: wrap;
    width: 100%;
    margin-top: 10px;
  }
`;
