import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Stack } from "@mui/system";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";

const Notification = ({ data }) => {
  const { auth, user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const readHandler = async () => {
    try {
      const response = await axios.delete("notification/student/", {
        data: { s_id: user.pk },
        headers: { Authorization: `Bearer ${auth}` },
      });
      const data = await response.data;
    } catch (err) {}
  };

  return (
    <Accordion
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "5px",
      }}
    >
      <AccordionSummary
        onClick={readHandler}
        expandIcon={
          <IconButton
            sx={{
              backgroundColor: "#9126FF",
              borderRadius: "10px",
              padding: "5px",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#9126FF",
              },
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        }
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Stack direction="row" spacing={1}>
          <Chip color="secondary" sx={{ color: "#fff" }} label="پیام جدید" />
          <Typography color="text.secondary">{data.title}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography component="p" variant="subtitle2">
          {data.description}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default Notification;
