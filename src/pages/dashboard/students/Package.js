import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import {
  Grid,
  Typography,
  Card,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Stack,
  Button,
  Tooltip,
} from "@mui/material";
import { Container } from "@mui/system";
import Loader from "../../../components/site/shared/Loader";

import NoDataImage from "../../../assets/img/no-data.png";
import NewPackage from "../../../components/dashboard/students/package/NewPackage";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import DeletePackage from "../../../components/dashboard/students/package/DeletePackage";
import AddToCartPackage from "../../../components/dashboard/students/package/AddToCartPackage";
import { useContext } from "react";
import { DefiContext } from "../../../context/DefiContext";

const Package = () => {
  const { auth, user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { reload } = useContext(DefiContext);
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      const response = await axios.get(
        `package/studentPackage?s_id=${user.pk}`,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      setData(response.data);
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
            component="h5"
            variant="h6"
            fontWeight={500}
            color="mainText"
          >
            پکیج ها
          </Typography>
          <NewPackage type="create" />
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
                        عنوان
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
                          {item.name}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "none",
                          }}
                        >
                          <Stack direction="row" justifyContent="flex-end">
                            <AddToCartPackage id={item.id} />
                            <NewPackage type="edit" data={item} />
                            <Tooltip title="لیست دروس">
                              <Link to={`/panel/packages/course/${item.id}`}>
                                <Button>
                                  <FormatListNumberedRtlIcon />
                                </Button>
                              </Link>
                            </Tooltip>
                            <DeletePackage
                              type="package"
                              id={item.id}
                              url="package/studentPackage"
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
              شما پکیجی را ثبت نکرده اید
            </Typography>
          </Grid>
        )}
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Package;
