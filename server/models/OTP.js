const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	otp: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 5*60,
	}
});

// fn-> to send mail
async function sendVerificationEmail(email, otp) {
	try {
		const mailResponse = await mailSender(email, "verification mail from studyNotion", otp);
		console.log("Mail sent successfully:", mailResponse);
	} catch (error) {
		console.error("Error sending verification email:", error.message);
	}
}

OTPSchema.pre('save', async function (next) {
	await sendVerificationEmail(this.email, this.otp);
	next();
})

module.exports = mongoose.model('OTP', OTPSchema);
