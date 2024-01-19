import React from "react";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import ShowMultiAvatar from "./ShowMultiAvatar";

const TMultiDocumnets = ({
  formik,
  showDocuments,
  setShowDocuments,
  nameOfSection,
  nameOfButtonField,
}) => {
  const openFile = (file) => {
    const files = file.target.files;
    let cert = formik.values.documents;
    for (let i = 0; i < files.length; i++) {
      let item = files[i];
      let image = item.type;
      let data = {
        id: cert ? cert.length + 1 : i + 1,
        file_show: URL.createObjectURL(item),
        file_type: image.split("/")[1],
        file_name: item.name,
        file_size: item.size,
        file: item,
      };
      cert.push(data);
    }
    for (let index = 0; index < cert.length; index++) {
      if (cert[index] instanceof Object) {
        showDocuments.push(cert[index].file_show);
      }
    }
    setShowDocuments(showDocuments);
    formik.setFieldValue("documents", cert);
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
        {showDocuments?.length > 0 ? (
          <ShowMultiAvatar showDocuments={showDocuments} formik={formik} />
        ) : (
          <Typography color="text.secondary" textAlign="center" mt={2}>
            هیچ گواهی آپلود نشده
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default TMultiDocumnets;
