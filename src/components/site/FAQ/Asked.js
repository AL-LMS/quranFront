import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Asked = ({ active, title, text }) => {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Accordion
      expanded={expanded === active}
      onChange={handleChange(active)}
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "20px",
      }}
    >
      <AccordionSummary
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
        aria-controls={active}
        id={active}
      >
        <Typography color="text.secondary">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography component="p" variant="subtitle2">
          {text}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default Asked;
