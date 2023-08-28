import { Box } from "@mui/material";
import React, { useRef } from "react";
import "./style.css";
import AvatarSVG from "../../assets/img/Virtual Class.png";
export default function Index({ value, setValues }) {
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
        setValues(data);
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
  const handelclik = (type) => {
    myRef.current.click();
  };
  return (
    <Box>
      {value === "" ? (
        <div
          class="container"
          onClick={(event) => handelclik(event.currentTarget.value)}
        >
          <img
            src={AvatarSVG}
            style={{
              borderRadius: "100%",
              width: "160px",
              height: "160px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "10px",
              display: "block",
              objectFit: "cover",
            }}
          />
          <div class="overlay">
            <div class="text">افزودن تصویر</div>
          </div>
        </div>
      ) : (
        <div
          class="container"
          onClick={(event) => handelclik(event.currentTarget.value)}
        >
          <img
            src={value}
            style={{
              borderRadius: "50%",
              width: "160px",
              height: "160px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "10px",
              display: "block",
            }}
          />
          <div class="overlay">
            <div class="text">تغییر تصویر</div>
          </div>
        </div>
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
