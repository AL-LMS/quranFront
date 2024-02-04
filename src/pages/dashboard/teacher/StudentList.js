import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { convert_gender } from "../../../helper/converter";
import Loader from "../../../components/site/shared/Loader";
import toastify from "../../../helper/toast";
import axios from "axios";
import { getUrl } from "../../../helper/getUrl";
import NoDataImage from "../../../assets/img/no-data.png";

const StudentList = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data_students, setData] = useState([]);
  const get_teacher_info = async () => {
    setLoading(true);
    let data = {
      table: "courses",
      method_type: "get_course_students",
      data: {
        course_id: id,
      },
    };
    let response = await axios({
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: {
        ...data,
      },

      baseURL: getUrl() + "back_request/select_request/",
    });
    if (response?.data?.tracking_code !== null) {
      setData(response?.data?.response?.students);
    } else {
      toastify("error-login", response?.data?.error);
    }
  };
  useEffect(() => {
    get_teacher_info().then(() => {
      setLoading(false);
    });
  }, []);
  if (loading)
    return (
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Loader />
          </Grid>
        </Grid>
      </Container>
    );

  return (
    <Card
      sx={{
        padding: 2,
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "5px",
        marginTop: "1rem",
        marginRight: "2rem",
        marginLeft: "2rem",
      }}
    >
      {data_students?.length > 0 ? (
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
                ردیف
              </TableCell>
              <TableCell
                sx={{
                  border: "none",
                  fontSize: "16px",
                  textAlign: "center",
                }}
              >
                نام
              </TableCell>
              <TableCell
                sx={{
                  border: "none",
                  fontSize: "16px",
                  textAlign: "center",
                }}
              >
                جنسیت
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data_students.map((item, index) => (
              <TableRow
                key={item.id}
                sx={{
                  transition: "0.3s",
                  borderRadius: "5px",
                  "&:hover": {
                    boxShadow: "0 5px 15px rgba(112,112,112,0.3)",
                  },
                }}
              >
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ border: "none", textAlign: "center" }}>
                  {item.name}
                </TableCell>
                <TableCell
                  sx={{
                    border: "none",
                    fontFamily: "iranyekanFn",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {convert_gender(item.sex)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
              اطلاعاتی یافت نشد
            </Typography>
          </Grid>
      )}
    </Card>
  );
};

export default StudentList;
