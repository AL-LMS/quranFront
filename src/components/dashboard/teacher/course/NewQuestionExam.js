import React, { useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { toastify } from "../../../../helper/toast";
import { useParams } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { useContext } from "react";
import { DefiContext } from "../../../../context/DefiContext";

const NewQuestionExam = ({ header }) => {
  const { id } = useParams();
  const { auth } = useAuth();
  const { setReload } = useContext(DefiContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState({
    result: "",
    question: "",
    showImage: "",
    has_negative: false,
  });

  const [question, setQuestion] = useState([]);
  const imageHandler = (e) => {
    setQuizQuestion({
      ...quizQuestion,
      question: e.target.files[0],
      showImage: URL.createObjectURL(e.target.files[0]),
    });
  };

  const questionHandler = () => {
    if (
      quizQuestion.result &&
      quizQuestion.question &&
      header.question_count > question.length
    ) {
      setQuestion((prevState) => [...prevState, quizQuestion]);
      setQuizQuestion({
        question: "",
        showImage: "",
        result: "",
      });
      toastify("success");
    } else if (header.question_count === question.length) {
      toastify("error-login", "ظرفیت سوال ها به اتمام رسید");
    }
  };
  const changeQuestionHandler = (e) => {
    setQuizQuestion({ ...quizQuestion, [e.target.name]: e.target.value });
  };
  const removeHandler = (title) => {
    setQuestion(question.filter((item) => item.question !== title));
  };

  const createHandler = async () => {
    if (question.length > 0) {
      const formData = new FormData();
      question.forEach((item, i) => {
        formData.append(`question,${i + 1}`, item.question);
        formData.append(`header_id,${i + 1}`, id);
        formData.append(`result,${i + 1}`, item.result);
        formData.append(`has_negative,${i + 1}`, item.has_negative);
      });
      setLoading(true);
      try {
        const response = await axios.post("quiz/quizQuestion/", formData, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });
        toastify("success", "اطلاعات با موفقیت ثبت شد");
        setReload((prevState) => !prevState);
        setLoading(false);
        setOpen(false);
      } catch (err) {
        toastify("error", "خطا در برقراری ارتباط با سرور");
        setLoading(false);
      }
    } else {
      toastify("warning", "شما سوالی ایجاد نکرده اید");
    }
  };

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{ boxShadow: "none" }}
      >
        ایجاد سوالات جدید
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <Grid container mt={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" color="mainText" fontWeight={500}>
                  سوال های آزمون
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={quizQuestion.has_negative}
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
                  variant="contained"
                  sx={{
                    boxShadow: "none",
                    borderRadius: "5px",
                    color: "#fff",
                    fontSize: "17px",
                  }}
                  color="secondary"
                  onClick={questionHandler}
                >
                  ثبت سوال
                </Button>
              </Grid>
              {question.length > 0 && (
                <Grid item xs={12}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableCell>تصویر سوال</TableCell>
                        <TableCell>پاسخ صحیح</TableCell>
                        <TableCell></TableCell>
                      </TableHead>
                      <TableBody>
                        {question.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <img
                                src={item.showImage}
                                alt="q"
                                style={{ width: "100px" }}
                              />
                            </TableCell>
                            <TableCell>{item.result}</TableCell>
                            <TableCell>
                              <Button
                                color="error"
                                onClick={() => removeHandler(item.question)}
                              >
                                حذف
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button
                fullWidth
                sx={{ boxShadow: "none", padding: "10px 0" }}
                variant="contained"
                onClick={createHandler}
                disabled={loading}
              >
                ثبت نهایی سوالات
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewQuestionExam;
