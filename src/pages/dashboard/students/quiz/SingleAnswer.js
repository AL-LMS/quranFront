import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { Container } from "@mui/system";
import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import Question from "../../../../components/dashboard/students/quiz/Question";

import { Stack } from "@mui/system";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../../components/site/shared/Loader";

const SingleAnswer = () => {
  const { auth } = useAuth();
  const { id } = useParams();
  const [step, setStep] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questionCount, setQuiestionCount] = useState(0);
  const [header, setHeader] = useState({});
  const navigate = useNavigate();
  let quizTime = +localStorage.getItem("time");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`quiz/quizQuestion/?h_id=${id}`, {
          headers: { Authorization: `Bearer ${auth}` },
        });
        const data = await response.data;
        setData(data[step]);
        setLoading(false);
        setQuiestionCount(response.data.length);
      } catch (err) {
        if (err.response.status === 404) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [step]);

  useEffect(() => {
    const fetchHeader = async () => {
      setLoading(true);
      const response = await axios.get(`quiz/quizHeader/?c_id=${id}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setHeader(response.data[0]);
      setLoading(false);
    };
    fetchHeader();
  }, []);

  const sendHandler = async () => {
    try {
      const response = await axios.post("quiz/studentQueez/", answers, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      navigate(`/panel/quiz/end/${id}`);
    } catch (err) {}
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date().toISOString();
      const dateTime = new Date(date).getTime();
      const matchTime = dateTime;
      quizTime = quizTime - 1;
      localStorage.setItem("time", quizTime);
      if (+localStorage.getItem("dnq") < matchTime || quizTime <= 0) {
        sendHandler();
      }
    }, 1000);
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [answers]);
  if (loading)
    return (
      <Container maxWidth="lg">
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader />
          </Grid>
        </Grid>
      </Container>
    );

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              padding: 2,
              borderRadius: "5px",
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography color="mainText" textAlign="center" mb={3}>
                نام آزمون:
              </Typography>
              <Typography color="mainText" textAlign="center" mb={3}>
                نام درس:{header?.course_name}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" mt={2}>
              <Typography color="mainText" textAlign="center" mb={3}>
                نام استاد:{header?.teacher_name}
              </Typography>
              <Typography color="mainText" textAlign="center" mb={3}>
                مدت زمان آزمون:{header?.quizTime} دقیقه
              </Typography>
            </Stack>
            <Divider sx={{ marginBottom: 3 }} />
            <Question
              data={data}
              id={id}
              answers={answers}
              setAnswers={setAnswers}
            />
            {questionCount - 1 > step && (
              <Button
                variant="contained"
                color="secondary"
                disabled={answers[step]?.result ? false : true}
                sx={{
                  color: "#fff",
                  margin: "1rem 0",
                  boxShadow: "none",
                  float: "right",
                }}
                onClick={() => setStep((prevState) => prevState + 1)}
              >
                سوال بعد
              </Button>
            )}
            <Button
              onClick={sendHandler}
              variant="contained"
              sx={{ boxShadow: "none", padding: "10px 0" }}
              fullWidth
            >
              اتمام آزمون
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SingleAnswer;
