import React from "react";
import { Card, TextField, Grid, Typography, Autocomplete } from "@mui/material";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import {
  ages,
  degree,
  sex,
} from "../../../../pages/dashboard/teacher/CourseData";

const StudentInfo = ({ form, setForm, errors }) => {
  return (
    <Card
      sx={{
        padding: 2,
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: 3,
      }}
    >
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
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
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
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
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
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
            value={form.national_id}
            onChange={(e) => setForm({ ...form, national_id: e.target.value })}
            fullWidth
            required
            helperText={errors.national_id && errors.national_id}
            onWheel={(e) => e.target.blur()}
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
              <TextField {...params} label="جنسیت" required />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
              <TextField {...params} label="رده سنی" required />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
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
              <TextField {...params} label="تحصیلات" required />
            )}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default StudentInfo;
