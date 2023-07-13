import React, { useState, useContext } from "react";
import { DefiContext } from "../../../context/DefiContext";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect } from "react";

const Filter = ({ setParams,query,setQuery }) => {
  const [filter, setFilter] = useState({
    dep: "",
    grade: "",
    year: "",
    course_type: "",
    lesson: "",
    teacher: "",
  });
  const { departmentID, courseTypeID, lessonID, gradeID, yearID } =
    useContext(DefiContext);

  useEffect(() => {
    setParams(query);
  }, [query]);
  const changeHandler = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const resetFilter = () => {
    setFilter({
      dep: "",
      grade: "",
      year: "",
      course_type: "",
      lesson: "",
    });
    setQuery({page:1});
  };
  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        padding: 2,
        borderRadius: "25px",
      }}
    >
      <CardHeader
        title={
          <Chip
            color="secondary"
            sx={{ color: "#fff", fontSize: "1rem" }}
            label="فیلتر"
          />
        }
        sx={{ padding: "10px 3px" }}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              size="small"
              sx={{ boxShadow: "0 5px 15px rgba(112,112,112,0.2)" }}
            >
              <InputLabel id="dep">رشته تحصیلی</InputLabel>
              <Select
                name="dep"
                value={filter.dep}
                id="dep"
                onChange={changeHandler}
                label="رشته تحصیلی"
              >
                {departmentID.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              size="small"
              sx={{ boxShadow: "0 5px 15px rgba(112,112,112,0.2)" }}
            >
              <InputLabel id="grade">مقطع تحصیلی</InputLabel>
              <Select
                name="grade"
                value={filter.grade}
                id="grade"
                onChange={changeHandler}
                label="مقطع تحصیلی"
              >
                {gradeID.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              size="small"
              sx={{ boxShadow: "0 5px 15px rgba(112,112,112,0.2)" }}
            >
              <InputLabel id="year">سال تحصیلی</InputLabel>
              <Select
                name="year"
                value={filter.year}
                id="year"
                onChange={changeHandler}
                label="سال تحصیلی"
              >
                {yearID.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              size="small"
              sx={{ boxShadow: "0 5px 15px rgba(112,112,112,0.2)" }}
            >
              <InputLabel id="course_type">نوع دوره</InputLabel>
              <Select
                name="course_type"
                value={filter.course_type}
                id="course_type"
                onChange={changeHandler}
                label="نوع دوره"
              >
                {courseTypeID.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              size="small"
              sx={{ boxShadow: "0 5px 15px rgba(112,112,112,0.2)" }}
            >
              <InputLabel id="lesson">درس</InputLabel>
              <Select
                name="lesson"
                value={filter.lesson}
                id="lesson"
                onChange={changeHandler}
                label="درس"
              >
                {lessonID.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              variant="contained"
              sx={{ color: "#fff", boxShadow: "none" }}
              fullWidth
              onClick={resetFilter}
            >
              پاک کردن فیلتر
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Filter;
