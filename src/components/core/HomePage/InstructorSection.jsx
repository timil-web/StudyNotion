import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png'
import HighlightText from './HighlightText';
import CTAButton from './Button';
import { FaArrowRight } from "react-icons/fa";

const InstructorSection = () => {
  return (
	<div className='mt-16'>
	  <div className='flex flex-col md:flex-row gap-20 items-center'>

		<div className='md:w-[50%] w-[70%]'>
		  <img src={Instructor} alt="instructor" className='shadow-white shadow-[0px_0px_30px_0px]' />
		</div>

		<div className='md:w-[50%] w-[70%] flex flex-col gap-10'>
	      <div className='text-4xl font-semibold w-[50%]'>
			Become an 
			<HighlightText text={"Instructor"} />
		  </div>
		  <p className="font-medium text-[16px] w-[90%] text-richblack-300">
			Instructors from around the world teach millions of students on
			StudyNotion. We provide the tools and skills to teach what you
			love.
		  </p>
		  <div className="w-fit">
			<CTAButton active={true} linkto={"/signup"}>
			<div className="flex items-center gap-3">
				Start Teaching Today
				<FaArrowRight />
			</div>
			</CTAButton>
		  </div>
		</div>
	  </div>
	</div>
  )
}

export default InstructorSection
