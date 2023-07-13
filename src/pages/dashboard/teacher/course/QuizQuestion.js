import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { Container } from "@mui/system";
import useAuth from "../../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import {
  Card,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import NoDataImage from "../../../../assets/img/no-data.png";
import Loading from "../../../../components/site/shared/Loader";
import NewQuestionExam from "../../../../components/dashboard/teacher/course/NewQuestionExam";
import DeleteQuestionExam from "../../../../components/dashboard/teacher/course/DeleteQuestionExam";
import { ToastContainer } from "react-toastify";
import EditQuestionExam from "../../../../components/dashboard/teacher/course/EditQuestionExam";
import { DefiContext } from "../../../../context/DefiContext";

const QuizQuestion = () => {
  const [data, setData] = useState([]);
  const { auth } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { reload } = useContext(DefiContext);
  const [header, setHeader] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`quiz/quizQuestion/?h_id=${id}`, {
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
    const fetchHeader = async () => {
      const response = await axios.get(`quiz/quizHeader/?id=${id}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setHeader(response.data);
    };
    fetchHeader();
  }, [reload]);

  if (loading)
    return (
      <Container maxWidth="lg">
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
            سوالات آزمون
          </Typography>
          <NewQuestionExam type="create" header={header} />
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12}>
            <Card
              sx={{
                boxShadow: "0 5px 20px rgba(112,112,112,0.2)",
                borderRadius: "15px",
                padding: 2,
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }}>سوال</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        تصویر سوال
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        پاسخ صحیح
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ textAlign: "center" }}>
                          <img
                            src={`https://api.srvschool.ir${item.question}`}
                            alt="q"
                            style={{ width: "110px", height: "110px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {item.result}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" justifyContent="center">
                            <EditQuestionExam data={item} />
                            <DeleteQuestionExam id={item.id} />
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
              سوالی برای آزمون دوره ثبت نشده است
            </Typography>
          </Grid>
        )}
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default QuizQuestion;
