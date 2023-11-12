import React from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";

import QuizzesIcon from "../../../assets/img/Quizzes.png";
import ClassIcon from "../../../assets/img/Virtual Class.png";
import ChatIcon from "../../../assets/img/Posts.png";

const WhyUs = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} mb={2}>
        <Typography
          color="mainText"
          textAlign="center"
          component="h3"
          variant="h5"
          fontWeight={500}
        >
          چرا کنکور هدف؟
        </Typography>
        <Typography
          color="#ccc"
          sx={{ letterSpacing: "8px" }}
          textAlign="center"
          mt={1}
        >
          Why us
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            boxShadow: "0 5px 20px rgba(112,112,112,0.2)",
            borderRadius: "5px",
            padding: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <CardMedia
            component="img"
            src={QuizzesIcon}
            alt="daarolquran"
            sx={{
              width: "80px",
              height: "80px",
              display: "block",
              margin: "0 auto",
            }}
          />
          <CardContent>
            <Typography
              varaint="body1"
              fontWeight={400}
              color="mainText"
              mb={1}
            >
              تست های هر دوره
            </Typography>
            <Typography fontSize="13px" color="#ccc">
              با گذراندن تست های کنکور هدف برای کنکور بیشتر آماده می شوید
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            boxShadow: "0 5px 20px rgba(112,112,112,0.2)",
            borderRadius: "5px",
            padding: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <CardMedia
            component="img"
            src={ClassIcon}
            alt="daarolquran"
            sx={{
              width: "80px",
              height: "80px",
              display: "block",
              margin: "0 auto",
            }}
          />
          <CardContent>
            <Typography
              varaint="body1"
              fontWeight={400}
              color="mainText"
              mb={1}
            >
              کلاس های سالیانه
            </Typography>
            <Typography fontSize="13px" color="#ccc">
              برگزاری کلاس های سالیانه برای مقاطع نهم دهم یازدهم و فارغ
              التحصیلان
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            boxShadow: "0 5px 20px rgba(112,112,112,0.2)",
            borderRadius: "5px",
            padding: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <CardMedia
            component="img"
            src={ChatIcon}
            alt="daarolquran"
            sx={{
              width: "80px",
              height: "80px",
              display: "block",
              margin: "0 auto",
            }}
          />
          <CardContent>
            <Typography
              varaint="body1"
              fontWeight={400}
              color="mainText"
              mb={1}
            >
              پشتیبانی آنلاین دوره ها
            </Typography>
            <Typography fontSize="13px" color="#ccc">
              هردوره به صورت جداگانه فضایی آنلاین بدون محدودیت جهت رفع اشکال
              دارد
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default WhyUs;
