import React, { useRef, useState } from "react";
import { Avatar, Button, Card, Grid, Typography } from "@mui/material";

const MultiDocumnets = ({
  form,
  setForm,
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

      form.certificates.push(data.file);
      setForm({ ...form });
      // setshowCertificate(URL.createObjectURL(input.files[0]));
    };

    reader.readAsDataURL(input.files[0]);
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
            onChange={(event) => openFile(event)}
          />
          <label htmlFor="Certificate">
            <Button variant="outlined" fullWidth component="span">
              {nameOfButtonField}
            </Button>
          </label>
          {form?.certificates.length > 0 ? (
            <Avatar
              alt="Certificate"
              src={form.certificates.slice(-1)}
              sx={{
                width: 140,
                height: 140,
                display: "block",
                margin: "10px auto",
                borderRadius: 2,
              }}
            />
          ) : form?.certificates.lenght > 0 ? (
            <Avatar
              alt="Certificate"
              src={form.certificates.slice(-1)}
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
