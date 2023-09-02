import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const DatePickerDialog = ({ open, onClose }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
  };

  const handleSave = () => {
    // You can perform any action with the selectedDate here
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Choose a Date</DialogTitle>
      <input type="date" value={selectedDate} onChange={handleDateChange} />
      <Button onClick={handleSave} variant="contained" color="primary">
        Save
      </Button>
    </Dialog>
  );
};

export default DatePickerDialog;
