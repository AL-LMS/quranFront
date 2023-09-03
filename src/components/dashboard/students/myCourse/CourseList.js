import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import CourseImage from "../../../../assets/img/online-education.png";
import NoImage from "../../../../assets/img/class1.jpeg";

import { Stack } from "@mui/system";
import JoinMeeting from "./JoinMeeting";

const CourseList = ({ data }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
      }}
    >
      <CardMedia
        component="img"
        src={data.picture}
        sx={{ maxWidth: "100%", width: { xs: "80px", md: "160px" } }}
      />
      <CardContent>
        {!data?.enable ||
          (!data?.accepted && <Chip color="error" label="غیرفعال" />)}
        <Typography component="h6" variant="body1" color="mainText">
          نام دوره:{data?.name}
        </Typography>
        <Stack direction="row" spacing={2} mt={2}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontFamily="iranyekanFn"
          >
            توضیحات : {data?.explain}
          </Typography>
        </Stack>
        {/* {!data?.accepted && (
          <Chip
            label="دوره آزمون ورودی دارد"
            color="secondary"
            sx={{ color: "#fff", marginTop: 2 }}
          />
        )} */}
      </CardContent>
      <CardActions sx={{ marginLeft: "auto", alignSelf: "flex-start" }}>
        <Button
          sx={{ boxShadow: "none", borderRadius: 3 }}
          fullWidth
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disableElevation
          onClick={handleClick}
          // disabled={!data?.enable || !data?.accepted}
        >
          <MoreVertIcon />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          PaperProps={{
            elevation: 0,
            sx: {
              boxShadow: "0 5px 10px rgba(112,112,112,.2)",
              borderRadius: 4,
              color: "#666",
              textAlign: "center",
              padding: "0 1rem",
            },
          }}
        >
          <MenuItem onClick={handleClose}>
            <Link to={`/panel/my-course/forumlist/${data?.courseID}`}>
              <Button>صفحه کلاس</Button>
            </Link>
          </MenuItem>
          {/* <MenuItem onClick={handleClose}>
            <Link to={`/panel/my-course/exercise/${data?.courseID}`}>
              <Button>تکالیف</Button>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to={`/panel/my-course/tags/${data?.courseID}`}>
              <Button>فایل و جزوات</Button>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <JoinMeeting id={data?.courseID} />
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to={`/panel/my-course/report/${data?.courseID}`}>
              <Button>مشاهده نتایج آزمون ها</Button>
            </Link>
          </MenuItem> */}
        </Menu>
      </CardActions>
    </Card>
  );
};

export default CourseList;
