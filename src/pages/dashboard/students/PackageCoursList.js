import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Container } from "@mui/system";
import {
  Grid,
  Typography,
  Stack,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Card,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import Loading from "../../../components/site/shared/Loader";
import { useParams } from "react-router-dom";

import NoDataImage from "../../../assets/img/no-data.png";
import NewPackageCourse from "../../../components/dashboard/students/package/NewPackageCourse";
import DeletePackage from "../../../components/dashboard/students/package/DeletePackage";
import { useContext } from "react";
import { DefiContext } from "../../../context/DefiContext";

const PackageCourseList = () => {
  const { auth } = useAuth();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { reload } = useContext(DefiContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        `package/studentPackageCourse?p_id=${id}`,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      const data = await response.data;
      setData(data);
      setLoading(false);
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
              display: "flex",
              alignITems: "center",
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
            color="#061b64"
            fontWeight={500}
          >
            دروس پکیج
          </Typography>
          <NewPackageCourse type="create" />
        </Grid>
        {data.length > 0 ? (
          <Grid item xs={12}>
            <Card
              sx={{
                padding: 2,
                boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
                borderRadius: "5px",
              }}
            >
              <TableContainer sx={{ padding: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ border: "none", fontSize: "16px" }}>
                        نام دوره
                      </TableCell>
                      <TableCell sx={{ border: "none", fontSize: "16px" }}>
                        نام پکیج
                      </TableCell>
                      <TableCell
                        sx={{ border: "none", fontSize: "16px" }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item) => (
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
                        <TableCell sx={{ border: "none" }}>
                          {item.course_name}
                        </TableCell>
                        <TableCell sx={{ border: "none" }}>
                          {item.package_name}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "none",
                          }}
                        >
                          <Stack direction="row" justifyContent="flex-end">
                            <DeletePackage
                              type="coursePackages"
                              id={item.id}
                              url="package/studentPackageCourse"
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
              شما درسی را ثبت نکرده اید
            </Typography>
          </Grid>
        )}
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default PackageCourseList;
