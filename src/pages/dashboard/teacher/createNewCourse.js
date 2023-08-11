import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
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
import { DefiContext } from "../../../context/DefiContext";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { DatePicker } from "zaman";
import "./style.css";
import { convertToPersianDate } from "../converter/dateConverter";
import { Days, ages, courseType, degree, sex } from "./CourseData";
import Documnets from "./Documnets";
import CheckIcon from "@mui/icons-material/Check";
import { TimePicker } from "react-ios-time-picker";
import { styled } from "styled-components";

const CreateCourse = () => {
  const [loading, setLoading] = useState(false);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [showLastCertificate, setShowLastCertificate] = useState("");
  const [prerequisite, setPrerequisite] = useState([]);
  const [days, setDays] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [value, setValue] = useState(null);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [form, setForm] = useState({
    type: "",
    name: "",
    explain: "",
    isOnline: isOnline,
    start: "",
    end: "",
    time: "",
    days: [],
    max: "",
    min: "",
    prerequisite: [],
    sex: "",
    ages: "",
    degree: "",
    picture: "",
    price: "",
  });
  const handleCheckboxChange = (event) => {
    setIsOnline(event.target.checked);
    setForm({ ...form, isOnline: event.target.checked });
  };
  const add_course = async () => {
    let config = {
      url: "insert_request",
    };
    let data = {
      table: "courses",
      method_type: "",
      data: {
        type: form.type,
        name: form.name,
        explain: form.explain,
        is_online: form.isOnline,
        start_date: form.start,
        end_date: form.end,
        time: form.time,
        days: form.days,
        max: form.max,
        min: form.min,
        prerequisite: form.prerequisite,
        sex: form.sex,
        ages: form.ages,
        degree: form.degree,
        picture: form.picture,
        price: form.price,
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

      baseURL: "http://127.0.0.1:5000/add_course/",
    });
    if (response?.data?.tracking_code !== null) {
      toastify("success", response?.data?.response);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };

  const handleDatePicker = (e) => {
    let persianStart = "";
    let persianEnd = "";
    persianStart = convertToPersianDate(e.from);
    persianEnd = convertToPersianDate(e.to);
    setForm({ ...form, start: persianStart, end: persianEnd });
  };
  const onChange = (timeValue) => {
    setForm({ ...form, time: timeValue });
    setValue(timeValue);
  };
  useEffect(() => {
    setForm({ ...form, days: days });
  }, [days]);

  useEffect(() => {
    setForm({ ...form, prerequisite: prerequisite });
  }, [prerequisite]);
  return (
    <Container>
      <Structure>
        <Grid container spacing={3} padding={2}>
          <Grid item md={6} xs={12}>
            <Autocomplete
              fullWidth
              value={form.type}
              onChange={(event, newValue) => {
                setForm({ ...form, type: newValue });
              }}
              id="controllable-states-demo"
              options={courseType}
              getOptionLabel={(option) => option || ""}
              renderInput={(params) => (
                <TextField {...params} label="دسته بندی موضوعی" />
              )}
            />
            <TextField
              fullWidth
              label="نام دوره"
              name="name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              value={form.name}
              sx={{ marginTop: 1 }}
            />
            <TextField
              fullWidth
              label="توضیحات"
              name="explain"
              onChange={(e) => setForm({ ...form, explain: e.target.value })}
              value={form.explain}
              sx={{ marginTop: 1 }}
            />
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
                label="کلاس به صورت حضوری است."
                sx={{
                  padding: "4px 15px",
                  marginBottom: "2rem",
                }}
              />
            </FormGroup>
          </Grid>
          <Grid item md={6} xs={12}>
            <section className="wrapper">
              <div className="libWrapper">
                <DatePicker
                  zindex={1000}
                  round="x1"
                  accentColor="#6374ae"
                  defaultValue={calendarValue}
                  inputAttributes={{
                    placeholder: "تاریخ شروع - پایان",
                  }}
                  onChange={(e) => handleDatePicker(e)}
                  range
                />
                <TimePicker
                  onChange={onChange}
                  value={value}
                  placeHolder="زمان برگزاری کلاس"
                  cancelButtonText="انصراف"
                  saveButtonText="ذخیره "
                />
              </div>
            </section>

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
                <TextField {...params} label="روز‌های برگزاری" placeholder="" />
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
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={3} padding={2}>
          <Grid item md={6} xs={12}>
            <Grid style={{ display: "flex" }}>
              <TextField
                fullWidth
                label="حدنصاب کلاس"
                name="min"
                type="number"
                onChange={(e) => setForm({ ...form, min: e.target.value })}
                value={form.min}
                style={{ marginLeft: "5px" }}
              />
              <TextField
                fullWidth
                label="حداکثر کلاس"
                name="max"
                type="number"
                onChange={(e) => setForm({ ...form, max: e.target.value })}
                value={form.max}
                style={{ marginRight: "5px" }}
              />
            </Grid>
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
          </Grid>
          <Grid item md={6} xs={12}>
            <Grid style={{ display: "flex" }}>
              <Autocomplete
                fullWidth
                value={sex[form.sex]}
                onChange={(event, newValue) => {
                  setForm({ ...form, sex: newValue.id });
                }}
                id="controllable-states-demo"
                options={sex}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="جنسیت" />
                )}
                style={{ marginLeft: "5px" }}
              />
              <Autocomplete
                fullWidth
                value={ages[form.ages]}
                onChange={(event, newValue) => {
                  setForm({ ...form, ages: newValue.id });
                }}
                id="controllable-states-demo"
                options={ages}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="رده سنی" />
                )}
                style={{ marginRight: "5px" }}
              />
            </Grid>
            <Grid style={{ display: "flex", marginTop: "5px" }}>
              <Autocomplete
                fullWidth
                value={degree[form.degree]}
                onChange={(event, newValue) => {
                  setForm({ ...form, degree: newValue.id });
                }}
                id="controllable-states-demo"
                options={degree}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="تحصیلات" />
                )}
                style={{ marginLeft: "5px" }}
              />
              <TextField
                fullWidth
                label="قیمت"
                name="price"
                type="number"
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                value={form.price}
                style={{ marginRight: "5px" }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Documnets
              form={form}
              setForm={setForm}
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
              onClick={() => add_course()}
              fullWidth
              disabled={loading}
              sx={{ boxShadow: "none", padding: "12px 0" }}
            >
              ثبت اطلاعات
            </Button>
          </Grid>
        </Grid>
        {/* {isOnline && (
        <MapContainer
          center={position}
          zoom={13}
          style={{ width: "50px", height: "500px" }}
          onClick={handleMapClick}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>Your selected location</Popup>
          </Marker>
        </MapContainer>
      )} */}
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
  @media screen and (max-width: 768px) {
    width: 100vw;
  }
  @media screen and (max-width: 480px) {
    width: 100vw;
  }
`;
