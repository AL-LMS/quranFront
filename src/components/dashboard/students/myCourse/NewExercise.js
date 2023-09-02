import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
  Grid,
} from "@mui/material";
import { DefiContext } from "../../../../context/DefiContext";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import useAuth from "../../../../hooks/useAuth";
import toastify from "../../../../helper/toast";

const NewExercise = ({ type, hid, id }) => {
  const [open, setOpen] = useState(false);
  const [showFile, setShowFile] = useState("");
  const { auth, user } = useAuth();
  const { setReload } = useContext(DefiContext);
  const [file, setFile] = useState("");
  const fileHandler = (e) => {
    setFile(e.target.files[0]);
    setShowFile(URL.createObjectURL(e.target.files[0]));
  };

  const createHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseHWID", hid);
    formData.append("studentID", user.pk);
    if (file) {
      try {
        const response = await axios.post("course/coursehwAns/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth}`,
          },
        });
        toastify("success", "اطلاعات با موفقیت ثبت شد");
        setReload((prevState) => !prevState);
        setOpen(false);
      } catch (err) {
        toastify("error", "خطا در برقراری ارتباط با سرور");
      }
    } else {
      toastify("warning", "شما فایلی وارد نکرده اید");
    }
  };
  const editHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseHWID", hid);
    formData.append("id", id);
    formData.append("studentID", user.pk);
    if (showFile) {
      try {
        const response = await axios.put("course/coursehwAns/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth}`,
          },
        });
        toastify("success", "اطلاعات با موفقیت ثبت شد");
        setReload((prevState) => !prevState);
        setOpen(false);
      } catch (err) {
        toastify("error", "خطا در برقراری ارتباط با سرور");
      }
    } else {
      toastify("warning", "شما فایلی وارد نکرده اید");
    }
  };

  return (
    <div>
      {type === "create" ? (
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{ boxShadow: "none" }}
        >
          ارسال تکلیف
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
        <DialogTitle>
          {type === "create" ? "ارسال تکلیف" : "ویرایش تکلیف"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={type === "create" ? createHandler : editHandler}>
            <Grid container mt={3} spacing={3}>
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
                <Button
                  variant="contained"
                  sx={{ boxShadow: "none" }}
                  fullWidth
                  type="submit"
                >
                  {type === "create" ? "ثبت اطلاعات" : "ویرایش اطلاعات"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewExercise;
