import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { Typography, Grid, Card, Stack } from "@mui/material";
import { Container } from "@mui/system";
import Loader from "../../../../components/site/shared/Loader";

// quiz/tstudentres/?s_id=1&h_id=1
const QuizScore = () => {
  const { id } = useParams();
  const { auth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        `quiz/tstudentres/?s_id=${user.pk}&h_id=${id}`,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      setData(response.data);
      setLoading(false);
    };
    fetchData();
  }, []);

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
          <Typography
            component="h5"
            variant="h6"
            fontWeight={500}
            color="mainText"
          >
            نتایج آزمون
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ margin: "0 auto" }}>
          <Card
            sx={{
              borderRadius: "15px",
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              padding: 2,
            }}
          >
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Typography color="text.secondary">پاسخ صحیح:</Typography>
              <Typography color="text">{data?.correct_count}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">تعداد سوالات:</Typography>
              <Typography color="text">{data?.q_count}</Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuizScore;
