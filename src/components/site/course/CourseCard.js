import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";

import NoImage from "../../../assets/img/no-img.png";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

const CourseCard = ({ data }) => {
  return (
    <Link to={`/panel/course/details/${data[0]}`}>
      <Card
        sx={{
          boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
          borderRadius: "25px",
          padding: 1,
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: "100%", borderRadius: "20px", height: "200px" }}
          alt="course"
          src={
            // data.picture1 ? `https://api.srvschool.ir${data.picture1}` : NoImage
            data.picture1 ? data.picture1 : NoImage
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
            {data[6]}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="subtitle1"
              color={data.price2 ? "text.secondary" : "text"}
              fontFamily="iranyekanFn"
              fontWeight={500}
              fontSize="14px"
              sx={{
                textDecoration: data.price2 ? "line-through" : "initial",
                color: data.price2 ? "#ccc" : "#666",
              }}
            >
              {data[15]?.toLocaleString()} تومان
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
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            sx={{
              boxShadow: "none",
              borderRadius: "30px",
              padding: "4px 20px",
            }}
          >
            خرید دوره
          </Button>
          <Chip
            label={
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                color="#999"
              >
                <Typography
                  color="text.secondary"
                  fontSize="14px"
                  fontFamily="iranyekanFn"
                  fontWight={400}
                >
                  {data[14]}
                </Typography>
                <PeopleOutlineIcon fontSize="small" />
              </Stack>
            }
          />
        </Stack>
      </Card>
    </Link>
  );
};

export default CourseCard;
