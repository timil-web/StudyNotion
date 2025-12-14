const User = require("../models/User")
const OTP = require("../models/OTP")
const Profile = require("../models/Profile")
const otpGenerator =require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// const rateLimit = require("express-rate-limit")
const otpTemplate = require("../mail/templates/emailVerificationTemplate")
require("dotenv").config();
const mailSender = require("../utils/mailSender")
const {passwordUpdated} = require("../mail/templates/passwordUpdate")

//send otp
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    // Generate OTP
    let otp;
    let existingOtp;

    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      existingOtp = await OTP.findOne({ otp });
    } while (existingOtp);

    // Save OTP to DB
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body:", otpBody);

    // Send email
    try {
      const mailResponse = await mailSender(
        email,
        "OTP Verification",
        otpTemplate(otp)
      );
      console.log("Mail response:", mailResponse);
    } catch (mailError) {
      console.error("Error sending email:", mailError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: mailError.message,
      });
    }
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}

//sign up
exports.signUp = async(req,res) =>{
    try {
        //Data fetch from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body

        //validate 
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        //both password matching 
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:'Password and confirmPassword not match ,Please try again'
            })
        }

        //check user already exist or not 
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already registered'
            })
        }
        //find most recent otp stored for the user 
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        // validate otp 
        if(recentOtp.length == 0){
            //otp not found
            return res.status(400).json({
                success:false,
                message: "OTP not found"
            })
        }else if(otp !== recentOtp[0].otp){
            //Invalid otp
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password,10);
        //entry create in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })

        // Delete the used OTP
        await OTP.deleteOne({_id: recentOtp._id});

        // Remove password from response
        const userResponse = user.toObject();
        userResponse.password = undefined;

        //return res
        return res.status(200).json({
            success:true,
            message:'User registered successfully',
            user: userResponse
        })
    } catch (error) {
        console.log("SignUp error",error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered ,Please try after sometime',
            error:error.message
        })
    }
}
//login
exports.login = async(req,res) =>{
   try {
     //get data fron req
    const {email,password}= req.body;
    //validate
    if(!email || !password){
        return res.status(403).json({
            success:false,
            message:'Please enter all the details'
        })
    }
    //user exist or not
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({
            success:false,
            message:'User not registered'
        })
    }
    // generate jwt ,after password matching
    if(await bcrypt.compare(password,user.password)){
        const payload = {
            email : user.email,
            id:user._id,
            accountType:user.accountType
        }
        
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:'2h'
        });
        const userResponse = user.toObject();
        userResponse.password = undefined;
        //create cookie and send res
        const options = {
            expires:new Date(Date.now() + 3 * 24*60*60*1000),
            httpOnly:true
        }

        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user: userResponse,
            message:'Logged in successfully'
        })
    }else{
        return res.status(401).json({
            success:false,
            message:"Password incorect"
        })
    }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          success:false,
          message:"Login failure , Please try after some time"
        })
    }
    
}
//change Password
exports.changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id);

        // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );
        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
                .status(401)
                .json({ success: false, message: "The password is incorrect" });
        }

        // Match new password and confirm new password
        if (newPassword !== confirmNewPassword) {
            // If new password and confirm new password do not match, return a 400 (Bad Request) error
            return res.status(400).json({
                success: false,
                message: "The password and confirm password does not match",
            });
        }

        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        );
        
        console.log(updatedUserDetails.email);
        
        // Send notification email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        // Return success response
        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        });
    }
};