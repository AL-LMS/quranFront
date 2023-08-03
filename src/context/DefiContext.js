import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const DefiContext = createContext({});

const DefiProvider = ({ children }) => {
  const [departmentID, setDepartmentID] = useState([]);
  const [courseTypeID, setCourseTypeID] = useState([]);
  const [lessonID, setLessonID] = useState([]);
  const [gradeID, setGradeID] = useState([]);
  const [yearID, setyearID] = useState([]);
  const [course, setCourse] = useState([]);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    // const fetchData = async () => {
    //   const gradeResponse = await axios.get("courseDEP/grade/");
    //   const departmentResponse = await axios.get("courseDEP/department/");
    //   const yearResponse = await axios.get("courseDEP/year/");
    //   const lessonResponse = await axios.get("courseDEP/lesson/");
    //   const courseResponse = await axios.get("courseDEP/course/");
    //   const courses = await axios.get("course/course/");
    //   setDepartmentID(departmentResponse.data);
    //   setCourseTypeID(courseResponse.data);
    //   setLessonID(lessonResponse.data);
    //   setGradeID(gradeResponse.data);
    //   setyearID(yearResponse.data);
    //   setCourse(courses.data);
    // };
    // fetchData();
  }, []);
  return (
    <DefiContext.Provider
      value={{
        departmentID,
        courseTypeID,
        lessonID,
        gradeID,
        yearID,
        course,
        setReload,
        reload,
      }}
    >
      {children}
    </DefiContext.Provider>
  );
};

export default DefiProvider;
