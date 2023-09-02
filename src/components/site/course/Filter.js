import React, { useState, useContext } from "react";
import { DefiContext } from "../../../context/DefiContext";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";

const Filter = ({ setParams, query, setQuery }) => {
  const [filter, setFilter] = useState({
    course_name: "",
    course_type: "",
    teacher: "",
    topic: "",
  });
  const [courseTypeID, setCourseTypeID] = useState([
    { id: 0, name: "مجازی" },
    { id: 1, name: "حضوری" },
  ]);
  const [teacherID, setTeacherID] = useState([]);
  const [topicID, setTopicID] = useState([]);
  const [courseName, setCourseName] = useState([]);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const get_teacher_name = await axios.get(
        "http://127.0.0.1:5000/get_teacher_name/"
      );
      const get_course_name = await axios.get(
        "http://127.0.0.1:5000/get_course_name/"
      );
      const get_course_type = await axios.get(
        "http://127.0.0.1:5000/get_type_name/"
      );
      setTeacherID(get_teacher_name.data);
      setTopicID(get_course_type.data);
      setCourseName(get_course_name.data);
    };
    fetchData();
  }, []);
  useEffect(() => {
    setParams(query);
  }, [query]);
  const changeHandler = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const resetFilter = () => {
    setFilter({});
    setQuery({});
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
              <InputLabel id="course_name">عنوان</InputLabel>
              <Select
                name="course_name"
                value={filter.course_name}
                id="course_name"
                onChange={changeHandler}
                label="عنوان"
              >
                {courseName.map((item) => (
                  <MenuItem key={item.id} value={item.name}>
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
              <InputLabel id="topic">موضوع</InputLabel>
              <Select
                name="topic"
                value={filter.topic}
                id="topic"
                onChange={changeHandler}
                label="موضوع"
              >
                {topicID.map((item) => (
                  <MenuItem key={item.id} value={item.name}>
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
              <InputLabel id="teacher">مدرس</InputLabel>
              <Select
                name="teacher"
                value={filter.teacher}
                id="teacher"
                onChange={changeHandler}
                label="مدرس"
              >
                {teacherID.map((item) => (
                  <MenuItem key={item.id} value={item.name}>
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
