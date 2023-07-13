import React from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import toastify from "../../../../helper/toast";
import { Button } from "@mui/material";

const JoinMeeting = ({ id }) => {
  const { auth, user } = useAuth();
  const joinToMeeting = async () => {
    try {
      const response = await axios.post(
        "live/student_join/",
        {
          id: id,
          name: user.first_name + " " + user.last_name,
        },
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      if (response.data) {
        window.location.replace(response.data);
      } else {
        toastify(
          "error-login",
          "کلاس آنلاینی در این لحظه برای دوره ثبت نشده است"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  return <Button onClick={joinToMeeting}>کلاس آنلاین</Button>;
};

export default JoinMeeting;
