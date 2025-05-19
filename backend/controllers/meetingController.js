import Meeting from "../models/meeting.model.js";


// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const meetingData = req.body;

    console.log("meetingData", meetingData);
    console.log("hostId", req.id);
    // const meetings = await UserAuth.find({ hostId });

    const newMeeting = new Meeting(meetingData);
    newMeeting.hostId = req.id;
    const savedMeeting = await newMeeting.save();
    res.status(201).json({
      message: "Meeting scheduled successfully.",
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
