import React from "react";
import { Avatar, Typography } from "@mui/material";
import pdfImage from "../../../../assets/img/pdf.png";
const ShowAvatar = ({ formik, showLastCertificate, fileType }) => {
  return (
    <>
      {formik?.values?.certificate ? (
        ["jpg", "png", "jpeg"].includes(fileType) ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              alt="LastCertificate"
              src={showLastCertificate}
              sx={{
                width: 75,
                height: 75,
                display: "block",
                margin: "10px auto",
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: "12px", textAlign: "center" }}>
              {formik?.values?.certificate?.name}
            </span>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              alt="LastCertificate"
              src={pdfImage}
              sx={{
                width: 75,
                height: 75,
                display: "block",
                margin: "10px auto",
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: "12px", textAlign: "center" }}>
              {formik?.values?.certificate?.name}
            </span>
          </div>
        )
      ) : (
        <Typography color="text.secondary" textAlign="center" mt={2}>
          هیچ مدرکی آپلود نشده
          {formik.touched.certificate && formik.errors.certificate ? (
            <div>
              <p style={{ fontSize: 10, color: "red" }}>
                {formik.errors.certificate}
              </p>
            </div>
          ) : null}
        </Typography>
      )}
    </>
  );
};

export default ShowAvatar;
