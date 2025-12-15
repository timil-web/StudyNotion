const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
	mongoose.connect(process.env.MONGODB_URL)
	.then(()=>console.log("Database connected"))
	.catch(err=>{
		console.log("Database connection error:", err);
		process.exit(1);
	});
}