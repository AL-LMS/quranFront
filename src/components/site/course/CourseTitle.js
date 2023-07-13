import React from "react";
import { Card, CardMedia, Chip, Grid, Typography } from "@mui/material";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";

const CourseTitle = () => {
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "25px",
        padding: 2,
      }}
    >
      <Typography variant="h6" fontWeight={500} color="mainText">
        مباحث دوره
      </Typography>
      <Grid container spacing={2} mt={3}>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Chip
            color="secondary"
            sx={{
              borderRadius: "50%",
              color: "#fff",
              width: "80px",
              height: "80px",
            }}
            label={<MovieOutlinedIcon fontSize="large" />}
          />
          <Typography color="text.secondary" textAlign="center" mt={1}>
            جلسه اول ۶ مرداد فشار
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Chip
            color="secondary"
            sx={{
              borderRadius: "50%",
              color: "#fff",
              width: "80px",
              height: "80px",
            }}
            label={<MovieOutlinedIcon fontSize="large" />}
          />
          <Typography color="text.secondary" textAlign="center" mt={1}>
            جلسه اول ۶ مرداد فشار
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Chip
            color="secondary"
            sx={{
              borderRadius: "50%",
              color: "#fff",
              width: "80px",
              height: "80px",
            }}
            label={<MovieOutlinedIcon fontSize="large" />}
          />
          <Typography color="text.secondary" textAlign="center" mt={1}>
            جلسه اول ۶ مرداد فشار
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Chip
            color="secondary"
            sx={{
              borderRadius: "50%",
              color: "#fff",
              width: "80px",
              height: "80px",
            }}
            label={<MovieOutlinedIcon fontSize="large" />}
          />
          <Typography color="text.secondary" textAlign="center" mt={1}>
            جلسه اول ۶ مرداد فشار
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Chip
            color="secondary"
            sx={{
              borderRadius: "50%",
              color: "#fff",
              width: "80px",
              height: "80px",
            }}
            label={<MovieOutlinedIcon fontSize="large" />}
          />
          <Typography color="text.secondary" textAlign="center" mt={1}>
            جلسه اول ۶ مرداد فشار
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Chip
            color="secondary"
            sx={{
              borderRadius: "50%",
              color: "#fff",
              width: "80px",
              height: "80px",
            }}
            label={<MovieOutlinedIcon fontSize="large" />}
          />
          <Typography color="text.secondary" textAlign="center" mt={1}>
            جلسه اول ۶ مرداد فشار
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CourseTitle;
