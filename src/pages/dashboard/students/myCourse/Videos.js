import React from "react";
import { Container } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import VideoCard from "../../../../components/dashboard/students/videos/VideoCard";

const Videos = () => {
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
            ویدیوها
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <VideoCard />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Videos;
