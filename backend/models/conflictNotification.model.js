import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
    },
    type: { type: String, enum: ["conflict"], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    meta: {
      classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
      conflictingMeetingTime: Date,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
