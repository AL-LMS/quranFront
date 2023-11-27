import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import NotifsLists from "../ObjectLists/NotifsLists";

const ShowCourseNotif = ({ data, id }) => {
  return (
    <Grid
      container
      spacing={4}
      style={{ marginRight: 0, justifyContent: "center" }}
    >
      {data.length > 0 ? (
        <NotifsLists data={data} />
      ) : (
        <Grid item xs={12}>
          <Typography variant="h5" color="#888" textAlign="center">
            درحال حاضر اطلاعیه‌ای برای دوره ثبت نشده
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Link to={"/panel/course/notifs/" + id}>
          <Button>مشاهده همه اطلاعیه‌ها</Button>
        </Link>
      </Grid>
    </Grid>
  );
};

export default ShowCourseNotif;
