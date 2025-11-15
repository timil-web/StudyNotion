import React from 'react'
import "../../../App.css"

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation, HashNavigation } from 'swiper/modules';


import Course_Card from './Course_Card'  // Updated component name

const CourseSlider = ({ Courses }) => {
  return (
    <>
      {Courses?.length ? (
        <Swiper           
			hashNavigation={{
			watchState: true,
			}}
			pagination={{
			clickable: true,
			}}
			navigation={true}
			modules={[Pagination, Navigation, HashNavigation]}
			className="mySwiper"
			breakpoints={{
				// Mobile devices
				320: {
				slidesPerView: 1,
				spaceBetween: 10,
				},
				// Tablets
				640: {
				slidesPerView: 2,
				spaceBetween: 20,
				},
				// Desktops
				1024: {
				slidesPerView: 3,
				spaceBetween: 30,
				},
            }}
        >
          {
		    Courses?.map((course, i) => (
              <SwiperSlide key={i}>
                <Course_Card course={course} Height={"200"} />
              </SwiperSlide>
            ))
		  }
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default CourseSlider