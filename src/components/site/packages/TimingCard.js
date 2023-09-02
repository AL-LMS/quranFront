import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { miladi_be_shamsi } from "../../../helper/shamsi";

import CourseImage from "../../../assets/img/package.png";

const TimingCard = ({ data }) => {
  return (
    <Link to={`/timing-package/details/${data?.id}`}>
      <Card
        sx={{
          boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
          borderRadius: "25px",
          padding: 1,
          position: "relative",
        }}
      >
        <Box
          component="div"
          sx={{ backgroundColor: "#F3E6FF", borderRadius: "20px", padding: 2 }}
        >
          <img
            src={CourseImage}
            alt="package"
            style={{ maxWidth: "100%", width: "80px" }}
          />
        </Box>
        <CardContent>
          <Chip
            color="error"
            label={`${data?.percent}%`}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              fontFamily: "iranyekanFn",
            }}
          />
          <Typography
            variant="body1"
            fontWeight={400}
            fontSize="15px"
            color="text"
            mb={1}
          >
            {data?.name}
          </Typography>
          <Typography
            variant="body1"
            fontWeight={400}
            fontSize="15px"
            color="text.secondary"
            fontFamily="iranyekanFn"
            mb={1}
          >
            {data?.price?.toLocaleString()} تومان
          </Typography>
          <Stack
            direction="row"
            my={1}
            sx={{ justifyContent: "space-between" }}
          >
            <Typography color="error" fontFamily="iranyekanFn">
              {miladi_be_shamsi(data?.asDate)}
            </Typography>
            <Typography color="error" fontFamily="iranyekanFn">
              {miladi_be_shamsi(data?.toDate)}
            </Typography>
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
            خرید پکیج
          </Button>
        </Stack>
      </Card>
    </Link>
  );
};

export default TimingCard;
