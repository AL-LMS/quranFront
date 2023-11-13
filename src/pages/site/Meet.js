// import React, { useState } from "react";
// import { getUrl } from "../../helper/getUrl";
// import axios from "axios";
// import defaultPic from "../../assets/img/class1.jpeg";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import Documnets from "../dashboard/teacher/Documnets";
// import { Button } from "@mui/material";

// const Meet = () => {
//   const [image, setImage] = useState("");
//   const [showLastCertificate, setShowLastCertificate] = useState(defaultPic);
//   const edit_user = async () => {
//     let data = {
//       table: "teachers",
//       method_type: "edit_user",
//       data: {
//         picture: formik.values.picture,
//       },
//     };
//     let response = await axios({
//       method: "POST",
//       headers: {
//         // "content-type": "application/json",
//         "content-type": "multipart/form-data",
//         "Access-Control-Allow-Origin": "*",
//       },
//       data: {
//         ...data,
//       },

//       baseURL: getUrl() + "uploadfile/",
//     });
//     if (response?.data?.tracking_code !== null) {
//       console.log(response);
//       setImage(response.data);
//     } else {
//     }
//   };
//   const initialValues = {
//     picture: defaultPic,
//   };
//   const RegistrationSchema = Yup.object().shape({});
//   const formik = useFormik({
//     initialValues,
//     validationSchema: RegistrationSchema,
//     onSubmit: (values, { setStatus, setSubmitting }) => {
//       edit_user().then(() => {});
//     },
//   });
//   console.log("data", image);
//   return (
//     <>
//       {/* <button onClick={() => edit_user().then({})}>get file</button> */}
//       <img src={`http://127.0.0.1:5000/downloadfile/catsee.jpg`}></img>
//       <form onSubmit={formik.handleSubmit}>
//         <Documnets
//           formik={formik}
//           showLastCertificate={showLastCertificate}
//           setShowLastCertificate={setShowLastCertificate}
//           nameOfSection={"پوستر دوره"}
//           nameOfButtonField={"تغییر پوستر دوره"}
//         />
//         <Button
//           variant="contained"
//           type="submit"
//           fullWidth
//           sx={{ boxShadow: "none", padding: "12px 0" }}
//         >
//           ثبت اطلاعات
//         </Button>
//       </form>
//     </>
//   );
// };

// export default Meet;


import React, { useState } from 'react';
import axios from 'axios';

const Meet = () => {
  const [file, setFile] = useState(null);
  const [textField, setTextField] = useState('');
  const [anotherTextField, setAnotherTextField] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('text_field', textField);
    formData.append('another_text', anotherTextField);

    try {
      await axios.post('http://localhost:5000/uploadfile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>File:</label>
        <input type="file" onChange={handleFileChange} />
      </div>
      <div>
        <label>Text Field:</label>
        <input
          type="text"
          value={textField}
          onChange={(e) => setTextField(e.target.value)}
        />
      </div>
      <div>
        <label>Another Text Field:</label>
        <input
          type="text"
          value={anotherTextField}
          onChange={(e) => setAnotherTextField(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default Meet;
