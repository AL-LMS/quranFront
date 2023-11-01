import React from "react";
import { Card, TextField, Grid, Typography, Autocomplete } from "@mui/material";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import {
  ages,
  degree,
  sex,
} from "../../../../pages/dashboard/teacher/CourseData";

const StudentInfo = ({ formik }) => {
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
            onChange={(e) =>
              formik.setFieldValue("national_id", e.target.value)
            }
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
          <Autocomplete
            fullWidth
            value={ages[formik.values.ages]}
            onChange={(event, newValue) =>
              formik.setFieldValue("ages", newValue.id)
            }
            id="controllable-states-demo"
            options={ages}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField {...params} label="رده سنی" required />
            )}
          />
          {formik.touched.ages && formik.errors.ages ? (
            <div>
              <p style={{ fontSize: 10, color: "red" }}>{formik.errors.ages}</p>
            </div>
          ) : null}
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
              <p style={{ fontSize: 10, color: "red" }}>
                {formik.errors.degree}
              </p>
            </div>
          ) : null}
        </Grid>
      </Grid>
    </Card>
  );
};

export default StudentInfo;
