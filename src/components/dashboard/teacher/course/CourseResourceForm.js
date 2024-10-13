import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import {
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toastify } from "../../../../helper/toast";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { getUrl } from "../../../../helper/getUrl";
import { useFormik } from "formik";
import * as Yup from "yup";

const TeacherResourceForm = ({ type, data, setReload }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Added state for progress
  const initialValues = {
    file: data ? data.fileCourse : "",
    title: data ? data.title : "",
    type: data ? data.type : "",
  };

  const RegistrationSchema = Yup.object().shape({
    file: Yup.mixed().required("افزودن فایل ضروری است."),
    title: Yup.string().required("عنوان منبع باید ذکر شود."),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      add_resource().then(() => {});
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

  const add_resource = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("teacher_id", user?.user_id);
    formData.append("file", formik.values.file);
    formData.append("type", formik.values.type);
    formData.append("course_id", id);
    formData.append("title", formik.values.title);

    if (formik.values.file instanceof File) {
      try {
        let response = await axios.post(
          getUrl() + "back_request/add_resource/",
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
              "Access-Control-Allow-Origin": "*",
            },
            onUploadProgress: (progressEvent) => {
              const totalLength = progressEvent.lengthComputable
                ? progressEvent.total
                : formik.values.file.size;
              if (totalLength !== null) {
                setProgress(
                  Math.round((progressEvent.loaded * 100) / totalLength)
                ); // Track progress
              }
            },
          }
        );

        if (response?.data?.tracking_code !== null) {
          toastify("success", response?.data?.response);
          setLoading(false);
          setOpen(false);
          setReload((prev) => !prev);
          window.location.reload();
        } else {
          toastify("error-login", response?.data?.error);
          setLoading(false);
          setOpen(false);
        }
      } catch (error) {
        toastify("error", "مشکلی در ارسال فایل به وجود آمد.");
        setLoading(false);
      }
    } else {
      setLoading(false);
      toastify("warning", "لطفا فیلدهارا با دقت پر کنید");
    }
  };

  return (
    <div>
      {type === "create" ? (
        <Button
          variant="contained"
          sx={{ boxShadow: "none", borderRadius: "5px" }}
          onClick={() => setOpen(true)}
        >
          افزودن منبع
        </Button>
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
          {type === "create" ? "افزودن منبع" : "ویرایش منبع"}
        </DialogTitle>

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
                آپلود فایل منبع
              </Button>
            </label>
            {formik.values.file?.name && (
              <span>{formik.values.file?.name}</span>
            )}
            {formik.touched.file && formik.errors.file ? (
              <div>
                <p style={{ fontSize: 10, color: "red" }}>
                  {formik.errors.file}
                </p>
              </div>
            ) : null}
          </Grid>

          <Grid item xs={12} mb={"10px"}>
            <TextField
              label="عنوان"
              value={formik.values.title}
              onChange={(e) => formik.setFieldValue("title", e.target.value)}
              fullWidth
            />

            {formik.touched.title && formik.errors.title ? (
              <div>
                <p style={{ fontSize: 10, color: "red" }}>
                  {formik.errors.title}
                </p>
              </div>
            ) : null}
          </Grid>

          {/* Show Progress Bar */}
          {loading && (
            <Grid item xs={12} mb={"10px"}>
              <LinearProgress variant="determinate" value={progress} />
              <p style={{ textAlign: "center", marginTop: "10px" }}>
                {progress}% در حال آپلود...
              </p>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{
                boxShadow: "none",
                borderRadius: "5px",
                padding: "12px 0",
              }}
              type="submit"
              fullWidth
              disabled={loading}
            >
              {type === "create" ? "ثبت منبع" : "ویرایش"}
            </Button>
          </Grid>
        </form>
      </Dialog>
    </div>
  );
};

export default TeacherResourceForm;
