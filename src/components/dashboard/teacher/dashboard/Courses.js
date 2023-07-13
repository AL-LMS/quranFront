import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import CircleIcon from "../../../../assets/img/circle-small.svg";

const Courses = () => {
  const { auth, user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(`course/teacherCourse/?id=${user.pk}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setData(response.data.slice(0,3));
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Typography>درحال بارگزاری...</Typography>;

  return (
    <Card
      sx={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "25px",
        padding: 2,
      }}
    >
      <Typography variant="h6" color="mainText" fontWeight={500}>
        دوره های من
      </Typography>
      <Grid container spacing={4}>
        {data.length > 0 ? (
          data.map((item) => (
            <Grid item xs={12} mt={3} md={6} key={item.id}>
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" spacing={1}>
                  <img src={CircleIcon} alt="circle" />
                  <Typography color="mainText" fontWeight={400}>
                    {item.name}
                  </Typography>
                </Stack>
                <Typography
                  fontFamily="iranyekanFn"
                  color={item.active ? "success.main" : "error"}
                >
                  {item.active ? "فعال" : "غیرفعال"}
                </Typography>
              </Stack>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h5" color="#888" textAlign="center">
              درحال حاضر دوره ای برای شما ثبت نشده
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to="/panel/my-coures">
            <Button>مشاهده همه دوره ها</Button>
          </Link>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Courses;
