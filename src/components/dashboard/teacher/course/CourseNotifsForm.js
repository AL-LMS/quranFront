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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DefiContext } from "../../../../context/DefiContext";

const TeacherNotifsForm = ({ type, data }) => {
  const { id } = useParams();
  const { auth, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    Title: data ? data.title : "",
    Description: data ? data.description : "",
    active: data ? data.active : false,
    teacher_id: user?.user_id,
    sender_name: user?.first_name + " " + user?.last_name,
  });
  const { setReload } = useContext(DefiContext);
  const createHandler = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.Title);
    formData.append("description", form.Description);
    formData.append("active", form.active);
    formData.append("course_id", id);
    if (form.Title) {
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
    formData.append("active", form.active);
    formData.append("course_id", id);
    formData.append("id", data.id);
    if (form.Title) {
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
          ایجاد اطلاعیه
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
          {type === "create" ? "ایجاد اطلاعیه" : "ویرایش اطلاعیه"}
        </DialogTitle>
        <Grid container spacing={3} padding={2}>
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
                ثبت اطلاعیه
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

export default TeacherNotifsForm;
