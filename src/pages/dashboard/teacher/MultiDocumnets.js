import React, { useState } from "react";
import { Avatar, Button, Card, Grid, Typography } from "@mui/material";

const MultiDocumnets = ({
  form,
  setForm,
  showCertificate,
  setshowCertificate,
  nameOfSection,
  nameOfButtonField,
}) => {
  const birthCertificateHandler = (e) => {
    setForm({ ...form, certificates: e.target.files });
    setshowCertificate(URL.createObjectURL(e.target.files));
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
            id="Certificate"
            multiple
            onChange={birthCertificateHandler}
          />
          <label htmlFor="Certificate">
            <Button variant="outlined" fullWidth component="span">
              {nameOfButtonField}
            </Button>
          </label>
          {form.certificates.lenght > 0 ? (
            <Avatar
              alt="Certificate"
              src={
                showCertificate ||
                `https://api.srvschool.ir${form.certificates}`
              }
              sx={{
                width: 140,
                height: 140,
                display: "block",
                margin: "10px auto",
                borderRadius: 2,
              }}
            />
          ) : showCertificate.lenght > 0 ? (
            <Avatar
              alt="Certificate"
              src={showCertificate}
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

export default MultiDocumnets;
