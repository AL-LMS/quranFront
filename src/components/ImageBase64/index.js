import React, { useRef } from "react";
import Box from "@material-ui/core/Box";
import AvatarSVG from "../../assets/img/Content.png";
export default function Index({ value, setValues }) {
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

      setValues(data);
    };

    reader.readAsDataURL(input.files[0]);
  };

  const handelclik = (type) => {
    // myRef.current.value = null;

    myRef.current.click();
  };

  return (
    <Box>
      {/* <InputBase
        inputProps={{ "aria-label": "naked" }}
        value={value.file_name ? value.file_name : "مسیر فایل"}
        className={"w-75"}
      />
      <button
        type={"button"}
        value={!value.file ? "انتخاب" : "حذف"}
        className={`btn btn-outline-${!value.file ? "success" : "danger"}`}
        onClick={event => handelclik(event.currentTarget.value)}
      >
        {!value.file ? "انتخاب" : "حذف"}
      </button> */}
      {/* <button onClick={event => handelclik(event.currentTarget.value)}>test</button> */}
      {value == "" ? (
        <img
          src={AvatarSVG}
          style={{
            borderRadius: "100%",
            width: "75px",
            height: "75px",
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
            objectFit: "cover",
          }}
          onClick={(event) => handelclik(event.currentTarget.value)}
        />
      ) : (
        <img
          src={value}
          style={{
            borderRadius: "50%",
            width: "75px",
            height: "75px",
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
          }}
          onClick={(event) => handelclik(event.currentTarget.value)}
        />
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
