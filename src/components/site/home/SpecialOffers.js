import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import PackageCard from "../packages/PackageCard";

import Gift from "../../../assets/img/gift.png";

const SpecialOffers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get("package/normalPackage");
      const data = await response.data;
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return null;

  if (data.length < 4) return null;

  return (
    <Grid
      container
      spacing={2}
      sx={{ background: "#fec101", borderRadius: "15px", padding: 1 }}
    >
      <Grid
        item
        xs={12}
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography fontSize="1rem" fontWeight={500} color="#fff">
          پیشنهادات ویژه
        </Typography>
        <Link to="/packages">
          <Typography color="#fff">دیدن همه</Typography>
        </Link>
      </Grid>
      <Grid
        item
        xs={2}
        sx={{ display: { xs: "none", md: "initial" }, position: "relative" }}
      >
        <Box
          sx={{
            position: "relative",
            padding: 2,
            borderRadius: "0 0 40px 40px",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            top: "-24px",
          }}
        >
          <Typography
            variant="h5"
            color="text"
            fontWeight={500}
            mb={1}
            textAlign="center"
          >
            پیشنهادات
          </Typography>
          <Typography
            variant="h5"
            color="secondary"
            fontWeight={500}
            mb={3}
            textAlign="center"
          >
            ویژه
          </Typography>
          <img
            src={Gift}
            alt="gift"
            style={{
              maxWidth: "100%",
              width: "80px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Box>
        <Link to="/packages" style={{ position: "absolute", bottom: 1 }}>
          <Typography color="#fff">دیدن همه</Typography>
        </Link>
      </Grid>
      <Grid item xs={12} md={10}>
        <Box className="carousel-slider" component="div">
          <Swiper
            breakpoints={{
              990: {
                width: 990,
                slidesPerView: 4,
              },
              768: {
                width: 768,
                slidesPerView: 2,
              },
              360: {
                width: 350,
                slidesPerView: 1.3,
                spaceBetween: 20,
              },
            }}
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={4}
            autoplay={true}
            loop={true}
            rtl={"true"}
          >
            {/* {data.map((item) => (
              <SwiperSlide key={item.id}>
                <PackageCard data={item} />
              </SwiperSlide>
            ))} */}
          </Swiper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SpecialOffers;
