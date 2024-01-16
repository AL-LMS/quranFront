import React from "react";
import { Avatar, Typography } from "@mui/material";
import pdfImage from "../../../../assets/img/pdf.png";
import remove from "../../../../assets/img/remove.png";
const ShowAvatar = ({ formik, showLastCertificate, fileType }) => {
  const handleRemove = () => {
    formik.setFieldValue("certificate", "");
  };
  return (
    <>
      {formik?.values?.certificate ? (
        ["jpg", "png", "jpeg"].includes(fileType) ? (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "150px",
              height: "150px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <img
              onClick={() => handleRemove()}
              src={remove}
              style={{ width: "20px", height: "20px", marginRight: "100px" }}
            />
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
              {formik?.values?.certificate?.name.substring(0, 17) + "..."}
            </span>
          </div>
        ) : fileType === "" ? (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "150px",
              height: "150px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <img
              onClick={() => handleRemove()}
              src={remove}
              style={{ width: "20px", height: "20px", marginRight: "100px" }}
            />
            <Avatar
              alt="LastCertificate"
              src={`http://daarolquran.com/back_request/get_uploaded_teacher_certificate/${formik?.values?.certificate}`}
              sx={{
                width: 75,
                height: 75,
                display: "block",
                margin: "10px auto",
                borderRadius: 2,
              }}
            />
            {/* <span style={{ fontSize: "12px", textAlign: "center" }}>
              String(formik?.values?.certificate?).substring(0, 17)
            </span> */}
          </div>
        ) : (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "150px",
              height: "150px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <img
              onClick={() => handleRemove()}
              src={remove}
              style={{ width: "20px", height: "20px", marginRight: "100px" }}
            />
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
              {formik?.values?.certificate?.name.substring(0, 17) + "..."}
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
