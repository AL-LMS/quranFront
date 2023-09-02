import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { Container } from "@mui/system";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Stack, Typography, Grid, Divider } from "@mui/material";
import Loader from "../../../../components/site/shared/Loader";

const EndQuiz = () => {
  const { id } = useParams();
  const { auth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        `quiz/studentQueez/?s_id=${user.pk}&h_id=${id}`,
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
      <Grid container mt={3} spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              borderRadius: "15px",
              padding: 2,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography>نام آزمون:{data[0]?.header_name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography textAlign="right">
                  نام کاربری دانش آموز:{data[0]?.student_name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {data.length > 0 &&
                data.map((item, i) => (
                  <Grid item xs={12} key={item.id}>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography>سوال:{i + 1}</Typography>
                      <Typography>جواب شما:{item.result}</Typography>
                    </Stack>
                  </Grid>
                ))}
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Link to="/panel/quiz">
                  <Button
                    variant="contained"
                    sx={{ boxShadow: "none", padding: "10px 25px" }}
                  >
                    اتمام مرور
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EndQuiz;
