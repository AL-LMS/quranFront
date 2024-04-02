import React from "react";
import { Grid } from "@mui/material";

import NotFoundImage from "../../../assets/img/notfound.png";
import { Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        height: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <img
          src={NotFoundImage}
          alt="404"
          style={{ width: "330px", display: "block", margin: "0 auto" }}
        />
        <Typography
          varinat="h4"
          color="#666"
          fontWeight={500}
          textAlign="center"
          mt={2}
        >
          دوره مورد نظر یافت نشد
        </Typography>
      </div>
    </Grid>
  );
};

export default NotFound;
