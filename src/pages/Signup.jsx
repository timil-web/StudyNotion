import React from 'react'
import Template from '../components/core/Auth/Template'
import SignupImg from "../assets/Images/signup.webp"

const Signup = () => {
  return (
	<Template
		title="Join the millions learning to code with studyNotion for free"
		desc1="build skills for today, tomorrow,and beyond"
		desc2="Education to future-proof your carrer"
		image={SignupImg}
		formtype="signup"
	/>
  )
}

export default Signup
