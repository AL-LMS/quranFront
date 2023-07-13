import React from "react";
import { Card, Grid, TextField, Typography } from "@mui/material";

const form = ({ form, setForm }) => {
  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
            مشخصات ولی دانش آموز
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="نام"
            value={form.parentName}
            name="parentName"
            onChange={changeHandler}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="کد ملی"
            value={form.parentNationalCode}
            name="parentNationalCode"
            onChange={changeHandler}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="شغل"
            value={form.pjob}
            name="pjob"
            onChange={changeHandler}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="تحصیلات"
            value={form.peducation}
            name="peducation"
            onChange={changeHandler}
            fullWidth
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default form;
