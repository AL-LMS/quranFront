import React, { useEffect, useContext, useState } from "react";
import { DefiContext } from "../../../../context/DefiContext";
import {
  Card,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { shamsi_be_miladi } from "../../../../helper/miladi";
import { miladi_be_shamsi, mildai_be_shamsi } from "../../../../helper/shamsi";
import { Box } from "@mui/system";

const StudentInfo = ({ form, setForm, errors }) => {
  // const [birthday, setBirthday] = useState("");
  // const { departmentID, gradeID } = useContext(DefiContext);

  // useEffect(() => {
  //   if (birthday.year) {
  //     setForm({
  //       ...form,
  //       birth: shamsi_be_miladi(birthday.year, birthday.month, birthday.day),
  //     });
  //   }
  // }, [birthday]);

  //Custom DatePicker
  // const studentBirth = ({ ref }) => (
  //   <input
  //     readOnly
  //     ref={ref} // necessary
  //     placeholder="تاریخ تولد"
  //     value={
  //       birthday ? `${birthday.year}/${birthday.month}/${birthday.day}` : ""
  //     }
  //     style={{
  //       padding: "0 8px",
  //       height: "56px",
  //       fontSize: "1rem",
  //       border: "1px solid rgba(0, 0, 0, 0.23)",
  //       width: "100%",
  //       borderRadius: "5px",
  //       color: "#666",
  //       outline: "none",
  //       display: "block",
  //       backgroundColor: "transparent",
  //       fontFamily: "iranyekanFn",
  //     }}
  //   />
  // );

  const gpaverageChange = (e) => {
    if (e.target.value > 20) {
      setForm({ ...form, gpaverage: 20 });
    } else if (e.target.value < 0) {
      setForm({ ...form, gpaverage: 0 });
    } else {
      setForm(e.target.value);
    }
  };
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
            value={form.national_code}
            onChange={(e) =>
              setForm({ ...form, national_code: e.target.value })
            }
            fullWidth
            helperText={errors.national_code && errors.national_code}
            onWheel={(e) => e.target.blur()}
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
