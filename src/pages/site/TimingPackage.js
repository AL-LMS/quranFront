import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import Loader from "../../components/site/shared/Loader";
import TimingCard from "../../components/site/packages/TimingCard";

const TimingPackage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get("package/timingPackage");
      const data = await response.data;
      setData(data);
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
              display: "flex",
              alignITems: "center",
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
      <Grid container spacing={3} mt={1}>
        {data.map((item) => (
          <Grid item xs={12} md={3} key={item.id}>
            <TimingCard data={item}/>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TimingPackage;
