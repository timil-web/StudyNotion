import React from 'react'
import HighlightText from './HighlightText'
import Know_your_progress from '../../../assets/Images/Know_your_progress.png'
import Compare_with_others from '../../../assets/Images/Compare_with_others.png'
import Plan_your_lessons from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from './Button'

const LearningLanguageSection = () => {
  return (
	<div className='mt-[130px] mb-32'>
	  <div className='flex flex-col items-center gap-5'>

		<div className='text-4xl font-semibold text-center'>
			Your swiss knife for
			<HighlightText text={"learning any languages"} />
		</div>
		
		<div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
			Using spin making learning multiple languages easy. with 20+
			languages realistic voice-over, progress tracking, custom schedule
			and more.
		</div>

		<div className='flex flex-col lg:flex-row gap-5 items-center justify-center mt-5'>
		  <img src={Know_your_progress} alt="Know your progress" className='object-fit -mr-32'/>
		  <img src={Compare_with_others} alt="Compare with others" className='object-fit'/>
		  <img src={Plan_your_lessons} alt="Plan your lessons" className='object-fit -ml-36'/>
		</div>

		<div className='w-fit'>
			<CTAButton active={true} linkto={"/signup"} className={"mx-auto mt-10"}>
			  <div>Learn More</div>
			</CTAButton>
		</div>
	  </div>
	</div>
  )
}

export default LearningLanguageSection
