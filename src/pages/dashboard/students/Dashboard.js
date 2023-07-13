import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import Notification from "../../../components/dashboard/students/dashboard/Notification";
import HomeWorks from "../../../components/dashboard/students/dashboard/HomeWorks";
import Loader from "../../../components/site/shared/Loader";

const Dashboard = () => {
  const { auth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notis, setNotis] = useState([]);
  const [device, setDevice] = useState({
    ip: "",
    device: "",
    user: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        `notification/student/?s_id=${user.pk}`,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
      const data = await response.data;
      setNotis(data);
      setLoading(false);
    };
    fetchData();
    const giveIP = async () => {
      const response = await axios.get("https://api.ipify.org/");
      setDevice({
        ip: response.data,
        device: window.navigator.userAgentData.platform,
        user: user.pk,
      });
    };
    giveIP();
  }, []);

  useEffect(() => {
    const diviceSend = async () => {
      const response = await axios.post("authen/user_ip/", device, {
        headers: { Authorization: `Bearer ${auth}` },
      });
    };
    if (device.ip && device.user && device.device) {
      diviceSend();
    }
  }, [device]);

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

  console.log(device);

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
            پیام های جدید
          </Typography>
        </Grid>
        {notis?.length > 0 ? (
          notis.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Notification data={item} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12} mb={3}>
            <Typography color="text.secondary" textAlign="center">
              نوتیفیکیشنی برای نمایش وجود ندارد
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
