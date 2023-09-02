import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Pagination } from "@mui/material";
import { Container } from "@mui/system";
import PackageCard from "../../components/site/packages/PackageCard";
import Loader from "../../components/site/shared/Loader";

const Packages = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get("package/normalPackage");
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
            <PackageCard data={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Packages;
