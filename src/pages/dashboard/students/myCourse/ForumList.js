import { apiAssetUrl } from "../../../../api/localAssets.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { Link, useParams } from "react-router-dom";
import { Container } from "@mui/system";
import {
  Avatar,
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
import Loading from "../../../../components/site/shared/Loader";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NoDataImage from "../../../../assets/img/no-data.png";
import { ToastContainer } from "react-toastify";

import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

const ForumList = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      const response = await axios.get(`forum/forumHeader/?c_id=${id}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      const data = await response.data;
      setData(data);
      setLoading(false);
    };
    fetchData();
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
            color="mainText"
            fontWeight={500}
          >
            فروم های دوره
          </Typography>
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12} mt={3}>
            <Card
              sx={{
                padding: 2,
                borderRadius: "5px",
                boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }}>تصویر</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>عنوان</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        توضیحات
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <MoreHorizIcon />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Avatar
                            src={apiAssetUrl(`${item?.picture}`)}
                            sx={{ display: "block", margin: "0 auto" }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {item.title}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {item.description}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" justifyContent="center">
                            <Tooltip title="ورود">
                              <Link to={`/panel/my-course/forum/${item.id}`}>
                                <Button>
                                  <OpenInNewOutlinedIcon />
                                </Button>
                              </Link>
                            </Tooltip>
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
              فرومی برای دوره تعریف نشده است
            </Typography>
          </Grid>
        )}
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default ForumList;
