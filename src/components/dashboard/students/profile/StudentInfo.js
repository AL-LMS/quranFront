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
            renderInput={(params) => <TextField {...params} label="جنسیت" />}
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
            renderInput={(params) => <TextField {...params} label="رده سنی" />}
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
            renderInput={(params) => <TextField {...params} label="تحصیلات" />}
          />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <TextField
            label="نام مدرسه"
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="معدل"
            value={form.gpaverage}
            onChange={(e) =>
              setForm({
                ...form,
                gpaverage: e.target.value > 20 ? 20 : e.target.value,
              })
            }
            fullWidth
            onWheel={(e) => e.target.blur()}
            type="number"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="grade">مقطع تحصیلی</InputLabel>
            <Select
              label="مقطع تحصیلی"
              value={form.grade}
              id="grade"
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            >
              {gradeID?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            {errors.grade && <FormHelperText>{errors.grade}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="grade">رشته تحصیلی</InputLabel>
            <Select
              label="رشته تحصیلی"
              value={form.department}
              id="grade"
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              {departmentID.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            {errors.department && (
              <FormHelperText>{errors.department}</FormHelperText>
            )}
          </FormControl>
        </Grid> */}
        {/* <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <DatePicker
            value={birthday}
            onChange={(value) => setBirthday(value)}
            shouldHighlightWeekends
            locale="fa"
            renderInput={studentBirth}
            inputClassName="my-date-picker"
            colorPrimary="#651fff"
            selectorEndingYear={1401}
          />
          <Box component="div" sx={{ fontFamily: "iranyekanFn" }}>
            {form.birth && miladi_be_shamsi(form.birth)}
          </Box>
        </Grid> */}
      </Grid>
    </Card>
  );
};

export default StudentInfo;
