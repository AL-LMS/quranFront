import React, { useState, useEffect } from "react";
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Stack,
  Card,
} from "@mui/material";

import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";

const ReportList = ({ header }) => {
  const { auth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchHeader = async () => {
      setLoading(true);
      const response = await axios.get(
        `quiz/studentres/?h_id=${header.id}&s_id=${user.pk}`,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      setData(response.data);
      setLoading(false);
    };
    fetchHeader();
  }, [header]);

  if (!header)
    return (
      <Typography textAlign="center">آزمونی برای دوره ثبت نشده</Typography>
    );
  if (loading) return null;

  return (
    <Card
      sx={{
        padding: 2,
        borderRadius: "5px",
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        overflow: "initial",
      }}
    >
      <Typography color="text.secondary" textAlign="center">
        آزمون درس {header.course_name}
      </Typography>
      <List>
        <ListItem
          secondaryAction={
            <Typography
              color="text.secondary"
              fontFamily="iranyekanFn"
              fontSize="15px"
              fontWeight={400}
            >
              {header?.start_data &&
                new Date(header?.start_data).toLocaleDateString("fa-US")}
              |{new Date(header.start_data).toTimeString().slice(0, 5)}
            </Typography>
          }
        >
          <ListItemText
            primary={
              <Stack direction="row" spacing={1}>
                <RadioButtonCheckedOutlinedIcon color="success" />
                <Typography>زمان شروع:</Typography>
              </Stack>
            }
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <Typography
              color="text.secondary"
              fontFamily="iranyekanFn"
              fontSize="15px"
              fontWeight={400}
            >
              {header?.end_data &&
                new Date(header?.end_data).toLocaleDateString("fa-US")}
              |{new Date(header.end_data).toTimeString().slice(0, 5)}
            </Typography>
          }
        >
          <ListItemText
            primary={
              <Stack direction="row" spacing={1}>
                <RadioButtonCheckedOutlinedIcon color="success" />
                <Typography>زمان پایان:</Typography>
              </Stack>
            }
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <Typography
              fontFamily="iranyekanFn"
              fontSize="15px"
              fontWeight={400}
            >
              {data.q_count}
            </Typography>
          }
        >
          <ListItemText
            primary={
              <Stack direction="row" spacing={1}>
                <RadioButtonCheckedOutlinedIcon color="success" />
                <Typography>تعداد سوال</Typography>
              </Stack>
            }
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <Typography
              fontFamily="iranyekanFn"
              fontSize="15px"
              fontWeight={400}
              color={data.correct_count < 10 ? "error" : "text"}
            >
              {data.correct_count}
            </Typography>
          }
        >
          <ListItemText
            primary={
              <Stack direction="row" spacing={1}>
                <RadioButtonCheckedOutlinedIcon color="success" />
                <Typography>پاسخ صحیح شما</Typography>
              </Stack>
            }
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <Typography
              color={data.correct_count < 10 ? "error" : "text"}
              fontFamily="iranyekanFn"
              fontSize="15px"
              fontWeight={400}
            >
              {data.correct_count} از {data.q_count}
            </Typography>
          }
        >
          <ListItemText
            primary={
              <Stack direction="row" spacing={1}>
                <RadioButtonCheckedOutlinedIcon color="success" />
                <Typography>نمره کسب شده:</Typography>
              </Stack>
            }
          />
        </ListItem>
      </List>
    </Card>
  );
};

export default ReportList;
