import { Conflict } from "../models/meetingConflict.model.js";
import { Notification } from "../models/conflictNotification.model.js";
import { UserAuth } from "../models/user.model.js";
import  Meeting  from "../models/meeting.model.js";
import { Classroom } from "../models/class.model.js";

export const sendConflictQuery = async (req, res) => {
  try {
    const studentId = req.id;
    const { toAdminId, classId, conflictingMeetingTime, message } = req.body;
    console.log(
      " IN sendConflictQuery:",
      toAdminId,
      conflictingMeetingTime,
      message
    );

    console.log("classId:", classId);

    if (!toAdminId || !classId || !conflictingMeetingTime || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }
     
    const classroomId = classId._id;
    console.log("classroomId:", classroomId);
 
    // const existing = await Notification.findOne({
    //   studentId,
    //   toAdminId,
    //   classroomId,
    //   conflictingMeetingTime: new Date(conflictingMeetingTime),
    // });

    // console.log("existing:", existing);
    // if (existing) {
    //   return res
    //     .status(409)
    //     .json({ success: false, message: "Conflict already reported." });
    // }

    const existingNotification = await Notification.findOne({
      to: toAdminId,
      from: studentId,
      type: "conflict",
      "meta.classroomId": classroomId,
      "meta.conflictingMeetingTime": new Date(conflictingMeetingTime),
    });

    if (existingNotification) {
      return res.status(409).json({
        success: false,
        message: "Conflict notification already sent.",
      });
    }
      
    // const conflict = await Conflict.create({
    //   studentId,
    //   toAdminId,
    //   classroomId,
    //   conflictingMeetingTime: new Date(conflictingMeetingTime),
    //   message,
    // });

    const student = await UserAuth.findById(studentId).select("userInfo userAuth");

    // Save persistent notification
    const notification = await Notification.create({
      to: toAdminId,
      from: studentId,
      type: "conflict",
      message,
      meta: {
        classroomId,
        conflictingMeetingTime: new Date(conflictingMeetingTime),
      },
    });

    res.status(201).json({
      success: true,
      message: "Notification submitted.",
      notification,
    });
  } catch (err) {
    console.error("Conflict Error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


export const getNotifications = async (req, res) => {
  try {
    const userId = req.id; // assumed to be set via auth middleware

    const notifications = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("from", "userInfo.fullName userInfo.username userAuth.email") // sender details
      .lean();

      for (let notif of notifications) {
        if (notif.meta?.classroomId) {
          const meeting = await Meeting.findOne({
            classId: notif.meta.classroomId,
            startTime: new Date(notif.meta.conflictingMeetingTime),
          }).lean();

          const classroom = await Classroom.findById(
            notif.meta.classroomId
          ).lean();

          notif.meetingTitle = meeting?.title || "Unknown Meeting";
          notif.classTitle = classroom?.title || "Unknown Class";
        }
      }

      console.log("notifications:", notifications);

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err) {
    console.error("Get Notifications Error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

