import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String, 
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 45,
    },
    participants: {
      type: [String],
    //   required: true,
    //   validate: [
    //     (array) => array.length > 0,
    //     "At least one participant is required",
    //   ],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    requirePassword: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: "",
    },
    agenda: {
      type: String,
      default: "",
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth", 
    //   required: true,
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    recordingEnabled: {
      type: Boolean,
      default: false,
    },
    allowScreenShare: {
      type: Boolean,
      default: true,
    },
    allowChat: {
      type: Boolean,
      default: true,
    },
    waitingRoomEnabled: {
      type: Boolean,
      default: true,
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    meetingType: {
      type: String,
      enum: ["one-on-one", "group", "webinar"],
      default: "one-on-one",
    },
    roomType: {
      type: String,
      enum: ["standard", "breakout", "roundtable"],
      default: "standard",
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
