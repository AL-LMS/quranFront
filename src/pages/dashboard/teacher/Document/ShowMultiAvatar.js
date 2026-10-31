import { legacyAssetUrl } from "../../../../api/localAssets.js";
import React from "react";
import { Avatar } from "@mui/material";
import remove from "../../../../assets/img/remove.png";
const ShowMultiAvatar = ({ formik, showDocuments, setShowDocuments }) => {
  const handleRemove = (id) => {
    let cert = formik.values.documents;
    cert.splice(id, 1);
    // showDocuments.splice(id, 1);
    formik.setFieldValue("documents", cert);
    console.log(formik.values);
    // setShowDocuments(showDocuments);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {formik?.values?.documents?.map((doc, index) =>
        doc instanceof Object ? (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "150px",
              height: "150px",
              marginRight: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <img
              onClick={() => handleRemove(index)}
              src={remove}
              style={{
                width: "20px",
                height: "20px",
                marginRight: "100px",
                cursor: "pointer",
              }}
            />
            <Avatar
              alt="LastCertificate"
              src={
                doc.file_show.substring(0, 5) === "blob:" ? doc.file_show : null
              }
              sx={{
                width: 75,
                height: 75,
                display: "block",
                margin: "10px auto",
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: "12px", textAlign: "center" }}>
              {doc.file_name}
            </span>
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
              marginRight: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <img
              onClick={() => handleRemove(index)}
              src={remove}
              style={{
                width: "20px",
                height: "20px",
                marginRight: "100px",
                cursor: "pointer",
              }}
            />
            <Avatar
              alt="LastCertificate"
              src={
                doc.substring(0, 5) === "blob:"
                  ? doc
                  : legacyAssetUrl(`/back_request/get_uploaded_teacher_certificate/${doc}`)
              }
              sx={{
                width: 75,
                height: 75,
                display: "block",
                margin: "10px auto",
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: "12px", textAlign: "center" }}>
              {"doc.file_name"}
            </span>
          </div>
        )
      )}
    </div>
  );
};

export default ShowMultiAvatar;
