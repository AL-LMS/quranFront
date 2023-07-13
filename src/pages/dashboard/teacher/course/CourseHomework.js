import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { Container } from "@mui/system";
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
import CourseHomeworkForm from "../../../../components/dashboard/teacher/course/CourseHomeworkForm";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteItem from "../../../../components/dashboard/teacher/shared/DeleteItem";
import Loader from "../../../../components/site/shared/Loader";
import { ToastContainer } from "react-toastify";

import NoDataImage from "../../../../assets/img/no-data.png";
import { miladi_be_shamsi } from "../../../../helper/shamsi";
import {DefiContext} from "../../../../context/DefiContext"

const CourseHomework = () => {
  const { auth } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const {reload} = useContext(DefiContext)

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`course/coursehw/?id=${id}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      const data = await response.data;
      setData(data);
      setLoading(false);
      console.log(response.data);
    };
    fetchData();
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
            <Loader />
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
            component="h4"
            variant="h6"
            fontWeight={500}
            color="mainText"
          >
            تکالیف
          </Typography>
          <CourseHomeworkForm type="create" />
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12}>
            <Card
              sx={{
                padding: 2,
                boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
                borderRadius: "30px",
              }}
            >
              <TableContainer sx={{ padding: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          border: "none",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        عنوان
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "none",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        توضیحات
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "none",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        مهلت
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "none",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        <MoreHorizIcon color="#eee" />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{
                          transition: "0.3s",
                          borderRadius: "20px",
                          "&:hover": {
                            boxShadow: "0 5px 15px rgba(112,112,112,0.3)",
                          },
                        }}
                      >
                        <TableCell sx={{ border: "none", textAlign: "center" }}>
                          {item.title}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "none",
                            fontFamily: "iranyekanFn",
                            fontWeight: 500,
                            textAlign: "center",
                          }}
                        >
                          {item.description}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "none",
                            fontFamily: "iranyekanFn",
                            fontWeight: 500,
                            textAlign: "center",
                          }}
                        >
                          {miladi_be_shamsi(item?.endDateTime)}
                        </TableCell>
                        <TableCell sx={{ border: "none", textAlign: "center" }}>
                          <Stack direction="row" justifyContent="center">
                            <CourseHomeworkForm type="edit" data={item} />
                            <DeleteItem
                              id={item.id}
                              url="course/courseHomeWork/"
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
                width: "220px",
                height: "220px",
                display: "block",
                margin: "0 auto",
              }}
            />
            <Typography
              variant="h5"
              color="#ccc"
              fontWeight={500}
              textAlign="center"
              marginTop={1}
            >
              تکلیفی برای دوره ثبت نشده است
            </Typography>
          </Grid>
        )}
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default CourseHomework;
