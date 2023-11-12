import React from "react";
import { Card, CardMedia, Grid, Typography } from "@mui/material";

// import Android from "../../../assets/videos/Android.mp4";
// import Apple from "../../../assets/videos/IOS.mp4";
// import Windows from "../../../assets/videos/Windows.mp4";

const Help = () => {
  return (
    <Grid container spacing={3} my={8}>
      <Grid item xs={12}>
        <Typography
          color="mainText"
          textAlign="center"
          component="h3"
          variant="h6"
          fontWeight={500}
        >
          راهنمای نصب و استفاده
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
            padding: 2,
            borderRadius: "5px",
          }}
        >
          <CardMedia
            component="video"
            // src={Android}
            controls
            sx={{ height: "300px", borderRadius: "5px" }}
          />
          <Typography color="mainText" textAlign="center" mt={2}>
            آموزش نسخه اندروید
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
            padding: 2,
            borderRadius: "5px",
          }}
        >
          <CardMedia
            component="video"
            // src={Apple}
            controls
            sx={{ height: "300px", borderRadius: "5px" }}
          />
          <Typography color="mainText" textAlign="center" mt={2}>
            آموزش نسخه آی او اس
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
            padding: 2,
            borderRadius: "5px",
          }}
        >
          <CardMedia
            component="video"
            // src={Windows}
            controls
            sx={{ height: "300px", borderRadius: "5px" }}
          />
          <Typography color="mainText" textAlign="center" mt={2}>
            آموزش نسخه ویندوز
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Help;
