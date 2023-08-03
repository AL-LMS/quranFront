import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import {
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toastify } from "../../../../helper/toast";
import { DatePicker } from "zaman";
import "react-toastify/dist/ReactToastify.css";
const TeacherNewExam = () => {
  const { auth } = useAuth();
  const { courseid, teacherid, id } = useParams();
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizHeader, setQuizHeader] = useState({
    description: "",
    course: courseid,
    teacher: teacherid,
    quizTime: "",
    question_count: "",
    start_data: "",
    end_data: "",
    min_range: "",
    type: "",
  });
  const [quizQuestion, setQuizQuestion] = useState({
    title: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    result: "",
  });

  const [question, setQuestion] = useState([]);

  const changeHandler = (e) => {
    setQuizHeader({ ...quizHeader, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`quiz/quizHeader/?c_id=${courseid}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setQuizHeader(response.data[0]);
    };
    if (id) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (id) {
      setType("edit");
    } else {
      setType("create");
    }
  }, [id]);

  const headerCreate = async () => {
    if (
      quizHeader.end_data &&
      quizHeader.quizTime &&
      quizHeader.start_data &&
      quizHeader.type &&
      quizHeader.min_range
    ) {
      setLoading(true);
      try {
        const response = await axios.post("quiz/quizHeader/", quizHeader, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });
        console.log(response);
        toastify("success-login", "اطلاعات با موفقیت ثبت شد");
      } catch (err) {
        console.log(err);
        console.log(quizHeader);
        toastify("error-login", "خطا در برقراری ارتباط با سرور");
        setLoading(false);
      }
    } else {
      toastify(
        "warning-login",
        "لطفا تمامی فیلد هارا پر کنید دقت کنید تاریخ شروع و پایان صرفا تاریخ امروز را نشان میدهد"
      );
    }
  };
  const headerEdit = async () => {
    if (
      quizHeader.end_data &&
      quizHeader.quizTime &&
      quizHeader.start_data &&
      quizHeader.type &&
      quizHeader.min_range
    ) {
      setLoading(true);
      try {
        const response = await axios.put(
          "quiz/quizHeader/",
          {
            id: id,
            description: quizHeader.description,
            course: courseid,
            teacher: teacherid,
            quizTime: quizHeader.quizTime,
            question_count: quizHeader.question_count,
            start_data: quizHeader.start_data,
            end_data: quizHeader.end_data,
            min_range: quizHeader.min_range,
            type: quizHeader.type,
          },
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          }
        );
        console.log(response);
        toastify("success-login", "اطلاعات با موفقیت ثبت شد");
      } catch (err) {
        console.log(err);
        console.log(quizHeader);
        toastify("error-login", "خطا در برقراری ارتباط با سرور");
        setLoading(false);
      }
    } else {
      toastify(
        "warning-login",
        "لطفا تمامی فیلد هارا پر کنید دقت کنید تاریخ شروع و پایان صرفا تاریخ امروز را نشان میدهد"
      );
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              borderRadius: "25px",
              padding: 3,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  component="h4"
                  variant="h6"
                  color="mainText"
                  fontWeight={500}
                >
                  {type === "create" ? "ایجاد آزمون" : "ویرایش آزمون"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="type">نوع آزمون</InputLabel>
                  <Select
                    id="type"
                    label="نوع آزمون"
                    value={quizHeader.type}
                    onChange={changeHandler}
                    name="type"
                  >
                    <MenuItem value={1}>آزمون تک جوابی</MenuItem>
                    <MenuItem value={2}>آزمون کلی</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="تعداد سوالات"
                  value={quizHeader.question_count}
                  onChange={changeHandler}
                  name="question_count"
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="حداقل پاسخ صحیح برای قبولی"
                  value={quizHeader.min_range}
                  onChange={changeHandler}
                  name="min_range"
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="مدت زمان(دقیقه)"
                  value={quizHeader.quizTime}
                  onChange={changeHandler}
                  name="quizTime"
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6} className="quiz-start-time">
                <DatePicker
                  onClickSubmitButton={({ value }) =>
                    setQuizHeader({
                      ...quizHeader,
                      start_data: value._d.toISOString(),
                    })
                  }
                  timePicker={true}
                  label="زمان شروع"
                />
              </Grid>
              <Grid item xs={12} md={6} className="quiz-start-time">
                <DatePicker
                  onClickSubmitButton={({ value }) =>
                    setQuizHeader({
                      ...quizHeader,
                      end_data: value._d.toISOString(),
                    })
                  }
                  timePicker={true}
                  label="زمان پایان"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="توضیحات(اختیاری)"
                  value={quizHeader.description}
                  onChange={changeHandler}
                  name="description"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                {id ? (
                  <Button
                    fullWidth
                    sx={{ boxShadow: "none" }}
                    variant="contained"
                    onClick={headerEdit}
                  >
                    ویرایش آزمون
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    sx={{ boxShadow: "none" }}
                    variant="contained"
                    onClick={headerCreate}
                  >
                    ایجاد آزمون
                  </Button>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default TeacherNewExam;
