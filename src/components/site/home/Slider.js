import React, { useState, useEffect } from "react";
import axios from "axios";

import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Slider = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get("slider/");
      const data = await response.data;
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <Swiper
      className="slider"
      modules={[Pagination, Navigation]}
      spaceBetween={0}
      slidesPerView={1}
      pagination={{ clickable: true }}
      navigation={true}
      loop={true}
    >
      {/* {data.map((item) => (
        <SwiperSlide key={item.id}>
          <a href={item?.link}>
            <img
              src={`https://api.srvschool.ir${item?.picture}`}
              alt="slider"
              style={{ maxWidth: "100%", borderRadius: "5px" }}
            />
          </a>
        </SwiperSlide>
      ))} */}
    </Swiper>
  );
};

export default Slider;
