import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import {
  Button,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { Link, useParams } from "react-router-dom";
import Loader from "../../../../components/site/shared/Loader";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import NoDataImage from "../../../../assets/img/no-data.png";

const CourseTag = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        `archive/archiveOfflineHeader/?c_id=${id}`,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      const data = await response.data;
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <Container maxWidth="lg">
        <Grid container>
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
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Typography
            component="h5"
            variant="h6"
            fontWeight={500}
            color="mainText"
          >
            مباحث دوره
          </Typography>
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12}>
            <Card
              sx={{
                boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
                padding: 2,
                borderRadius: "15px",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center", border: "none" }}>
                        عنوان
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", border: "none" }}>
                        نام دوره
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", border: "none" }}>
                        توضیحات
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", border: "none" }}>
                        <MoreHorizIcon />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.key}>
                        <TableCell sx={{ textAlign: "center", border: "none" }}>
                          {item.title}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", border: "none" }}>
                          {item.courseName}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", border: "none" }}>
                          {item.description}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", border: "none" }}>
                          <Link to={`/panel/my-course/tags/file/${item.id}`}>
                            <Tooltip title="قایل ها">
                              <Button>
                                <InsertDriveFileOutlinedIcon />
                              </Button>
                            </Tooltip>
                          </Link>
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
              فایلی برای این مبحث ثبت نشده است
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default CourseTag;
