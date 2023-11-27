import React, { useRef, useState } from "react";
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
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toastify } from "../../../../helper/toast";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Picker, format } from "@persian-tools/persian-mobile-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { getUrl } from "../../../../helper/getUrl";
import { useFormik } from "formik";
import * as Yup from "yup";
const TeacherExercisesForm = ({ type, data, setReload }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const initialValues = {
    file: data ? data.fileCourse : "",
    title: data ? data.title : "",
    deadline: data ? data.endDateTime : null,
    type: data ? data.type : "",
    description: data ? data.description : "",
  };
  const RegistrationSchema = Yup.object().shape({
    file: Yup.mixed().required("افزودن فایل ضروری است."),
    title: Yup.string().required("عنوان تکلیف باید ذکر شود."),
    deadline: Yup.string().required(" مهلت انجام تکلیف باید ذکر شود."),
    description: Yup.string().required("توضیحات تکلیف باید ذکر شود."),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      add_homework().then(() => {});
    },
  });
  const [openBirthDay, setOpenBirthDay] = useState(false);
  const config = {
    year: {
      caption: {
        text: "سال",
      },
    },
    month: {
      caption: {
        text: "ماه",
      },
    },
    day: {
      caption: {
        text: "روز",
      },
    },
  };
  function handleSubmit(selectedDate, field) {
    const date = format(selectedDate.date, "yyyy-MM-dd");
    formik.setFieldValue(field, date);
  }
  let myRef = useRef();
  const openFile = (file) => {
    const input = file.target;
    const reader = new FileReader();
    reader.onload = function () {
      const dataURL = reader.result;
      let image = input.files[0].type;

      let data = {
        file: file.target.files[0],
        file_type: image.split("/")[1],
        file_name: input.files[0].name,
        file_size: input.files[0].size,
      };
      formik.setFieldValue("type", data.file_type);
    };
    formik.setFieldValue("file", file.target.files[0]);
    reader.readAsDataURL(input.files[0]);
  };
  const add_homework = async () => {
    setLoading(true);
    if (formik.values.file instanceof File) {
      const formData = new FormData();
      formData.append("teacher_id", user?.user_id);
      formData.append("file", formik.values.file);
      formData.append("type", formik.values.type);
      formData.append("course_id", id);
      formData.append("title", formik.values.title);
      formData.append("deadline", formik.values.deadline);
      formData.append("description", formik.values.description);
      let response = await axios.post(
        getUrl() + "back_request/add_homework/",
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
      let data = {
        table: "courses",
        method_type: "add_homework",
        data: {
          file: formik.values.file,
          title: formik.values.title,
          deadline: formik.values.deadline,
          description: formik.values.description,
          type: formik.values.type,
          teacher_id: user?.user_id,
          course_id: id,
        },
      };
      let response = await axios({
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          ...data,
        },

        baseURL: getUrl() + "back_request/insert_request/",
      });
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
  };

  return (
    <div>
      {type === "create" ? (
        <Button
          variant="contained"
          sx={{ boxShadow: "none", borderRadius: "5px" }}
          onClick={() => setOpen(true)}
        >
          ایجاد تکلیف
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
          {type === "create" ? "ایجاد تکلیف" : "ویرایش تکلیف"}
        </DialogTitle>
        {/* <Grid container spacing={3} padding={2}> */}
        <form onSubmit={formik.handleSubmit} style={{ padding: "10px" }}>
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
                آپلود فایل تکلیف
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
          <Grid item xs={12} sx={{ position: "relative" }} mb={"10px"}>
            <TextField
              label="مهلت انجام"
              name="deadline"
              value={formik.values.deadline ? formik.values.deadline : ""}
              fullWidth
              onFocus={() => setOpenBirthDay(true)}
            />
            {formik.touched.deadline && formik.errors.deadline ? (
              <div>
                <p style={{ fontSize: 10, color: "red" }}>
                  {formik.errors.deadline}
                </p>
              </div>
            ) : null}
            <Picker
              config={config}
              isOpen={openBirthDay}
              highlightHolidays
              highlightWeekends
              addDayName
              initialValue={new Date("2021-03-20T20:30:00.000Z")}
              onSubmit={(date) => {
                handleSubmit(date, "deadline");
                setOpenBirthDay(false);
              }}
              onCancel={() => setOpenBirthDay(false)}
              onClose={() => setOpenBirthDay(false)}
              theme="light"
            />
          </Grid>
          <Grid item xs={12} mb={"10px"}>
            <TextField
              label="توضیحات"
              value={formik.values.description}
              onChange={(e) =>
                formik.setFieldValue("description", e.target.value)
              }
              fullWidth
              multiline
              rows={4}
            />
            {formik.touched.description && formik.errors.description ? (
              <div>
                <p style={{ fontSize: 10, color: "red" }}>
                  {formik.errors.description}
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
                type="submit"
                // onClick={() => add_homework().then(() => {})}
                fullWidth
                disabled={loading}
              >
                ثبت تکلیف
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  boxShadow: "none",
                  borderRadius: "5px",
                  padding: "12px 0",
                }}
                type="submit"
                // onClick={() => add_homework().then(() => {})}
                fullWidth
                disabled={loading}
              >
                ویرایش
              </Button>
            )}
          </Grid>
        </form>
        {/* </Grid> */}
      </Dialog>
    </div>
  );
};

export default TeacherExercisesForm;
