import React, { useRef, useState } from "react";
import { Avatar, Button, Card, Grid, Typography } from "@mui/material";

const Documnets = ({
  formik,
  showLastCertificate,
  setShowLastCertificate,
  nameOfSection,
  nameOfButtonField,
}) => {
  let myRef = useRef();
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
      formik.setFieldValue("picture", data.file);
      setShowLastCertificate(URL.createObjectURL(input.files[0]));
    };

    reader.readAsDataURL(input.files[0]);
  };
  return (
    // <Card
    //   sx={{
    //     padding: 2,
    //     boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
    //     borderRadius: 3,
    //   }}
    // >
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
          onChange={(event) => openFile(event)}
        />
        <label htmlFor="LastCertificate">
          <Button variant="outlined" fullWidth component="span">
            {nameOfButtonField}
          </Button>
        </label>
        {formik?.values?.picture ? (
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
            {formik.touched.picture && formik.errors.picture ? (
              <div>
                <p style={{ fontSize: 10, color: "red" }}>
                  {formik.errors.picture}
                </p>
              </div>
            ) : null}
          </Typography>
        )}
      </Grid>
    </Grid>
    // </Card>
  );
};

export default Documnets;
