import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";
import CreateLive from "../../../components/dashboard/teacher/createLive";
import Loader from "../../../components/site/shared/Loader";
import { ToastContainer } from "react-toastify";
import { DefiContext } from "../../../context/DefiContext";

const Live = () => {
  const { auth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { reload } = useContext(DefiContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get("live/getmeetings", {
        headers: { Authorization: `Bearer ${auth}` },
      });
      const data = await response.data;
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, [reload]);

  const joinToMeeting = async (cid) => {
    try {
      const response = await axios.post(
        "live/join/",
        {
          id: cid,
          name: user.first_name + " " + user.last_name,
        },
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      window.location.replace(response.data);
    } catch (err) {
      console.log(err);
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
      <Grid container mt={3}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            component="h4"
            variant="h6"
            color="mainText"
            fontWeight={500}
          >
            پخش زنده
          </Typography>
          <CreateLive />
        </Grid>
        <Grid item xs={12}>
          {data.length > 0 ? (
            <Card
              sx={{
                boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
                borderRadius: "15px",
                padding: 2,
                marginTop: "1rem",
              }}
            >
              {data.map((item) => (
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between" }}
                  key={item.id}
                >
                  <Typography>نام دوره : {item.name}</Typography>
                  <Button onClick={() => joinToMeeting(item.id)}>
                    ورود به کلاس
                  </Button>
                </Stack>
              ))}
            </Card>
          ) : (
            <Typography variant="h5" color="#999" textAlign="center" mt={8}>
              کلاس آنلاینی ایجاد نکرده اید
            </Typography>
          )}
        </Grid>
      </Grid>
      <ToastContainer rtl={true} />
    </Container>
  );
};

export default Live;
