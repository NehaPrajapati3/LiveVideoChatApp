import { console } from "inspector";
import { Classroom } from "../models/class.model.js";
import Meeting from "../models/meeting.model.js";
import {Conflict} from "../models/meetingConflict.model.js";
import crypto from "crypto";


// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
     const meetingId = crypto.randomBytes(6).toString("hex");

     const meetingLink = `${process.env.CLIENT_ORIGIN}/meeting/${meetingId}`;

    const meetingData = {
      ...req.body,
      meetingId,
      meetingLink,
    };
    const {
      classroom: classroomTitle,
      startTime,
      endTime,
      title,
    } = meetingData;

    const classroomDB = await Classroom.findOne({
      title: classroomTitle,
    }).populate("participants");

    if (!classroomDB) {
      return res
        .status(404)
        .json({ success: false, message: "Classroom not found." });
    }

    const adminId = req.id;
    const newMeetingStart = new Date(startTime);
    const newMeetingEnd = new Date(endTime);

    console.log("newMeetingStart:", newMeetingStart);
    console.log("newMeetingEnd:", newMeetingEnd);

    // Conflict check for each participant

    const conflictIds = [];
    for (const student of classroomDB.participants) {
      const otherMeetings = await Meeting.find({
        classId: { $ne: classroomDB._id }, // Exclude current classroom
        startTime: { $lt: newMeetingEnd },
        endTime: { $gt: newMeetingStart },
      });

      if (otherMeetings.length > 0) {
        const conflict = await Conflict.create({
          studentId: student._id,
          toAdminId: adminId,
          classroomId: classroomDB._id,
          conflictingMeetingTime: newMeetingStart,
          message: `Student ${
            student.name || student._id
          } has another meeting at this time.`,
        });
        conflictIds.push(conflict._id);
      }
    }

    // Create and save the meeting
    const newMeeting = new Meeting({
      ...meetingData,
      hostId: adminId,
      classId: classroomDB._id,
      startTime: newMeetingStart,
      endTime: newMeetingEnd,
      conflicts: conflictIds,
    });

    const savedMeeting = await newMeeting.save();

    res.status(201).json({
      message: "Meeting scheduled successfully (conflicts checked).",
      success: true,
      savedMeeting,
    });
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ message: "Failed to create meeting", error });
  }
};
// Get all meetings for a host
export const getMeetingsByHost = async (req, res) => {
  try {
    const hostId  = req.id;
    console.log("req.id:", req.id);
    console.log("hostId:", hostId);
    const meetings = await Meeting.find({ hostId });
    // const meetings = await Meeting.find();
    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: "Failed to fetch meetings", error });
  }
};

// Get a single meeting by ID
export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json(meeting);
  } catch (error) {
    console.error("Error fetching meeting:", error);
    res.status(500).json({ message: "Failed to fetch meeting", error });
  }
};

export const getUserMeetings = async (req, res) => {
  try {
    const userId = req.id;

    // Find all classrooms this student is in
    const classrooms = await Classroom.find({ participants: userId });

    const classroomIds = classrooms.map((cls) => cls._id);

    const meetings = await Meeting.find({ classId: { $in: classroomIds } })
      .populate("classId")
      .populate({
        path: "conflicts",
        match: { studentId: userId }, // Only show user's own conflicts
        populate: { path: "toAdminId" }, // show admin info
      })
      .sort("startTime");
  // console.log("meetings:", meetings)
    res.status(200).json({ success: true, meetings });
  } catch (error) {
    console.error("Error fetching user meetings:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch meetings." });
  }
};

export const getMeetingViaLink = async (req, res) => {
    console.log("meetingId in getMeetingViaLink:");
  try {
    const meetingId = req.params.id;
    console.log("meetingId in getMeetingViaLink:", meetingId);

    const meeting = await Meeting.findOne({ meetingId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    console.error("Error fetching meeting:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching meeting",
    });
  }

}