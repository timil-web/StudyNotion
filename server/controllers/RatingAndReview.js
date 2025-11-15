const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// create rating
exports.createRating = async (req, res) => {
	try{
		// get id
		const userId = req.user.id;
		// fetchdata
		const { rating, review, courseId } = req.body;
		// check user enroll
		const courseDetails = await Course.findOne(
			{
				_id: courseId,
				studentsEnrolled: {
					$elemMatch: { $eq: userId }
				}
			}
		);
		if(!courseDetails) {
			return res.status(404).json({
				success: false,
				message: "User not enrolled in this course"
			});
		}
		// check user review already exists
		const alreadyReviewed = await RatingAndReview.findOne(
			{
				user: userId,
				course: courseId,
			}
		)
		if(alreadyReviewed) {
			return res.status(400).json({
				success: false,
				message: "User has already reviewed this course"
			});
		}
		// create rating and review
		const ratingReview = await RatingAndReview.create({
			user: userId,
			course: courseId,
			rating,
			review
		})
		// update course with this rating and review
		const updatedCourseDetails = await Course.findByIdAndUpdate(
			{_id: courseId},
			{
				$push: {
					ratingAndReviews: ratingReview._id,
				}
			}
		);
		console.log(updatedCourseDetails);
		// return response
		return res.status(201).json({
			success: true,
			message: "Rating and review created successfully",
			data: ratingReview
		});
	}
	catch(error){
		console.error("Error creating rating:", error);
		return res.status(500).json({
			success: false,
			message: error.message
		});
	}
}

// get avg rating
exports.getAverageRating = async (req, res) => {
	try {
		// get course id
		const { courseId } = req.body.courseId;
		// calculate avg rating
		const result = await RatingAndReview.aggregate([
			{ $match: { course: new mongoose.Types.ObjectId(courseId) } }, // string to objectId
			{ $group: { _id: null, averageRating: { $avg: "$rating" } } }
		]);

		if (!result || result.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No ratings found for this course",
				averageRating: 0,
			});
		}
		// return response
		return res.status(200).json({
			success: true,
			averageRating: result[0].averageRating,
			message: "Average rating fetched successfully",
			data: result
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

// get all ratings and reviews
exports.getAllRating = async (req, res) => {
	try{
		// get all
		const allReviews = await RatingAndReview.find({})
		    .sort({rating: "desc"})
			.populate({
				path: "user",
				select: "firstName lastName email image",
			})
			.populate({
				path: "course",
				select: "courseName"
			})
			.exec();
		// return res
		return res.status(200).json({
			success: true,
			message: "All ratings and reviews fetched successfully",
			data: allReviews
		});
	}
	catch(error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: error.message
		});
	}
}