import React from 'react'
import Template from '../components/core/Auth/Template'
import LoginImg from "../assets/Images/login.webp"

const Login = () => {
	// console.log("All ENV:", process.env);
	// console.log("REACT_APP_BASE_URL:", process.env.REACT_APP_BASE_URL);
    // console.log("REACT_APP_RAZORPAY_KEY:", process.env.REACT_APP_RAZORPAY_KEYY);
  return (
	<Template
		title="Welcome Back"
		desc1="build skills for today, tomorrow,and beyond"
		desc2="Education to future-proof your carrer"
		image={LoginImg}
		formtype="login"
	/>
  )
}

export default Login
