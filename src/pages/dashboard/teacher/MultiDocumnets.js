import React from "react";
import { Avatar, Button, Grid, Typography } from "@mui/material";

const MultiDocumnets = ({ formik, nameOfSection, nameOfButtonField }) => {
  const openFile = (file) => {
    const input = file.target;
    const reader = new FileReader();

    reader.onload = function () {
      const dataURL = reader.result;
      let image = input.files[0].type;

      let data = {
        file: dataURL,
        file_type: image.split("/")[1],
        file_name: input.files[0].name,
        file_size: input.files[0].size,
      };

      let cert = formik.values.certificates;
      cert.push(data.file);
      formik.setFieldValue("certificates", cert);
    };

    reader.readAsDataURL(input.files[0]);
  };
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
          onChange={(event) => openFile(event)}
        />
        <label htmlFor="Certificate">
          <Button variant="outlined" fullWidth component="span">
            {nameOfButtonField}
          </Button>
        </label>
        {formik?.values?.certificates.length > 0 ? (
          <Avatar
            alt="Certificate"
            src={formik.cvalues?.ertificates.slice(-1)}
            sx={{
              width: 140,
              height: 140,
              display: "block",
              margin: "10px auto",
              borderRadius: 2,
            }}
          />
        ) : formik?.values?.certificates.lenght > 0 ? (
          <Avatar
            alt="Certificate"
            src={formik.cvalues?.ertificates.slice(-1)}
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
  );
};

export default MultiDocumnets;
