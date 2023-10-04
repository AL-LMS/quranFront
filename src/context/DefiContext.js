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
  useEffect(() => {}, []);
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
