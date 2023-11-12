import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  Chip,
  Box,
} from "@mui/material";

import CourseImage from "../../../assets/img/package.png";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

const PackageCard = ({ time, data }) => {
  return (
    <Link to={`/packages/details/${data?.id}`}>
      <Card
        sx={{
          boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
          borderRadius: "5px",
          padding: 1,
          position: "relative",
        }}
      >
        <Box
          component="div"
          sx={{ backgroundColor: "#F3E6FF", borderRadius: "5px", padding: 2 }}
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
          >
            {data?.price?.toLocaleString()} تومان
          </Typography>
        </CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            sx={{
              boxShadow: "none",
              borderRadius: "5px",
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

export default PackageCard;
