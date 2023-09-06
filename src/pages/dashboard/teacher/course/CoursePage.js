import React from "react";
import { useParams } from "react-router-dom";

const CoursePage = () => {
  const { id } = useParams();
  return <div>CoursePage</div>;
};

export default CoursePage;
