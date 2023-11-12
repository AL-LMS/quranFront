import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/site/shared/Loader";
import { toastify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import { classData } from "./courseData";

const PackageDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(classData);
  const [loading, setLoading] = useState(false);
  const { auth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        `package/normalPackageCourse?p_id=${id}`
      );
      const data = await response.data;
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const addToCart = () => {
    if (user?.pk) {
      try {
        setLoading(true);
        const response = axios.post(
          "dashboard/basket",
          [{ buyID: +id, type: "normal" }],
          {
            headers: { Authorization: `Bearer ${auth}` },
          }
        );
        toastify("success-login", "پکیج به سبد خرید شما اضافه شد");
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    } else {
      setLoading(false);
      navigate("/panle/profile");
    }
  };

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
            <Loader />
          </Grid>
        </Grid>
      </Container>
    );

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
              padding: 2,
              borderRadius: "15px",
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              color="mainText"
              fontWeight={500}
            >
              {data[0]?.package_name}
            </Typography>
            <Grid container mt={2}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography color="mainText">لیست دوره های پکیج</Typography>
                  </Grid>
                  {data.map((item) => (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      key={item.id}
                      sx={{ borderRight: "1px solid #ccc" }}
                    >
                      <Stack direction="row" justifyContent="space-between">
                        <Typography>{item.course_name}</Typography>
                        <Link to={`/course/details/${item.courseID}`}>
                          <Button>جزییات دوره</Button>
                        </Link>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  onClick={addToCart}
                  sx={{
                    boxShadow: "none",
                    borderRadius: "5px",
                    padding: "10px 24px",
                    float: "right",
                  }}
                >
                  افزودن به سبد خرید
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default PackageDetails;
