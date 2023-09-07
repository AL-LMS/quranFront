import React, { useContext, useState } from "react";
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
import { DefiContext } from "../../../../context/DefiContext";

const TeacherResourceForm = ({ type, data }) => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    File: data ? data.fileCourse : "",
    Title: data ? data.title : "",
    Description: data ? data.description : "",
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
    formData.append("courseID", id);
    if (form.File && form.Title) {
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
    formData.append("courseID", id);
    formData.append("id", data.id);
    if (form.File && form.Title) {
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

  return (
    <div>
      {type === "create" ? (
        <Button
          variant="contained"
          sx={{ boxShadow: "none", borderRadius: 3 }}
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
                آپلود فایل منبع
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
                ثبت منبع
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

export default TeacherResourceForm;
