import mongoose from "mongoose";

const conflictSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAuth",
    required: true,
  },
  toAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAuth",
    required: true,
  },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  conflictOrigin: {
    type: String,
    enum: ['system', 'student'],
    default: 'system',
  },
  
  conflictingMeetingTime: { type: Date, required: true },
  message: String,
  createdAt: { type: Date, default: Date.now },
});

export const Conflict = mongoose.model("Conflict", conflictSchema);
