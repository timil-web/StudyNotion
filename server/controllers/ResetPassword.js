const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// reset password token
exports.resetPasswordToken = async (req,res) => {
	try {
		// get email from req body
		const  email  = req.body.email;

		// check user for this mail, verification
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}

		// gen token
		const token = crypto.randomBytes(20).toString("hex");
		
		// update user by adding token and expire time
		const updatedDetails = await User.findOneAndUpdate(
			{email:email},
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000, // 1 hour
			},
			{ new: true }
		)
		console.log("DETAILS", updatedDetails);
		// create url
		const url = `http://localhost:3000/update-password/${token}`
		
		// send mail
		await mailSender(
			email,
			"Reset Password",
			`Click on this link to reset your password: ${url}`
		)

		// ret res
		return res.status(200).json({
			success: true,
			message: "Reset password link sent to your email"
		})
	}
	catch(error){
		res.status(500).json({message: "Something went wrong while sending reset password mail"});
	}
}

// reset password
exports.resetPassword = async (req,res) => {
	try{
		// data fatch
		const { password, confirmPassword, token } = req.body;

		// validation
		if(password != confirmPassword) {
			return res.json({
				success: false,
				message: "Passwords do not match"
			});
		}
		
		// get user details from db using token
		const userDetails = await User.findOne({token:token});
		
		// if no entry - invalid token
		if(!userDetails) {
			return res.json({
				success: false,
				message: "Invalid token"
			})
		}

		// token time expire
		if(userDetails.resetPasswordExpires < Date.now()) {
			return res.status(403).json({
				success: false,
				message: "Token has expired, please regenerate"
			});
		}
		
		// hash pass
		const hashedPassword = await bcrypt.hash(password, 10);

		// update pass
		await User.findOneAndUpdate(
			{token: token},
			{password: hashedPassword},// token null ?????
			{new: true},
		)
		// ret res
		return res.status(200).json({
			success: true,
			message: "Password has been reset successfully"
		});
	}
	catch(error){
		return res.status(500).json({
			success: false,
			message: "Something went wrong while resetting password"
		});
	}
}
