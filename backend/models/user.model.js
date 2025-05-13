import mongoose from "mongoose";

const userAuthSchema = new mongoose.Schema(
  {
    userInfo: {
      fullName: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    
    },
    userAuth: {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
     
    },
  },
  { timestamps: true }
);

export const UserAuth = mongoose.model("UserAuth", userAuthSchema);
