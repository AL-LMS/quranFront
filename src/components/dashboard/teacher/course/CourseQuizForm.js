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
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toastify } from "../../../../helper/toast";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DatePicker } from "zaman";
import { TimePicker } from "react-ios-time-picker";
import "./style.css";
import { convertToPersianDate } from "../../../../pages/dashboard/converter/dateConverter";
import { getUrl } from "../../../../helper/getUrl";
const CourseQuizForm = ({ type, data, setReload }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startValue, setStartValue] = useState(null);
  const [endValue, setEndValue] = useState(null);

  const onChangeStartTime = (timeValue) => {
    setForm({ ...form, start_time: timeValue });
    setStartValue(timeValue);
  };

  const onChangeEndTime = (timeValue) => {
    setForm({ ...form, end_time: timeValue });
    setEndValue(timeValue);
  };
  const [form, setForm] = useState({
    file: data ? data.fileCourse : "",
    title: data ? data.title : "",
    start_time: data ? data.endDateTime : null,
    end_time: data ? data.endDateTime : null,
    day: data ? data.day : "",
    explain: "",
    type: data ? data.type : "",
  });
  const handleDatePicker = (e) => {
    let day = "";
    day = convertToPersianDate(e.value);
    setForm({ ...form, day: day });
  };
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
  const add_quiz = async () => {
    setLoading(true);
    if (form.title && form.day && form.start_time && form.end_time) {
      let data = {
        table: "courses",
        method_type: "add_quiz",
        data: {
          file: form?.file,
          title: form?.title,
          start_time: form?.start_time,
          end_time: form?.end_time,
          day: form?.day,
          explain: form?.explain,
          type: form?.type,
          teacher_id: user?.user_id,
          course_id: id,
          type: "تستی",
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
          ایجاد آزمون
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
          {type === "create" ? "ایجاد آزمون" : "ویرایش آزمون"}
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
                آپلود فایل آزمون
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="عنوان"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="توضیحات"
              value={form.explain}
              onChange={(e) => setForm({ ...form, explain: e.target.value })}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sx={{ position: "relative" }}>
            <section className="wrapper">
              <div className="libWrapper">
                <DatePicker
                  zindex={1000}
                  round="x1"
                  accentColor="#6374ae"
                  inputAttributes={{
                    placeholder: "روز آزمون",
                  }}
                  onChange={(e) => handleDatePicker(e)}
                />

                <TimePicker
                  style={{ direction: "rtl" }}
                  onChange={onChangeStartTime}
                  value={startValue}
                  placeHolder="زمان شروع آزمون"
                  cancelButtonText="انصراف"
                  saveButtonText="ذخیره "
                />

                <TimePicker
                  onChange={onChangeEndTime}
                  value={endValue}
                  placeHolder="زمان پایان آزمون"
                  cancelButtonText="انصراف"
                  saveButtonText="ذخیره "
                />
              </div>
            </section>
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
                onClick={() => add_quiz().then(() => {})}
                fullWidth
                disabled={loading}
              >
                ثبت آزمون
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  boxShadow: "none",
                  borderRadius: "5px",
                  padding: "12px 0",
                }}
                onClick={() => add_quiz().then(() => {})}
                fullWidth
                disabled={loading}
              >
                ویرایش
              </Button>
            )}
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};

export default CourseQuizForm;
