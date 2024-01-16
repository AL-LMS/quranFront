import React, { useEffect } from "react";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import ShowAvatar from "./ShowAvatar";

const TDocumnets = ({
  formik,
  showLastCertificate,
  setShowLastCertificate,
  nameOfSection,
  nameOfButtonField,
}) => {
  const [fileType, setFileType] = React.useState("");
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
      setFileType(data.file_type);
      formik.setFieldValue("certificate", file.target.files[0]);
      setShowLastCertificate(URL.createObjectURL(input.files[0]));
    };

    reader.readAsDataURL(input.files[0]);
  };
  useEffect(() => {
    console.log("formik.values", formik.values);
  }, [formik]);
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
          id="LastCertificate"
          onChange={(event) => openFile(event)}
        />
        <label htmlFor="LastCertificate">
          <Button variant="outlined" fullWidth component="span">
            {nameOfButtonField}
          </Button>
        </label>
        <ShowAvatar
          formik={formik}
          showLastCertificate={showLastCertificate}
          fileType={fileType}
        />
      </Grid>
    </Grid>
  );
};

export default TDocumnets;
