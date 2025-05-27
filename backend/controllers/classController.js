import { Classroom } from "../models/class.model.js";

// Create a new classroom
export const createClassroom = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const adminId = req.id;
    console.log(`adminId: ${adminId}`);

    const classroom = new Classroom({
      title,
      description,
      price,
      adminId,
    });

     const IsClassRoom = await Classroom.findOne({ title });
        if (IsClassRoom) {
          return res.status(400).json({
            message: "Classroom already exists with this title.",
            success: false,
          });
        }

    const savedClassroom = await classroom.save();
    res.status(201).json({
      savedClassroom,
      message: "Classroom created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(`Create classroom error: ${error}`);

    res
      .status(500)
      .json({ error: "Failed to create classroom", details: error.message });
  }
};

// Get all classrooms (optionally filter by admin)
export const getAllClassroomsByAdminId = async (req, res) => {
  try {
     const adminId = req.id;
    const allClassrooms = await Classroom.find({adminId:adminId});
    // console.log("allClassrooms:", allClassrooms);
    return res.status(200).json({
      success: true,
      items: allClassrooms,
    });
  } catch (error) {
    console.error(`Get all classrooms error: ${error}`);
    res.status(500).json({
      message: "Error fetching classrooms.",
      success: false,
    });
  }
};

export const getAllClassrooms = async (req, res) => {
  try {
    const allClassrooms = await Classroom.find().populate("adminId");
    // console.log("allClassrooms:", allClassrooms);
    return res.status(200).json({
      success: true,
      items: allClassrooms,
    });
  } catch (error) {
    console.error(`Get all classrooms error: ${error}`);
    res.status(500).json({
      message: "Error fetching classrooms.",
      success: false,
    });
  }
};

// Get single classroom by ID
export const getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findById(id);

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    res.status(200).json({ classroom, success: true });
  } catch (error) {
    console.log(`Get classroom error: ${error}`);
    res
      .status(500)
      .json({ error: "Failed to fetch classroom", details: error.message });
  }
};

// Update a classroom
export const updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedClassroom = await Classroom.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedClassroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    res.status(200).json({
      updatedClassroom,
      message: "Classroom updated successfully.",
      success: true,
    });
  } catch (error) {
    console.log(`update classroom error: ${error}`);

    res
      .status(500)
      .json({ error: "Failed to update classroom", details: error.message });
  }
};

export const toggleClassroomStatus = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("classroomId", id);

    const classroom = await Classroom.findOne({ _id: id });
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    classroom.classroomStatus = !classroom.classroomStatus; // Toggle boolean
    await classroom.save();

    res.status(200).json({
      message: "Classroom status updated",
      classroomStatus: classroom.classroomStatus,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

export const toggleClassroomFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findOne({ _id: id });
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    classroom.featured = !classroom.featured; // Toggle boolean
    await classroom.save();

    res.status(200).json({
      message: "Classroom featured status updated",
      featured: classroom.featured,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating featured", error: error.message });
  }
};

// Enroll user in a classroom
export const enrollInClassroom = async (req, res) => {
  try {
    const userId = req.id; // assuming req.id is set via auth middleware
    const { id } = req.params; // classroom ID from URL

    const classroom = await Classroom.findById(id);
    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    // Check if already enrolled (optional – $addToSet handles this)
    const isAlreadyEnrolled = classroom.participants.includes(userId);
    if (isAlreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "User already enrolled in this classroom.",
      });
    }

    // Add user to participants
    classroom.participants.addToSet(userId);
    await classroom.save();

    res.status(200).json({
      success: true,
      message: "User enrolled successfully.",
      classroom,
    });
  } catch (error) {
    console.error(`Enrollment error: ${error}`);
    res.status(500).json({
      success: false,
      message: "Failed to enroll in classroom.",
      error: error.message,
    });
  }
};

// Get classrooms where current user is a participant
export const getEnrolledClassrooms = async (req, res) => {
  try {
    const userId = req.id; 

    const enrolledClasses = await Classroom.find({ participants: userId }).populate("adminId");

    res.status(200).json({
      success: true,
      items: enrolledClasses,
    });
  } catch (error) {
    console.error("Error fetching enrolled classes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get enrolled classrooms.",
      error: error.message,
    });
  }
};



// Delete a classroom
export const deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClassroom = await Classroom.findByIdAndDelete(id);

    if (!deletedClassroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    console.log(`Delete classroom error: ${error}`);

    res
      .status(500)
      .json({ error: "Failed to delete classroom", details: error.message });
  }
};
