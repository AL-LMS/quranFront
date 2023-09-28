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
import "./style.css";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
const CourseHomeworkAnswerForm = ({ type, answer_id }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    score: "",
  });
  const set_score_homework = async () => {
    setLoading(true);
    if (form.score) {
      let config = {
        url: "update_request",
      };
      let data = {
        table: "courses",
        method_type: "set_score_homework",
        data: {
          answer_id: answer_id,
          score: form.score,
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
        <Tooltip title="ثبت نمره">
          <Button onClick={() => setOpen(true)}>
            <CreditScoreIcon />
          </Button>
        </Tooltip>
      ) : (
        <></>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {type === "create" ? "ثبت نمره" : "ویرایش تکلیف"}
        </DialogTitle>
        <Grid container spacing={3} padding={2}>
          <Grid item xs={12}>
            <TextField
              label="نمره"
              value={form.score}
              type="number"
              onChange={(e) => setForm({ ...form, score: e.target.value })}
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
                onClick={() => set_score_homework().then(() => {})}
                fullWidth
                disabled={loading}
              >
                ثبت نمره
              </Button>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};

export default CourseHomeworkAnswerForm;
