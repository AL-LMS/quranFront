import React from "react";
import { Box, Card, Grid, Typography } from "@mui/material";

const CourseFreeVideos = () => {
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "5px",
        padding: 2,
      }}
    >
      <Typography variant="h6" fontWeight={500} color="mainText">
        ویدیوهای رایگان دوره
      </Typography>
      <Grid container mt={2} spacing={3}>
        <Grid item xs={12} md={3}>
          <video src="" controls></video>
        </Grid>
        <Grid item xs={12} md={3}>
          <video src="" controls></video>
        </Grid>
        <Grid item xs={12} md={3}>
          <video src="" controls></video>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CourseFreeVideos;
