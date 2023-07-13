import React from "react";
import { Button } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useNavigate } from "react-router-dom";

const Back = () => {
  const navigate = useNavigate();
  return (
    <Button
      sx={{
        position: "fixed",
        top: "2rem",
        right: "2rem",
        zIndex: 100000,
        boxShadow: "0 5px 10px rgba(112,112,112,112,0.2)",
      }}
      onClick={() => navigate(-1)}
    >
      <ArrowBackIosNewRoundedIcon />
    </Button>
  );
};

export default Back;
