import React from 'react'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import TimelineImage from '../../../assets/Images/TimelineImage.png'

const TimeLine = [
    {
      Logo: Logo1,
      Heading: "Leadership",
      Description: "Fully committed to the success company",
    },
    {
      Logo: Logo2,
      Heading: "Responsibility",
      Description: "Students will always be our top priority",
    },
    {
      Logo: Logo3,
      Heading: "Flexibility",
      Description: "The ability to switch is an important skills",
    },
    {
      Logo: Logo4,
      Heading: "Solve the problem",
      Description: "Code your way to a solution",
    },
];

const TimelineSection = () => {
  return (
	<div className='flex flex-col lg:flex-row lg:gap-15 gap-20 items-center '>
		<div className='lg:w-[45%] flex flex-col gap-5'>
			{
				TimeLine.map((element,index) => {
					return (
						<div className='flex flex-row gap-6' key={index}>
							<div className='w-[50px] h-[50px] bg-white flex items-center'>
                <img src={element.Logo} alt='elementlogo'/>
							</div>
              <div className='flex flex-col gap-2 '>
                <h2 className='font-semibold text-[18px]'>{element.Heading}</h2>
                <p className='text-base'>{element.Description}</p>
              </div>
              
						</div>
					)
				})
			}
	  </div>

    <div className='relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]'>
      <img src={TimelineImage} alt="TimelineImage" 
        className='shadow-white object-cover h-fit'
      />

      <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%]'>
        <div className='flex flex-row gap-5 items-center border-7 border-caribbeangreen-300 px-7'>
          <p className='text-3xl font-bold'>10</p>
          <p className='text-sm text-caribbeangreen-300'>Years of Experience</p>
        </div>

        <div className="flex gap-5 items-center lg:px-14 px-7">
          <p className="text-3xl font-bold">250</p>
          <p className="text-caribbeangreen-300 text-sm w-[75px]">
            types of courses
          </p>
        </div>

      </div>


    </div>
	</div>
  )
}

export default TimelineSection
