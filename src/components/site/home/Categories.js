import React, { useContext } from "react";
import { DefiContext } from "../../../context/DefiContext";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

import Book from "../../../assets/img/Content.png";

const Categories = () => {
  const { gradeID } = useContext(DefiContext);
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
          دسته بندی دوره ها
        </Typography>
        <Typography
          color="#ccc"
          sx={{ letterSpacing: "8px" }}
          textAlign="center"
          mt={1}
        >
          Category of courses
        </Typography>
      </Grid>
      {/* {gradeID.map((item) => (
        <Grid item xs={12} md={3} key={item.id}>
          <Link to={`/course?page=1&grade=${item.id}`}>
            <Card
              sx={{
                boxShadow: "0 5px 20px rgba(112,112,112,0.2)",
                borderRadius: "15px",
                padding: 2,
              }}
            >
              <CardMedia
                src={Book}
                alt="course"
                component="img"
                sx={{
                  heaight: "80px",
                  width: "80px",
                  display: "block",
                  margin: "0 auto",
                }}
              />
              <CardActions>
                <Button
                  variant="contained"
                  sx={{ boxShadow: "none", borderRadius: "15px", marginTop: 2 }}
                  fullWidth
                >
                  {item.name}
                </Button>
              </CardActions>
            </Card>
          </Link>
        </Grid>
      ))} */}
    </Grid>
  );
};

export default Categories;
