import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import {
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

import DateIcon from "../../../../assets/img/schedule.png";
import ScoreIcon from "../../../../assets/img/exam.png";

const QuizList = () => {
  const { auth } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("quiz/totalqH/", {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setData(response.data);
    };
    fetchData();
  }, []);

  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "5px",
        padding: 2,
      }}
    >
      <Typography
        component="h5"
        variant="h6"
        fontWeight={500}
        color="mainText"
        mb={3}
      >
        آزمون های جامع
      </Typography>
      <Divider />
      {data?.length > 0 ? (
        <List>
          {data.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ marginTop: { xs: 4, md: 0 } }}
                  >
                    <img src={DateIcon} alt="date" />
                    <Typography fontFamily="iranyekanFn">
                      {item?.start_data &&
                        new Date(item?.start_data).toLocaleDateString("fa-US")}
                      &nbsp;|&nbsp;
                      {new Date(item?.start_data).toTimeString().slice(0, 5)}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ marginTop: { xs: 4, md: 0 } }}
                  >
                    <img src={ScoreIcon} alt="date" />
                    <Link to={`/panel/quiz/score/${item?.id}`}>
                      <Typography fontFamily="iranyekanFn" color="primary">
                        نتایج آزمون
                      </Typography>
                    </Link>
                  </Stack>
                </Stack>
              }
            >
              <ListItemText>
                <Stack direction="row" spacing={1}>
                  <RadioButtonCheckedIcon color="success" />
                  <Link to={`/panel/quiz/quizt-details/${item.id}`}>
                    <Typography color="mainText">{`${item.description.slice(
                      0,
                      20
                    )}...`}</Typography>
                  </Link>
                </Stack>
                <Typography
                  color="text.secondary"
                  fontFamily="iranyekanFn"
                  sx={{ marginTop: 1 }}
                >
                  {item.quizTime} دقیقه
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary">
          در حال حاضر آزمون جامعی ثبت نشده است
        </Typography>
      )}
    </Card>
  );
};

export default QuizList;
