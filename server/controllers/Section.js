const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req,res) => {
	try{
		// data fatch
		const { sectionName, courseId } = req.body;
		// data validation
		if(!sectionName || !courseId){
			return res.status(400).json({
				success: false,
				message: "Missing properties"
			})
		}
		// create section
		const newSection = await Section.create({sectionName});
		// update course with section objid
		const updatedCourseDetails = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true },
		).populate({// hw use populate to replace  section/subsection both in updated course
			path: "courseContent",
			populate: {
				path: "subSection",
			}
		}).exec();

		// ret res
		return res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourseDetails
		});
	}
	catch(error){
		return res.status(500).json({
			success: false,
			message: "unable to creates section,please try again",
			error: error.message,
		});
	}
}

exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId,courseId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

		res.status(200).json({
			success: true,
			message: section,
			data:course,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body; // or req.params if using URL params
	
    // check section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // remove section from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    // delete all subsections inside section
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    // delete section
    await Section.findByIdAndDelete(sectionId);

    // get updated course
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete section, please try again",
      error: error.message,
    });
  }
};
