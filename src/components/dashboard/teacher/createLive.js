import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { toastify } from "../../../helper/toast";
import { DefiContext } from "../../../context/DefiContext";

const CreateLive = () => {
  const { auth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [courseID, setCourseID] = useState([]);
  const [open, setOpen] = useState(false);
  const { setReload } = useContext(DefiContext);
  const [form, setForm] = useState({
    course: "",
  });
  useEffect(() => {
    const fetchCoursID = async () => {
      const response = await axios.get(`course/teacherCourse/?id=${user.pk}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      const data = await response.data;
      setCourseID(data);
    };
    fetchCoursID();
  }, []);

  const submitHandler = async () => {
    if (form.course) {
      try {
        const response = await axios.post(
          "live/create/",
          {
            id: form.course.id,
            name: form.course.name,
          },
          {
            headers: { Authorization: `Bearer ${auth}` },
          }
        );
        toastify("success");
        setLoading(false);
        setOpen(false);
        setReload((prevState) => !prevState);
      } catch (err) {
        console.log(err);
        toastify("error");
        setLoading(false);
      }
    } else {
      toastify("warning");
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        ایجاد کلاس جدید
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          ایجاد کلاس آنلاین
        </DialogTitle>
        <Grid container spacing={3} padding={2}>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              value={form.course}
              onChange={(event, newValue) => {
                setForm({ ...form, course: newValue });
              }}
              id="controllable-states-demo"
              options={courseID}
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="دوره مورد نظر" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={submitHandler}
              fullWidth
              disabled={loading}
              sx={{ boxShadow: "none", padding: "12px 0" }}
            >
              ثبت اطلاعات
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};

export default CreateLive;
