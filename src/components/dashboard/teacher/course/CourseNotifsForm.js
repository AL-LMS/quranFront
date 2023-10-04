import React, { useState } from "react";
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
import MUIRichTextEditor from "mui-rte";

const TeacherNotifsForm = ({ type, data, setReload }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: data ? data.title : "",
    description: data ? data.description : "",
    active: data ? data.active : false,
  });
  const add_notifs = async () => {
    setLoading(true);
    if (form.title) {
      let config = {
        url: "insert_request",
      };
      let data = {
        table: "courses",
        method_type: "add_notifs",
        data: {
          title: form.title,
          description: form.description,
          active: form.active,
          teacher_id: user?.user_id,
          sender_name: user?.first_name + " " + user?.last_name,
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

        // baseURL: "http://daarolquran.com/back_request/insert_request/",
        baseURL: "http://127.0.0.1:5000/back_request/insert_request/",
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
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="توضیحات"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              fullWidth
            />
            {/* <MUIRichTextEditor label="Start typing..."   /> */}
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
                onClick={() => add_notifs().then(() => {})}
                fullWidth
                disabled={loading}
              >
                ثبت اطلاعیه
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ boxShadow: "none", borderRadius: 3, padding: "12px 0" }}
                onClick={() => add_notifs().then(() => {})}
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
