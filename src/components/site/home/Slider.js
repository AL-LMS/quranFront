import React, { useState, useEffect } from "react";
import axios from "axios";

import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import x1 from "../../../assets/img/blog1.jpg";
import x2 from "../../../assets/img/blog2.jpg";
import x3 from "../../../assets/img/blog3.jpg";
import x4 from "../../../assets/img/blog4.png";

const Slider = () => {
  const [data, setData] = useState([
    { image: x1, id: 1, link: "111111" },
    { image: x2, id: 2, link: "111111" },
    { image: x3, id: 3, link: "111111" },
    { image: x4, id: 4, link: "111111" },
  ]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     const response = await axios.get("slider/");
  //     const data = await response.data;
  //     setData(data);
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, []);

  if (loading) return null;

  return (
    <Swiper
      className="slider"
      modules={[Pagination, Navigation]}
      spaceBetween={0}
      slidesPerView={1}
      pagination={{ clickable: true }}
      // navigation={true}
      loop={true}
    >
      {data.map((item) => (
        <SwiperSlide key={item.id}>
          <div>
            <a href={item?.link}>
              <img
                // src={`https://api.srvschool.ir${item?.picture}`}
                src={item.image}
                alt="slider"
                style={{
                  maxWidth: "100%",
                  borderRadius: "5px",
                }}
              />
            </a>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
