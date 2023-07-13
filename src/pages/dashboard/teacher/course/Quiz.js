import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { Container } from "@mui/system";
import {
  Button,
  Card,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import DeleteItem from "../../../../components/dashboard/teacher/shared/DeleteItem";
import Loading from "../../../../components/site/shared/Loader";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";

import NoDataImage from "../../../../assets/img/no-data.png";
import { useContext } from "react";
import { DefiContext } from "../../../../context/DefiContext";

const Quiz = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {reload} = useContext(DefiContext)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`quiz/quizHeader/?c_id=${id}`, {
          headers: { Authorization: `Bearer ${auth}` },
        });
        const data = await response.data;
        setData(data);
        setLoading(false);
      } catch (err) {
        if (err.response.status === 404) {
          setLoading(false);
        }
        console.log(err);
      }
    };
    fetchData();
  }, [reload]);
  
  if (loading)
    return (
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12} sx={{ height: "100vh" }}>
            <Loading />
          </Grid>
        </Grid>
      </Container>
    );

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="h6"
            variant="h5"
            color="#061b64"
            fontWeight={500}
          >
            آزمون
          </Typography>
          <Link to={`/panel/course/quiz/new/${id}`}>
            <Button variant="contained" sx={{ boxShadow: "none" }}>
              آزمون جدید
            </Button>
          </Link>
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12}>
            <Card
              sx={{
                boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
                borderRadius: "25px",
                padding: 2,
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ border: "none", textAlign: "center" }}>
                        نام درس
                      </TableCell>
                      <TableCell sx={{ border: "none", textAlign: "center" }}>
                        تعداد سوال
                      </TableCell>
                      <TableCell sx={{ border: "none", textAlign: "center" }}>
                        زمان آزمون
                      </TableCell>
                      <TableCell sx={{ border: "none", textAlign: "center" }}>
                        <MoreHorizIcon />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell
                          sx={{
                            border: "none",
                            textAlign: "center",
                            fontFamily: "iranyekanFn",
                            fontWeight: 500,
                          }}
                        >
                          {item.course_name}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "none",
                            textAlign: "center",
                            fontFamily: "iranyekanFn",
                            fontWeight: 500,
                          }}
                        >
                          {item.question_count}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "none",
                            textAlign: "center",
                            fontFamily: "iranyekanFn",
                            fontWeight: 500,
                          }}
                        >
                          {item.quizTime} دقیقه
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "none",
                            textAlign: "center",
                            fontFamily: "iranyekanFn",
                            fontWeight: 500,
                          }}
                        >
                          <Stack direction="row" justifyContent="center">
                            <Tooltip title="ویرایش">
                              <Link
                                to={`/panel/course/quiz/edit/${id}/${item.id}`}
                              >
                                <Button>
                                  <EditOutlinedIcon />
                                </Button>
                              </Link>
                            </Tooltip>
                            <Tooltip title="لیست سوالات">
                              <Link
                                to={`/panel/course/quiz/questions/${item.id}`}
                              >
                                <Button>
                                  <FormatListNumberedRtlIcon />
                                </Button>
                              </Link>
                            </Tooltip>
                            <DeleteItem
                              type="exam"
                              id={item.id}
                              url="quiz/quizHeader/"
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <img
              src={NoDataImage}
              alt="no-data"
              style={{
                display: "block",
                maxWidth: "100%",
                width: "250px",
                margin: "0 auto",
              }}
            />
            <Typography
              variant="h5"
              textAlign="center"
              mt={3}
              fontWeight={500}
              color="#b8b8b8"
            >
              آزمونی برای دوره ثبت نشده است
            </Typography>
          </Grid>
        )}
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Quiz;
