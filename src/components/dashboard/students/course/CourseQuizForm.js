import React, { useRef, useState } from "react";
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
const UploadQuizzesForm = ({ type, data, quizId, answer_id }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    file: data ? data.fileCourse : "",
    type: data ? data.type : "",
    answer_id: answer_id ? answer_id : "",
  });
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
      form.type = data.file_type;
      form.file = data.file;
    };

    reader.readAsDataURL(input.files[0]);
  };
  const upload_quiz = async () => {
    setLoading(true);
    if (form.file) {
      let config = {
        url: "insert_request",
      };
      let data = {
        table: "courses",
        method_type: "upload_quiz",
        data: {
          user_id: user?.user_id,
          file: form?.file,
          type: form?.type,
          course_id: id,
          quiz_id: quizId,
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

        baseURL: "http://127.0.0.1:5000/insert_request/",
      });
      if (response?.data?.tracking_code !== null) {
        toastify("success", response?.data?.response);
        setLoading(false);
        setOpen(false);
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

  const edit_upload_quiz = async () => {
    setLoading(true);
    if (form.answer_id) {
      setLoading(false);
      toastify("warning", "مشکلی پیش آمده لطفا صفحه خود را رفرش کنید");
    }
    if (form.file) {
      let config = {
        url: "update_request",
      };
      let data = {
        table: "courses",
        method_type: "edit_upload_quiz",
        data: {
          user_id: user?.user_id,
          file: form?.file,
          type: form?.type,
          quiz_id: quizId,
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

        baseURL: "http://127.0.0.1:5000/update_request/",
      });
      if (response?.data?.tracking_code !== null) {
        toastify("success", response?.data?.response);
        setLoading(false);
        setOpen(false);
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
          {type === "create" ? "ارسال پاسخ آزمون" : "ویرایش پاسخ آزمون"}
        </DialogTitle>
        <Grid container spacing={3} padding={2}>
          <Grid item xs={12}>
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
                فایل پاسخ
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            {type === "create" ? (
              <Button
                variant="contained"
                sx={{ boxShadow: "none", borderRadius: 3, padding: "12px 0" }}
                onClick={() => upload_quiz().then(() => {})}
                fullWidth
                disabled={loading}
              >
                ارسال پاسخ
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ boxShadow: "none", borderRadius: 3, padding: "12px 0" }}
                onClick={() => edit_upload_quiz().then(() => {})}
                fullWidth
                disabled={loading}
              >
                ارسال پاسخ
              </Button>
            )}
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};

export default UploadQuizzesForm;
