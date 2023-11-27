import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import {
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  Tooltip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toastify } from "../../../../helper/toast";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import "./style.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { getUrl } from "../../../../helper/getUrl";
import { useFormik } from "formik";
import * as Yup from "yup";
const UploadExercisesForm = ({
  type,
  data,
  homeworkId,
  answer_id,
  teacher_id,
  setReload,
}) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const initialValues = {
    file: data ? data.fileCourse : "",
    type: data ? data.type : "",
    teacher_id: teacher_id ? teacher_id : "",
    answer_id: answer_id ? answer_id : null,
  };
  const RegistrationSchema = Yup.object().shape({
    file: Yup.mixed().required("افزودن فایل ضروری است."),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      if (formik.values.answer_id) {
        edit_upload_homework().then(() => {});
      } else {
        upload_homework().then(() => {});
      }
    },
  });
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
      formik.setFieldValue("type", data.file_type);
    };
    formik.setFieldValue("file", file.target.files[0]);
    reader.readAsDataURL(input.files[0]);
  };
  const upload_homework = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("user_id", user?.user_id);
    formData.append("file", formik.values.file);
    formData.append("type", formik.values.type);
    formData.append("course_id", id);
    formData.append("homework_id", homeworkId);
    formData.append("answer_id", formik.values.answer_id);
    formData.append("teacher_id", formik.values.teacher_id);
    if (formik.values.file instanceof File) {
      let response = await axios.post(
        getUrl() + "back_request/upload_homework/",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response?.data?.tracking_code !== null) {
        toastify("success", response?.data?.response);
        setLoading(false);
        setOpen(false);
        setReload((perv) => !perv);
      } else {
        toastify("error-login", response?.data?.error);
        setLoading(false);
        setOpen(false);
      }
    } else {
      setLoading(false);
      toastify("warning", "لطفا فیلدهارا با دقت پر کنید");
    }
  };

  const edit_upload_homework = async () => {
    setLoading(true);
    if (!formik.values.answer_id) {
      setLoading(false);
      toastify("warning", "مشکلی پیش آمده لطفا صفحه خود را رفرش کنید");
    } else {
      const formData = new FormData();
      formData.append("user_id", user?.user_id);
      formData.append("file", formik.values.file);
      formData.append("type", formik.values.type);
      formData.append("course_id", id);
      formData.append("homework_id", homeworkId);
      formData.append("answer_id", formik.values.answer_id);
      formData.append("teacher_id", formik.values.teacher_id);
      if (formik.values.file instanceof File) {
        let response = await axios.post(
          getUrl() + "back_request/upload_homework/",
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        if (response?.data?.tracking_code !== null) {
          toastify("success", response?.data?.response);
          setLoading(false);
          setOpen(false);
          setReload((perv) => !perv);
        } else {
          toastify("error-login", response?.data?.error);
          setLoading(false);
          setOpen(false);
        }
      }
    }
  };

  return (
    <div>
      {type === "create" ? (
        <Tooltip title="ثبت">
          <Button onClick={() => setOpen(true)}>
            <FileUploadIcon />
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title="ویرایش">
          <Button onClick={() => setOpen(true)}>
            <EditOutlinedIcon />
          </Button>
        </Tooltip>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {type === "create" ? "ارسال تکلیف" : "ویرایش تکلیف"}
        </DialogTitle>
        {/* <Grid container spacing={3} padding={2}> */}
        <form onSubmit={formik.handleSubmit} style={{ padding: "20px" }}>
          <Grid item xs={12} mb={"10px"}>
            <input
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={(event) => openFile(event)}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="outlined"
                fullWidth
                sx={{ height: "56px" }}
                component="span"
              >
                ارسال تکلیف
              </Button>
            </label>
            {formik.touched.file && formik.errors.file ? (
              <div>
                <p style={{ fontSize: 10, color: "red" }}>
                  {formik.errors.file}
                </p>
              </div>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            {type === "create" ? (
              <Button
                variant="contained"
                sx={{
                  boxShadow: "none",
                  borderRadius: "5px",
                  padding: "12px 0",
                }}
                // onClick={() => upload_homework().then(() => {})}
                type="submit"
                fullWidth
                disabled={loading}
              >
                ارسال تکلیف
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  boxShadow: "none",
                  borderRadius: "5px",
                  padding: "12px 0",
                }}
                // onClick={() => edit_upload_homework().then(() => {})}
                type="submit"
                fullWidth
                disabled={loading}
              >
                ارسال تکلیف
              </Button>
            )}
          </Grid>
        </form>
        {/* </Grid> */}
      </Dialog>
    </div>
  );
};

export default UploadExercisesForm;
