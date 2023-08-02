import React, { useState } from "react";
import { Avatar, Button, Card, Grid, Typography } from "@mui/material";

const Documnets = ({
  form,
  setForm,
  showLastCertificate,
  setShowLastCertificate,
  nameOfSection,
  nameOfButtonField,
}) => {
  const birthCertificateHandler = (e) => {
    setForm({ ...form, picture: e.target.files[0] });
    setShowLastCertificate(URL.createObjectURL(e.target.files[0]));
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
            {nameOfSection}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ margin: "0 auto" }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="LastCertificate"
            multiple
            onChange={birthCertificateHandler}
          />
          <label htmlFor="LastCertificate">
            <Button variant="outlined" fullWidth component="span">
              {nameOfButtonField}
            </Button>
          </label>
          {form.picture ? (
            <Avatar
              alt="LastCertificate"
              src={
                showLastCertificate || `https://api.srvschool.ir${form.picture}`
              }
              sx={{
                width: 140,
                height: 140,
                display: "block",
                margin: "10px auto",
                borderRadius: 2,
              }}
            />
          ) : showLastCertificate ? (
            <Avatar
              alt="LastCertificate"
              src={showLastCertificate}
              sx={{
                width: 140,
                height: 140,
                display: "block",
                margin: "10px auto",
                borderRadius: 2,
              }}
            />
          ) : (
            <Typography color="text.secondary" textAlign="center" mt={2}>
              هیچ تصویری آپلود نشده
            </Typography>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default Documnets;
