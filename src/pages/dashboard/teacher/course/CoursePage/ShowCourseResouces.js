import React from "react";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import CircleIcon from "../../../../../assets/img/circle-small.svg";

const ShowCourseResouces = ({ data }) => {
  return (
    <Grid container spacing={4} style={{ marginRight: 0 }}>
      {data.length > 0 ? (
        data.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" spacing={1}>
                <img src={CircleIcon} alt="circle" />
                <Typography color="mainText" fontWeight={400}>
                  {item.name}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="h5" color="#888" textAlign="center">
            درحال حاضر منبعی برای دوره ثبت نشده
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Link to="/panel/my-coures">
          <Button>مشاهده همه منابع</Button>
        </Link>
      </Grid>
    </Grid>
  );
};

export default ShowCourseResouces;
