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
import { getUrl } from "../../../../helper/getUrl";

const TeacherResourceForm = ({ type, data, setReload }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    file: data ? data.fileCourse : "",
    title: data ? data.title : "",
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
      form.type = data.file_type;
      form.file = data.file;
    };

    reader.readAsDataURL(input.files[0]);
  };
  const add_resource = async () => {
    setLoading(true);
    if (form.file && form.title) {
      let data = {
        table: "courses",
        method_type: "add_resource",
        data: {
          file: form?.file,
          title: form?.title,
          type: form?.type,
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
                آپلود فایل منبع
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
                onClick={() => add_resource().then(() => {})}
                fullWidth
                disabled={loading}
              >
                ثبت منبع
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  boxShadow: "none",
                  borderRadius: "5px",
                  padding: "12px 0",
                }}
                onClick={() => add_resource().then(() => {})}
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
