import React, { useState } from "react";
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import useAuth from "../../../../hooks/useAuth";

const Question = ({ data, setAnswers, id }) => {
  const { user } = useAuth();
  const [javab, setJavab] = useState("");
  const changeHandler = (e) => {
    setJavab(e.target.value);
    setAnswers((prevState) => [
      ...prevState,
      {
        result: e.target.id,
        quizheader: +id,
        quizQuestion: data.id,
        student: user.pk,
      },
    ]);
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: 4 }}>
      <FormLabel sx={{ color: "#014361", marginBottom: 2 }} id={data.id}>
        <img
          src={`https://api.srvschool.ir${data.question}`}
          alt="q"
          style={{ width: "320px", display: "block", margin: "0 auto" }}
        />
        {data.title}
      </FormLabel>
      <RadioGroup
        aria-labelledby={data.id}
        value={javab}
        onChange={changeHandler}
        sx={{ marginBottom: 4 }}
      >
        <FormControlLabel
          value={1}
          control={<Radio id={1} />}
          name={data.id}
          label="گزیه 1"
          sx={{ color: "#014361" }}
        />
        <FormControlLabel
          value={2}
          control={<Radio id={2} />}
          label="گزیه 2"
          name={data.id}
          sx={{ color: "#014361" }}
        />
        <FormControlLabel
          value={3}
          control={<Radio id={3} />}
          label="گزیه 3"
          name={data.id}
          sx={{ color: "#014361" }}
        />
        <FormControlLabel
          value={4}
          control={<Radio id={4} />}
          label="گزیه 4"
          name={data.id}
          sx={{ color: "#014361" }}
        />
      </RadioGroup>
      <Divider />
    </FormControl>
  );
};

export default Question;
