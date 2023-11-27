import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ResourcesLists from "../ObjectLists/ResourcesLists";

const ShowCourseResouces = ({ data, id }) => {
  return (
    <Grid container spacing={4} style={{ marginRight: 0 }}>
      {data.length > 0 ? (
        <ResourcesLists data={data} />
      ) : (
        <Grid item xs={12}>
          <Typography variant="h5" color="#888" textAlign="center">
            درحال حاضر منبعی برای دوره ثبت نشده
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Link to={"/panel/course/resources/" + id}>
          <Button>مشاهده همه منابع</Button>
        </Link>
      </Grid>
    </Grid>
  );
};

export default ShowCourseResouces;
