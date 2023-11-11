import { Box } from "@mui/material";
import React, { useRef } from "react";
import "./style.css";
import AvatarSVG from "../../assets/img/profile.jpg";
import styled from "styled-components";
export default function Index({ formik }) {
  let myRef = useRef();
  const openFile = (file) => {
    const input = file.target;
    const reader = new FileReader();
    if (file.target.value !== "") {
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
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
  const handelclik = (type) => {
    myRef.current.click();
  };
  return (
    <Box>
      {formik.values.picture === null ? (
        <Container
          class="container"
          onClick={(event) => handelclik(event.currentTarget.value)}
        >
          <img
            src={AvatarSVG}
            style={{
              borderRadius: "100%",
              width: "75px",
              height: "75px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "10px",
              display: "block",
              objectFit: "cover",
            }}
          />
          <span style={{ textAlign: "center" }}>تصویر مربی</span>
          <div class="overlay">
            <div class="text">افزودن تصویر</div>
          </div>
        </Container>
      ) : (
        <Container
          class="container"
          onClick={(event) => handelclik(event.currentTarget.value)}
        >
          <img
            src={formik.values.picture}
            style={{
              borderRadius: "50%",
              width: "75px",
              height: "75px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "10px",
              display: "block",
            }}
          />
          <div class="overlay">
            <div class="text">تغییر تصویر</div>
          </div>
        </Container>
      )}
      <input
        type="file"
        style={{ display: "none" }}
        ref={myRef}
        onChange={(event) => openFile(event)}
      />
    </Box>
  );
}

export const Container = styled.div`
  margin-left: 50px;
  @media screen and (max-width: 768px) {
    margin-left: 0px;
    margin-bottom: 20px;
  }
  @media screen and (max-width: 480px) {
    margin-left: 0px;
    margin-bottom: 20px;
  }
`;
