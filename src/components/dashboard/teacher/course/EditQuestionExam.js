import React, { useContext, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useParams } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { toastify } from "../../../../helper/toast";
import axios from "axios";
import { DefiContext } from "../../../../context/DefiContext";

const EditQuestionExam = ({ data }) => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setReload } = useContext(DefiContext);

  const [quizQuestion, setQuizQuestion] = useState({
    question: data.question,
    result: data.result,
    header_id: id,
    id: data.id,
    has_negative: data.has_negative,
    showImage: "",
  });
  const imageHandler = (e) => {
    setQuizQuestion({
      ...quizQuestion,
      question: e.target.files[0],
      showImage: URL.createObjectURL(e.target.files[0]),
    });
  };

  const changeQuestionHandler = (e) => {
    setQuizQuestion({ ...quizQuestion, [e.target.name]: e.target.value });
  };

  const editHandler = async () => {
    const formData = new FormData();
    quizQuestion.showImage &&
      formData.append("question", quizQuestion.question);
    formData.append("result", quizQuestion.result);
    formData.append("has_negative", quizQuestion.has_negative);
    formData.append("id", data.id);
    formData.append("header_id", id);
    if (quizQuestion.question && quizQuestion.result) {
      setLoading(true);
      try {
        const response = await axios.put("quiz/quizQuestion/", formData, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });
        toastify("success", "اطلاعات با موفقیت ثبت شد");
        setOpen(false);
        setLoading(false);
        setReload((prevState) => !prevState);
      } catch (err) {
        toastify("error", "خطا در برقراری ارتباط با سرور");
        setLoading(false);
      }
    } else {
      setLoading(false);
      toastify("warning", "لطفا تمامی فیلد هارا پرکنید");
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        <EditOutlinedIcon />
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>ویرایش سوال</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={imageHandler}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="outlined"
                  fullWidth
                  component="span"
                  sx={{ marginBottom: 3, height: "56px" }}
                >
                  آپلود تصویر سوال
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="پاسخ صحیح"
                value={quizQuestion.result}
                onChange={(e) =>
                  setQuizQuestion({
                    ...quizQuestion,
                    result: e.target.value > 4 ? 4 : e.target.value,
                  })
                }
                name="result"
                fullWidth
                type="number"
                InputProps={{ inputProps: { min: 1, max: 4 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={quizQuestion.has_negative}
                    defaultChecked={quizQuestion.has_negative}
                    onChange={(e) =>
                      setQuizQuestion({
                        ...quizQuestion,
                        has_negative: e.target.checked,
                      })
                    }
                  />
                }
                label="نمره منفی دارد"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={editHandler}
                fullWidth
                sx={{ boxShadow: "none", height: "56px", borderRadius: "5px" }}
                disabled={loading}
                variant="contained"
              >
                ویرایش
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditQuestionExam;
