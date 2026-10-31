import { legacyAssetUrl } from "../../../../api/localAssets.js";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Stack } from "@mui/system";
import NoImage from "../../../../assets/img/class1.jpeg";

const days_show = (days) => {
  let days_string = "";
  for (let index = 0; index < days.length; index++) {
    if (index === 0) {
      days_string = days[index];
    } else {
      days_string = days_string + ", " + days[index];
    }
  }
  return days_string;
};

const CourseList = ({ data }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigator = useNavigate();
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
      }}
      onClick={() => navigator(`/panel/course-page/${data?.course_id}`)}
    >
      <CardMedia
        component="img"
        alt={data?.name}
        src={
          data.picture === "default"
            ? NoImage
            : legacyAssetUrl(`/back_request/get_course_pic/${data.picture}`)
        }
        sx={{
          borderBottomRightRadius: "5px",
          borderTopLeftRadius: "5px",
          maxWidth: "100%",
          height: { xs: "0px", sm: "95px", md: "160px" },
          width: { xs: "0px", sm: "80px", md: "160px" },
        }}
      />
      <CardContent>
        <Typography component="h6" variant="body1" color="mainText">
          نام دوره: <span style={{ color: "#000" }}>{data?.name}</span>
        </Typography>
        <Stack direction="row" spacing={2} mt={2}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontFamily="iranyekanFn"
          >
            روزهای برگزاری:{" "}
            <span style={{ color: "#000" }}>{days_show(data?.days)}</span>
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ marginLeft: "auto", alignSelf: "flex-start" }}>
        <Button
          sx={{ boxShadow: "none", borderRadius: "5px" }}
          fullWidth
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disableElevation
          onClick={handleClick}
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
              borderRadius: "5px",
              color: "#666",
              textAlign: "center",
              padding: "0 1rem",
            },
          }}
        >
          <MenuItem onClick={handleClose}>
            <Link to={`/panel/course-page/${data?.course_id}`}>
              <Button>صفحه کلاس</Button>
            </Link>
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
};

export default CourseList;
