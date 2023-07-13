import React from "react";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";
import SpecialOffers from "../../components/site/home/SpecialOffers";

import Slider from "../../components/site/home/Slider";
import Categories from "../../components/site/home/Categories";
import Timing from "../../components/site/home/Timing";
import WhyUs from "../../components/site/home/WhyUs";

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={8}>
        <Grid item xs={12} mt={5}>
          <Slider />
        </Grid>
        <Grid item xs={12}>
          <a
            href="whatsapp://send?phone=+989900199840"
            style={{ display: "block" }}
          >
            <Card
              sx={{
                boxShadow: "0 5px 15px rgba(112,112,112,0.2)",
                borderRadius: "15px",
                padding: 2,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack spacing={1}>
                  <Typography variant="h6" color="mainText">
                    خرید اقساطی دوره ها
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    همین الان دوره هایی که نیاز داری رو به صورت اقساطی بخر!
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  sx={{ boxShadow: "none", borderRadius: 2 }}
                >
                  جزییات بیشتر
                </Button>
              </Stack>
            </Card>
          </a>
        </Grid>
        <Grid item xs={12}>
          <Categories />
        </Grid>
        <Grid item xs={12} mt={3}>
          <SpecialOffers />
        </Grid>
        <Grid item xs={12}>
          <Timing />
        </Grid>
        <Grid item xs={12}>
          <WhyUs />
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
