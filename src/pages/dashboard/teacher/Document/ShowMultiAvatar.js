import React from "react";
import { Avatar } from "@mui/material";
import remove from "../../../../assets/img/remove.png";
const ShowMultiAvatar = ({ formik, showDocuments }) => {
  console.log("showDocuments", showDocuments);
  const handleRemove = (id) => {
    console.log("id", id);
    // let cert = formik.values.documents;
    // var lists = cert.filter((x) => {
    //   return x.id != id;
    // });
    // formik.setFieldValue("documents", lists);
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
      {showDocuments?.map((doc, index) => (
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
            style={{ width: "20px", height: "20px", marginRight: "100px" }}
          />
          <Avatar
            alt="LastCertificate"
            src={
              doc.substring(0, 5) === "blob:"
                ? doc
                : `http://daarolquran.com/back_request/get_uploaded_teacher_certificate/${doc}`
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
      ))}
    </div>
  );
};

export default ShowMultiAvatar;
