import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { toastify } from "../../../helper/toast";
import { ToastContainer } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { DatePicker } from "zaman";
import "./style.css";
import { convertToPersianDate } from "../converter/dateConverter";
import { Days, ages, courseType, degree, sex_for_class } from "./CourseData";
import Documnets from "./Documnets";
import CheckIcon from "@mui/icons-material/Check";
import { TimePicker } from "react-ios-time-picker";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { getUrl } from "../../../helper/getUrl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Picker, format } from "@persian-tools/persian-mobile-datepicker";

const CreateCourse = () => {
  const [loading, setLoading] = useState(false);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [showLastCertificate, setShowLastCertificate] = useState("");
  const [prerequisite, setPrerequisite] = useState([]);
  const [days, setDays] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [startValue, setStartValue] = useState(null);
  const [endValue, setEndValue] = useState(null);
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
    const date = format(selectedDate.date, "yyyy-MM-dd");
    formik.setFieldValue(field, date);
  }
  const [open, setOpen] = useState(false);
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
    min: null,
    prerequisite: [],
    sex: null,
    ages: null,
    degree: null,
    picture: null,
    price: null,
  };
  const RegistrationSchema = Yup.object().shape({
    type: Yup.string().required("لطفا نوع دوره را وارد نمایید."),
    name: Yup.string().required("لطفا نام دوره را وارد نمایید."),
    explain: Yup.string().required("لطفا توضیحات دوره را وارد نمایید."),
    start: Yup.string().required("لطفا روز شروع دوره را وارد نمایید."),
    end: Yup.string().required("لطفا روز پایان دوره را وارد نمایید."),
    start_time: Yup.string().required("لطفا ساعت شروع دوره را وارد نمایید."),
    end_time: Yup.string().required("لطفا ساعت پایان دوره را وارد نمایید."),
    days: Yup.array().min(1, "لطفا روزهای دوره را وارد نمایید."),
    max: Yup.string().required("لطفا حداکثر تعداد نفرات دوره را وارد نمایید."),
    min: Yup.string().required("لطفا حداقل تعداد نفرات دوره را وارد نمایید."),
    prerequisite: Yup.array().min(1, "لطفا پیش نیاز دوره را وارد نمایید."),
    sex: Yup.string().required("لطفا جنسیت دوره را وارد نمایید."),
    ages: Yup.string().required("لطفا رده سنی دوره را وارد نمایید."),
    degree: Yup.string().required("لطفا تحصیلات مورد نظر دوره را وارد نمایید."),
    picture: Yup.string().required("لطفا تصویر دوره را وارد نمایید."),
    price: Yup.string().required("لطفا هزینه دوره را وارد نمایید."),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      add_course().then(() => {});
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
    let config = {
      url: "insert_request",
    };
    let data = {
      table: "courses",
      method_type: "add_course",
      data: {
        type: formik.values.type,
        name: formik.values.name,
        explain: formik.values.explain,
        is_online: formik.values.isOnline,
        start_date: formik.values.start,
        end_date: formik.values.end,
        start_time: formik.values.start_time,
        end_time: formik.values.end_time,
        days: formik.values.days,
        max: formik.values.max,
        min: formik.values.min,
        prerequisite: formik.values.prerequisite,
        sex: formik.values.sex,
        ages: formik.values.ages,
        degree: formik.values.degree,
        picture: formik.values.picture,
        price: formik.values.price,
        t_name: userInfo.first_name + " " + userInfo.last_name,
        teacher_user_id: userInfo.user_id,
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

      baseURL: getUrl() + "back_request/insert_request/",
    });
    if (response?.data?.tracking_code !== null) {
      toastify("success", response?.data?.response);
      navigate("/panel/dashboard");
    } else {
      toastify("error-login", response?.data?.error);
    }
  };

  const onChangeStartTime = (timeValue) => {
    formik.setFieldValue("start_time", timeValue);
    setStartValue(timeValue);
  };

  const onChangeEndTime = (timeValue) => {
    formik.setFieldValue("end_time", timeValue);
    setEndValue(timeValue);
  };
  const handleDatePicker = (e) => {
    let persianStart = "";
    let persianEnd = "";
    persianStart = convertToPersianDate(e.from);
    persianEnd = convertToPersianDate(e.to);
    formik.setFieldValue("start", persianStart);
    formik.setFieldValue("end", persianEnd);
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
              <TextField
                label="تاربخ شروع"
                name="start_date"
                value={formik.values.start}
                fullWidth
                onClick={() => setOpen(true)}
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
                isOpen={open}
                highlightHolidays
                highlightWeekends
                initialValue={new Date("2021-03-20T20:30:00.000Z")}
                onSubmit={(date) => {
                  setOpen(false);
                  handleSubmit(date, "start");
                }}
                theme="light"
              />
              <TextField
                label="تاربخ پایان"
                name="end_date"
                value={formik.values.end}
                fullWidth
                onClick={() => setOpen(true)}
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
                isOpen={open}
                highlightHolidays
                highlightWeekends
                initialValue={new Date("2021-03-20T20:30:00.000Z")}
                onSubmit={(date) => {
                  setOpen(false);
                  handleSubmit(date, "end");
                }}
                theme="light"
              />
              <section className="wrapper">
                <div className="libWrapper">
                  <TimePicker
                    style={{ direction: "rtl" }}
                    onChange={onChangeStartTime}
                    value={startValue}
                    placeHolder="زمان شروع کلاس"
                    cancelButtonText="انصراف"
                    saveButtonText="ذخیره "
                  />
                  {formik.touched.start_time && formik.errors.start_time ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.start_time}
                      </p>
                    </div>
                  ) : null}
                  <TimePicker
                    onChange={onChangeEndTime}
                    value={endValue}
                    placeHolder="زمان پایان کلاس"
                    cancelButtonText="انصراف"
                    saveButtonText="ذخیره "
                  />
                  {formik.touched.end_time && formik.errors.end_time ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.end_time}
                      </p>
                    </div>
                  ) : null}
                </div>
              </section>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={3} padding={2}>
            <Grid item md={6} xs={12}>
              <Grid style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    label="حدنصاب کلاس"
                    name="min"
                    type="number"
                    onChange={(e) =>
                      formik.setFieldValue("min", e.target.value)
                    }
                    value={formik.values.min}
                    style={{ marginLeft: "5px" }}
                  />
                  {formik.touched.min && formik.errors.min ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.min}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    label="حداکثر کلاس"
                    name="max"
                    type="number"
                    onChange={(e) =>
                      formik.setFieldValue("max", e.target.value)
                    }
                    value={formik.values.max}
                    style={{ marginRight: "5px" }}
                  />
                  {formik.touched.max && formik.errors.max ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.max}
                      </p>
                    </div>
                  ) : null}
                </div>
              </Grid>
              <div style={{ display: "flex", flexDirection: "column" }}>
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
              <Grid style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
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
                      <TextField {...params} label="جنسیت" />
                    )}
                    style={{ marginLeft: "5px" }}
                  />
                  {formik.touched.sex && formik.errors.sex ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.sex}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
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
                      <TextField {...params} label="رده سنی" />
                    )}
                    style={{ marginRight: "5px" }}
                  />
                  {formik.touched.ages && formik.errors.ages ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.ages}
                      </p>
                    </div>
                  ) : null}
                </div>
              </Grid>
              <Grid style={{ display: "flex", marginTop: "5px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Autocomplete
                    fullWidth
                    value={degree[formik.values.degree]}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("degree", newValue.id);
                    }}
                    id="controllable-states-demo"
                    options={degree}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="تحصیلات" />
                    )}
                    style={{ marginLeft: "5px" }}
                  />
                  {formik.touched.degree && formik.errors.degree ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.degree}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    label="هزینه ثبت نام"
                    name="price"
                    type="number"
                    onChange={(e) =>
                      formik.setFieldValue("price", e.target.value)
                    }
                    value={formik.values.price}
                    style={{ marginRight: "5px" }}
                  />
                  {formik.touched.price && formik.errors.price ? (
                    <div>
                      <p style={{ fontSize: 10, color: "red" }}>
                        {formik.errors.price}
                      </p>
                    </div>
                  ) : null}
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Documnets
                formik={formik}
                showLastCertificate={showLastCertificate}
                setShowLastCertificate={setShowLastCertificate}
                nameOfSection={"تصویر دوره"}
                nameOfButtonField={"آپلود تصویر تصویر دوره"}
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
