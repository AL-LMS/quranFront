import React, { useState } from "react";
import { TextField, Grid, Typography, Autocomplete } from "@mui/material";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { degree, sex } from "../../../../pages/dashboard/teacher/CourseData";
import { Picker, format } from "@persian-tools/persian-mobile-datepicker";

const StudentInfo = ({ formik }) => {
  const [openBirthDay, setOpenBirthDay] = useState(false);

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
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography
          component="h6"
          variant="h6"
          fontWeight={500}
          color="mainText"
          textAlign="center"
        >
          مشخصات قرآن آموز
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="نام"
          value={formik.values.first_name}
          fullWidth
          disabled
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="نام خانوادگی"
          value={formik.values.last_name}
          fullWidth
          disabled
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="شماره موبایل"
          value={formik.values.phone}
          fullWidth
          disabled
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="کد ملی"
          value={formik.values.national_id}
          onChange={(e) => formik.setFieldValue("national_id", e.target.value)}
          fullWidth
          required
          onWheel={(e) => e.target.blur()}
        />
        {formik.touched.national_id && formik.errors.national_id ? (
          <div>
            <p style={{ fontSize: 10, color: "red" }}>
              {formik.errors.national_id}
            </p>
          </div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          fullWidth
          value={sex[formik.values.sex]}
          onChange={(event, newValue) =>
            formik.setFieldValue("sex", newValue.id)
          }
          id="controllable-states-demo"
          options={sex}
          getOptionLabel={(option) => option.name || ""}
          renderInput={(params) => (
            <TextField {...params} label="جنسیت" required />
          )}
        />
        {formik.touched.sex && formik.errors.sex ? (
          <div>
            <p style={{ fontSize: 10, color: "red" }}>{formik.errors.sex}</p>
          </div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="تاربخ شروع"
          name="start_date"
          value={formik.values.birth_day ? formik.values.birth_day : ""}
          fullWidth
          onFocus={() => setOpenBirthDay(true)}
        />
        {formik.touched.birth_day && formik.errors.birth_day ? (
          <div>
            <p style={{ fontSize: 10, color: "red" }}>
              {formik.errors.birth_day}
            </p>
          </div>
        ) : null}
        <Picker
          config={config}
          isOpen={openBirthDay}
          highlightHolidays
          highlightWeekends
          addDayName
          initialValue={new Date("1980-03-20T20:30:00.000Z")}
          onSubmit={(date) => {
            handleSubmit(date, "birth_day");
            setOpenBirthDay(false);
          }}
          onCancel={() => setOpenBirthDay(false)}
          onClose={() => setOpenBirthDay(false)}
          theme="light"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          fullWidth
          value={degree[formik.values.degree]}
          onChange={(event, newValue) =>
            formik.setFieldValue("degree", newValue.id)
          }
          id="controllable-states-demo"
          options={degree}
          getOptionLabel={(option) => option.name || ""}
          renderInput={(params) => (
            <TextField {...params} label="تحصیلات" required />
          )}
        />
        {formik.touched.degree && formik.errors.degree ? (
          <div>
            <p style={{ fontSize: 10, color: "red" }}>{formik.errors.degree}</p>
          </div>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default StudentInfo;
