import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Grid } from "@mui/material";
import { Container } from "@mui/system";

import OverView from "../../../components/dashboard/teacher/dashboard/OverView";
import Loader from "../../../components/site/shared/Loader";
import Courses from "../../../components/dashboard/teacher/dashboard/Courses";

const Dashboard = () => {
  const { auth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stCount, setStCount] = useState("");
  const [cCount, setCCount] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      const response = await axios.all([
        axios.get(`course/teacherScount/?id=${user.pk}`, {
          headers: { Authorization: `Bearer ${auth}` },
        }),
        axios.get(`course/teachercCount/?id=${user.pk}`, {
          headers: { Authorization: `Bearer ${auth}` },
        }),
      ]);
      setLoading(false);
      setStCount(response[0].data);
      setCCount(response[1].data);
    };
    fetchData();
  }, []);
  if (loading)
    return (
      <Container maxWidth="lg">
        <Grid container spacing={3}>
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
        <Grid item xs={12} md={6}>
          <OverView type="student" count={stCount} />
        </Grid>
        <Grid item xs={12} md={6}>
          <OverView type="course" count={cCount} />
        </Grid>
        <Grid item xs={12}>
          <Courses />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
