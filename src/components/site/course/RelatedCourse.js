import React from "react";
import { Grid, Typography } from "@mui/material";
import CourseCard from "../../../components/site/course/CourseCard";

//Swiper
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box } from "@mui/system";

const RelatedCourse = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography
          variant="h6"
          fontWeight={500}
          color="mainText"
          textAlign="center"
        >
          دوره های مرتبط
        </Typography>
      </Grid>
      <Grid item xs={12}>
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
            spaceBetween={40}
            slidesPerView={4}
            navigation
            autoplay={true}
            loop={true}
            rtl={"true"}
          >
            <SwiperSlide>
              <CourseCard />
            </SwiperSlide>
            <SwiperSlide>
              <CourseCard />
            </SwiperSlide>
            <SwiperSlide>
              <CourseCard />
            </SwiperSlide>
            <SwiperSlide>
              <CourseCard />
            </SwiperSlide>
            <SwiperSlide>
              <CourseCard />
            </SwiperSlide>
            <SwiperSlide>
              <CourseCard />
            </SwiperSlide>
          </Swiper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RelatedCourse;
