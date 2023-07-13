import React from "react";
import { Button, Card, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const systemObj = {
  android: { primary: "#61d215", secondary: "#bbed99" },
  ios: { primary: "#666", secondary: "#e8e8e8" },
  windows: { primary: "#1515e9", secondary: "#9a9aff" },
};

const DownloadCard = ({ link, system, peName, icon }) => {
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "25px",
        padding: 2,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        component="span"
        sx={{
          display: "inline-block",
          width: "80px",
          height: "80px",
          borderRadius: "25px",
          textAlign: "center",
          lineHeight: "100px",
          backgroundColor: systemObj[system].secondary,
        }}
      >
        <img src={icon} alt="icon" />
      </Box>
      <Stack sx={{ ml: 2 }}>
        <Typography color="mainText" mb={2} fontSize="17px">
          نسخه {peName}
        </Typography>
        <Typography
          color="text.secondary"
          fontSize={13}
          sx={{ letterSpacing: "9px" }}
          mb={2}
        >
          {system}
        </Typography>
      </Stack>
      <a href={link} style={{ marginRight: "auto" }}>
        <Button
          endIcon={<FileDownloadOutlinedIcon fontSize="large" />}
          sx={{ fontSize: "17px" }}
        >
          دانلود
        </Button>
      </a>
    </Card>
  );
};

export default DownloadCard;
