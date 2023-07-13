import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Container } from "@mui/system";
import { Card, Divider, Grid, Typography } from "@mui/material";
import IncreaseWallet from "../../../components/dashboard/students/wallet/IncreaseWallet";
import Loader from "../../../components/site/shared/Loader";

const Wallet = () => {
  const { auth } = useAuth();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get("dashboard/wallet", {
        headers: { Authorization: `Bearer ${auth}` },
      });
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
              alignITems: "center",
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
        <Grid item xs={12} md={5} sx={{ margin: "0 auto" }}>
          <Card
            sx={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              padding: 2,
              borderRadius: "20px",
            }}
          >
            <Typography
              component="h6"
              variant="h6"
              color="text.secondary"
              textAlign="center"
              sx={{ marginBottom: 2 }}
            >
              موجودی کیف پول
            </Typography>
            <Typography
              component="h6"
              variant="h6"
              color="text.secondary"
              textAlign="center"
              fontFamily="iranyekanFn"
              fontWeight={600}
              fontSize="18px"
            >
              {data?.amount?.toLocaleString()} تومان
            </Typography>
            <Divider sx={{ padding: "10px 0" }} />
            <IncreaseWallet />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography
            component="h5"
            variant="h6"
            fontWeight={400}
            textAlign="center"
            color="mainText"
          >
            تراکنش های شما
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.secondary" textAlign="center">
            تراکنشی برای نمایش وجود ندارد
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Wallet;
