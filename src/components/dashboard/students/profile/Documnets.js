import React from "react";
import { Avatar, Button, Grid, Typography } from "@mui/material";

const Documnets = ({
  formik,
  showBirthCertificate,
  setShowBirthCertificate,
}) => {
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
      setShowBirthCertificate(URL.createObjectURL(input.files[0]));
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
          مدارک قرآن آموز
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} sx={{ margin: "0 auto" }}>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="BirthCertificate"
          multiple
          onChange={(event) => openFile(event)}
        />
        <label htmlFor="BirthCertificate">
          <Button variant="outlined" fullWidth component="span">
            آپلود مدارک قرآنی
          </Button>
        </label>
        {formik?.values?.picture ? (
          <Avatar
            alt="BirthCertificate"
            src={showBirthCertificate}
            sx={{
              width: 140,
              height: 140,
              display: "block",
              margin: "10px auto",
              borderRadius: 2,
            }}
          />
        ) : showBirthCertificate ? (
          <Avatar
            alt="BirthCertificate"
            src={showBirthCertificate}
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
  );
};

export default Documnets;
