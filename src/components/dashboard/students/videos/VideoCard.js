import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import {Link} from "react-router-dom"

import CourseImage from "../../../../assets/img/c.jpg";

const VideoCard = () => {
  return (
    <Card
      sx={{
        padding: 2,
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: 3,
        width: "fit-content",
      }}
    >
      <CardMedia
        component="img"
        src={CourseImage}
        alt="video"
        height={200}
        sx={{ borderRadius: 2 }}
      />
      <CardContent>
        <Typography variant="body" color="mainText" fontWeight={500}>
          زیست - استاد ظهریان
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ marginTop: 2 }}
        >
          ین دوره در زمینه مشترک ریاضی و تجربی مخ...
        </Typography>
      </CardContent>
      <CardActions sx={{justifyContent:"center"}}>
        <Link to="/" style={{ display: "block" }}>
          <Button variant="outlined" sx={{ boxShadow: "none" }}>
            جزییات بیشتر
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default VideoCard;
