import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { Container } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import ReportList from "../../../../components/dashboard/students/myCourse/ReportList";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Loader from "../../../../components/site/shared/Loader";

const Report = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [header, setHeader] = useState([]);
  const [loading, setLoading] = useState(false);

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

  if (loading)
    return (
      <Container maxWidth="lg">
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
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
            نتایج آزمون دوره
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ margin: "0 auto" }}>
          <ReportList header={header} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Report;
