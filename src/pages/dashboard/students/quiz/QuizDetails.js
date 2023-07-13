import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { Stack } from "@mui/system";
import { Link, useParams, useNavigate } from "react-router-dom";

import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import useAuth from "../../../../hooks/useAuth";
import Loader from "../../../../components/site/shared/Loader";
import { miladi_be_shamsi } from "../../../../helper/shamsi";

const QuizDetails = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const date = new Date().toISOString();
  const dateTime = new Date(date).getTime();
  const matchTime = dateTime;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(`quiz/quizHeader/?c_id=${id}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setData(response.data[0]);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data?.end_data) {
      const date = new Date(data.end_data).getTime();
      localStorage.setItem("dnq", JSON.stringify(date));
      localStorage.setItem("time", JSON.stringify(data.quizTime*60));
    }
  }, [data]);

  if (!data)
    return (
      <Container maxWidth="lg">
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Typography
              variant="h5"
              color="#999"
              fontWeight={500}
              textAlign="center"
            >
              آزمونی برای دوره ثبت نشده است
            </Typography>
          </Grid>
        </Grid>
      </Container>
    );

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
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              borderRadius: "30px",
              padding: 2,
            }}
          >
            <Typography
              component="h5"
              variant="h6"
              fontWeight={500}
              color="mainText"
            >
              آزمون درس {data?.course_name} | نوع آزمون :
              {data?.type === "1" ? "تک سوالی" : "کامل"}
            </Typography>
            <List sx={{ margin: "2rem auto" }}>
              <ListItem
                secondaryAction={
                  <Typography
                    color="text.secondary"
                    fontFamily="iranyekanFn"
                    fontWeight={600}
                  >
                    {data?.question_count} سوال
                  </Typography>
                }
              >
                <ListItemText>
                  <Stack direction="row" spacing={1}>
                    <RadioButtonCheckedIcon color="error" />
                    <Typography color="mainText">تعداد سوالات</Typography>
                  </Stack>
                </ListItemText>
              </ListItem>
              <ListItem
                secondaryAction={
                  <Typography
                    color="text.secondary"
                    fontFamily="iranyekanFn"
                    fontWeight={600}
                  >
                    {data?.quizTime} دقیقه
                  </Typography>
                }
              >
                <ListItemText>
                  <Stack direction="row" spacing={1}>
                    <RadioButtonCheckedIcon color="error" />
                    <Typography color="mainText">مدت آزمون:</Typography>
                  </Stack>
                </ListItemText>
              </ListItem>
              <ListItem
                secondaryAction={
                  <Typography
                    color="text.secondary"
                    fontFamily="iranyekanFn"
                    fontWeight={600}
                  >
                    {data?.min_range} از {data?.question_count}
                  </Typography>
                }
              >
                <ListItemText>
                  <Stack direction="row" spacing={1}>
                    <RadioButtonCheckedIcon color="error" />
                    <Typography color="mainText">نمره قبولی:</Typography>
                  </Stack>
                </ListItemText>
              </ListItem>
              <ListItem
                secondaryAction={
                  <Typography
                    color="text.secondary"
                    fontFamily="iranyekanFn"
                    fontWeight={600}
                  >
                    {data?.start_data &&
                      new Date(data?.start_data).toLocaleDateString("fa-US")}
                    &nbsp;|&nbsp;
                    {new Date(data.start_data).toTimeString().slice(0, 5)}
                  </Typography>
                }
              >
                <ListItemText>
                  <Stack direction="row" spacing={1}>
                    <RadioButtonCheckedIcon color="error" />
                    <Typography color="mainText">زمان شروع:</Typography>
                  </Stack>
                </ListItemText>
              </ListItem>
              <ListItem
                secondaryAction={
                  <Typography
                    color="text.secondary"
                    fontFamily="iranyekanFn"
                    fontWeight={600}
                  >
                    {data?.end_data &&
                      new Date(data?.end_data).toLocaleDateString("fa-US")}
                    &nbsp;|&nbsp;
                    {new Date(data.end_data).toTimeString("fa").slice(0, 5)}
                  </Typography>
                }
              >
                <ListItemText>
                  <Stack direction="row" spacing={1}>
                    <RadioButtonCheckedIcon color="error" />
                    <Typography color="mainText">زمان پایان:</Typography>
                  </Stack>
                </ListItemText>
              </ListItem>
            </List>
            <Divider />
            {data?.type === "2" ? (
              <Button
                onClick={() => navigate(`/panel/quiz/start/${data?.id}`)}
                variant="contained"
                disabled={
                  new Date(data.start_data).getTime() < matchTime &&
                  new Date(data.end_data).getTime() > matchTime
                    ? false
                    : true
                }
                sx={{
                  boxShadow: "none",
                  borderRadius: 3,
                  margin: "2rem auto",
                  display: "block",
                  padding: "10px 30px",
                  fontSize: "17px",
                }}
              >
                شرکت در آزمون
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate(`/panel/quiz/start-single/${data?.id}`)}
                disabled={
                  new Date(data.start_data).getTime() < matchTime &&
                  new Date(data.end_data).getTime() > matchTime
                    ? false
                    : true
                }
                sx={{
                  boxShadow: "none",
                  borderRadius: 3,
                  margin: "2rem auto",
                  display: "block",
                  padding: "10px 30px",
                  fontSize: "17px",
                }}
              >
                شرکت در آزمون
              </Button>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuizDetails;
