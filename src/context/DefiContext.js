import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const DefiContext = createContext({});

const DefiProvider = ({ children }) => {
  const [departmentID, setDepartmentID] = useState([
    { id: 0, name: "حفظ" },
    { id: 1, name: "ترتیل" },
    { id: 2, name: "قرائت" },
  ]);
  const [courseTypeID, setCourseTypeID] = useState([
    { id: 0, name: "مجازی" },
    { id: 1, name: "حضوری" },
  ]);
  const [teacherID, setTeacherID] = useState([]);
  const [topicID, setTopicID] = useState([]);
  const [yearID, setyearID] = useState([]);
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
      // const departmentResponse = await axios.get("courseDEP/department/");
      // const yearResponse = await axios.get("courseDEP/year/");
      // const lessonResponse = await axios.get("courseDEP/lesson/");
      // const courseResponse = await axios.get("courseDEP/course/");
      // const courses = await axios.get("course/course/");
      // setDepartmentID(departmentResponse.data);
      // setCourseTypeID(courseResponse.data);
      setTeacherID(get_teacher_name.data);
      setTopicID(get_course_type.data);
      setCourseName(get_course_name.data);
      // setCourse(courses.data);
    };
    fetchData();
  }, []);
  return (
    <DefiContext.Provider
      value={{
        courseTypeID,
        teacherID,
        topicID,
        courseName,
        setReload,
        reload,
      }}
    >
      {children}
    </DefiContext.Provider>
  );
};

export default DefiProvider;
