import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";

import NoImage from "../../../assets/img/class1.jpeg";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import toastify from "../../../helper/toast";
import axios from "axios";

const CourseCard = ({ data }) => {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "25px",
        padding: 1,
      }}
    >
      <Link to={`/panel/course/details/${data?.course_id}`}>
        <CardMedia
          component="img"
          sx={{ width: "100%", borderRadius: "20px", height: "200px" }}
          alt="course"
          src={
            // data.picture1 ? `https://api.srvschool.ir${data.picture1}` : NoImage
            data.picture ? data.picture : NoImage
          }
        />
        <CardContent>
          <Typography
            variant="body1"
            fontWeight={400}
            fontSize="15px"
            color="text"
            mb={1}
          >
            {data.name}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="subtitle1"
              color={data.price ? "text.secondary" : "text"}
              fontFamily="iranyekanFn"
              fontWeight={500}
              fontSize="14px"
              sx={{
                textDecoration: !data.price ? "line-through" : "initial",
                color: data.price ? "#000" : "#666",
              }}
            >
              {data.price?.toLocaleString()} تومان
            </Typography>
            {data.price2 && (
              <Typography
                variant="subtitle1"
                fontFamily="iranyekanFn"
                fontWeight={500}
                fontSize="14px"
                color="error"
              >
                {data.price2?.toLocaleString()} تومان
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Link>
      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="contained"
          sx={{
            boxShadow: "none",
            borderRadius: "30px",
            padding: "4px 20px",
          }}
          onClick={() => navigate("/panel/course/details/" + data.course_id)}
        >
          توضیحات دوره
        </Button>
        <Chip
          label={
            <Stack direction="row" spacing={1} alignItems="center" color="#999">
              <Typography
                color="text.secondary"
                fontSize="14px"
                fontFamily="iranyekanFn"
                fontWight={400}
              >
                {data.max - data.course_sCount}
              </Typography>
              <PeopleOutlineIcon fontSize="small" />
            </Stack>
          }
        />
      </Stack>
    </Card>
  );
};

export default CourseCard;
