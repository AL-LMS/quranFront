import React, { useContext, useState } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import {
  Button,
  Chip,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Tooltip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toastify } from "../../../../helper/toast";
import { miladi_be_shamsi } from "../../../../helper/shamsi";
import { DatePicker } from "zaman";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DefiContext } from "../../../../context/DefiContext";

const TeacherExercisesForm = ({ type, data }) => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    File: data ? data.fileCourse : "",
    Title: data ? data.title : "",
    Time: data ? data.endDateTime : null,
    Description: data ? data.description : "",
    active: data ? data.active : false,
  });
  const [showFile, setShowFile] = useState("");
  const { setReload } = useContext(DefiContext);

  const fileHandler = (e) => {
    setForm({ ...form, File: e.target.files[0] });
    setShowFile(URL.createObjectURL(e.target.files[0]));
  };
  const createHandler = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.Title);
    formData.append("description", form.Description);
    formData.append("fileCourse", form.File);
    formData.append("endDateTime", form.Time);
    formData.append("active", form.active);
    formData.append("courseID", id);
    if (form.File && form.Title && form.Time) {
      try {
        const response = await axios.post(`course/courseHomeWork/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth}`,
          },
        });

        toastify("success", "اطلاعات با موفقیت ارسال شد");
        setLoading(false);
        setOpen(false);
        setReload((prevState) => !prevState);
      } catch (err) {
        setLoading(false);
        toastify("error", "خطا دربرقراری ارتباط با سرور");
      }
    } else {
      setLoading(false);
      toastify("warning", "لطفا فیلدهارا با دقت پر کنید");
    }
  };

  const editHandler = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.Title);
    form.Description && formData.append("description", form.Description);
    showFile && formData.append("fileCourse", form.File);
    formData.append("endDateTime", form.Time);
    formData.append("active", form.active);
    formData.append("courseID", id);
    formData.append("id", data.id);
    if (form.File && form.Title && form.Time) {
      try {
        const response = await axios.put(`course/courseHomeWork/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth}`,
          },
        });

        toastify("success", "اطلاعات با موفقیت ارسال شد");
        setLoading(false);
        setOpen(false);
        setReload((prevState) => !prevState);
      } catch (err) {
        setLoading(false);
        toastify("error", "خطا دربرقراری ارتباط با سرور");
      }
    } else {
      setLoading(false);
      toastify("warning", "لطفا فیلدهارا با دقت پر کنید");
    }
  };

  function changeDate({ value }) {
    setForm({ ...form, Time: value._i.slice(0, 10) });
  }

  return (
    <div>
      {type === "create" ? (
        <Button
          variant="contained"
          sx={{ boxShadow: "none", borderRadius: 3 }}
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
        <Grid container spacing={3} padding={2}>
          <Grid item xs={12}>
            <input
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={fileHandler}
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="عنوان"
              value={form.Title}
              onChange={(e) => setForm({ ...form, Title: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sx={{ position: "relative" }}>
            <DatePicker
              onClickSubmitButton={changeDate}
              timePicker={false}
              label="مهلت انجام"
            />
            {form.Time && (
              <span
                className="date-value"
                style={{
                  color: "#666",
                  position: "absolute",
                  top: "40px",
                  left: "10px",
                }}
              >
                {miladi_be_shamsi(form.Time)}
              </span>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="توضیحات"
              value={form.Description}
              onChange={(e) =>
                setForm({ ...form, Description: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Chip
              color={form.active ? "error" : "success"}
              sx={{ color: "#fff", padding: "8px 20px" }}
              label={form.active ? "غیرفعال کردن" : "فعال کردن"}
              onClick={() => setForm({ ...form, active: !form.active })}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            {type === "create" ? (
              <Button
                variant="contained"
                sx={{ boxShadow: "none", borderRadius: 3, padding: "12px 0" }}
                onClick={createHandler}
                fullWidth
                disabled={loading}
              >
                ثبت تکلیف
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ boxShadow: "none", borderRadius: 3, padding: "12px 0" }}
                onClick={editHandler}
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

export default TeacherExercisesForm;
