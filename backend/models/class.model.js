import mongoose from "mongoose";

const classRoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth",
      }
    ],
  },
  { timestamps: true }
);

export const Classroom = mongoose.model("Classroom", classRoomSchema);
