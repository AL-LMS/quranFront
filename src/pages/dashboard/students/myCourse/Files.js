import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { Container } from "@mui/system";
import {
  Alert,
  AlertTitle,
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
import { useParams } from "react-router-dom";
import Loader from "../../../../components/site/shared/Loader";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import NoDataImage from "../../../../assets/img/no-data.png";

const Files = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(`archive/archiveFiles/?a_id=${id}`, {
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
            فایل های دوره
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Alert
            severity="info"
            sx={{ lineHeight: 3, backgroundColor: "#cfe2ff" }}
          >
            <AlertTitle>توجه</AlertTitle>
            برای باز کردن فایل هایی با پسورد .zip یا .rar لازم است برنامه ی
            winrar را از طریق این لینک دانلود کنید
            https://soft98.ir/software/compress/21-winrar-full.html برای دانلود
            نسخه ی اندروید نیز میتوانید از این لینک استفاده کنید
            <a
              href="https://cafebazaar.ir/app/com.rarlab.rar"
              target="_blank"
              style={{ display: "block" }}
            >
              https://cafebazaar.ir/app/com.rarlab.rar
            </a>
          </Alert>
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
                        توضیحات
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", border: "none" }}>
                        لینک
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ textAlign: "center", border: "none" }}>
                          {item.title}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", border: "none" }}>
                          {item.description}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", border: "none" }}>
                          <Tooltip title="دانلود فایل">
                            <Button>
                              <a href={item.link} download>
                                <FileDownloadOutlinedIcon />
                              </a>
                            </Button>
                          </Tooltip>
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

export default Files;
