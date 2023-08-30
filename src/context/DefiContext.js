import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const DefiContext = createContext({});

const DefiProvider = ({ children }) => {
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
    // fetchData();
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
