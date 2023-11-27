import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import HomeWorksLists from "../ObjectLists/HomeWorksLists";

const ShowCourseHWs = ({ data, id }) => {
  return (
    <Grid container spacing={4} style={{ marginRight: 0 }}>
      {data.length > 0 ? (
        <HomeWorksLists data={data} />
      ) : (
        <Grid item xs={12}>
          <Typography variant="h5" color="#888" textAlign="center">
            درحال حاضر تکلیفی برای دوره ثبت نشده
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Link to={"/panel/course/home-works/" + id}>
          <Button>مشاهده همه تکالیف</Button>
        </Link>
      </Grid>
    </Grid>
  );
};

export default ShowCourseHWs;
