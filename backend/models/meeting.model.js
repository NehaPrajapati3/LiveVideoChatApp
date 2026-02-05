import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },
    conflicts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conflict",
      },
    ],
    duration: {
      type: Number,
      default: 45,
    },
    // participants: {
    //   type: [String],
    // //   required: true,
    // //   validate: [
    // //     (array) => array.length > 0,
    // //     "At least one participant is required",
    // //   ],
    // },
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
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    meetingLink: {
      type: String,
      required: true,
    },
    meetingId: { 
      type: String, 
      required: true, 
      unique: true
     },

    
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
