import React, { useState } from "react";
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
import { getUrl } from "../../../helper/getUrl";

const Filter = ({ setParams, query, setQuery }) => {
  const [filter, setFilter] = useState({
    course_name: "",
    course_type: "",
    teacher: "",
    topic: "",
  });
  const [courseTypeID, setCourseTypeID] = useState([
    { id: true, name: "مجازی" },
    { id: false, name: "حضوری" },
  ]);
  const [teacherID, setTeacherID] = useState([]);
  const [topicID, setTopicID] = useState([]);
  const [courseName, setCourseName] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const get_teacher_name = await axios({
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          table: "users",
          method_type: "get_teacher_name",
          data: {},
        },
        baseURL: getUrl() + "back_request/select_request/",
      });
      const get_course_name = await axios({
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          table: "users",
          method_type: "get_course_name",
          data: {},
        },
        baseURL: getUrl() + "back_request/select_request/",
      });
      const get_course_type = await axios({
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          table: "users",
          method_type: "get_type_name",
          data: {},
        },
        baseURL: getUrl() + "back_request/select_request/",
      });
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
        borderRadius: "5px",
      }}
    >
      <CardHeader
        title={
          <Chip
            sx={{
              color: "#000",
              fontSize: "1rem",
              borderRadius: "5px",
              fontFamily: "IRANSansWeb_Farsi",
            }}
            label="جستجوی پیشرفته"
          />
        }
        sx={{
          padding: "10px 3px",
          alignItems: "center",
          flexDirection: "column",
        }}
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
              نمایش همه‌ی کلاس‌ها
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Filter;
