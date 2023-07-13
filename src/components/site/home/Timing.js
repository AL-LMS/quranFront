import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import TimingImage from "../../../assets/img/time.png";

const Timing = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get("slider/banner");
      setData(response.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return null;

  console.log(data);
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
          زمان بندی دوره ها
        </Typography>
        <Typography
          color="#ccc"
          sx={{ letterSpacing: "8px" }}
          textAlign="center"
          mt={1}
        >
          Timing of courses
        </Typography>
      </Grid>
      {data.map((item) => (
        <Grid item xs={12} md={4} key={item.id}>
          <a href={`https://api.srvschool.ir${item.picture}`} download>
            <Card
              sx={{
                padding: 2,
                borderRadius: "25px",
                boxShadow: "0 5px 20px rgba(112,112,112,0.2)",
              }}
            >
              <CardMedia
                component="img"
                src={TimingImage}
                alt="nohom"
                sx={{
                  width: "100px",
                  display: "block",
                  margin: "0 auto",
                }}
              />
              <CardActions sx={{ marginTop: 3 }}>
                <Button fullWidth sx={{ fontSize: "1rem" }}>
                  {item.title}
                </Button>
              </CardActions>
            </Card>
          </a>
        </Grid>
      ))}
    </Grid>
  );
};

export default Timing;
