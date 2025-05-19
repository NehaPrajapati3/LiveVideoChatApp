import { UserAuth } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  console.log("Req: ", req.body);
  try {
    console.log("sign up user");

    const { fullName, username, email, password } = req.body;
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserAuth.findOne({ "userAuth.email": email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserAuth.create({
      userInfo: {
        fullName,
        username,
      },
      userAuth: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(`Sign up user error: ${error}`);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Log in user");
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserAuth.findOne({ "userAuth.email": email }).select(
      "userAuth.password userInfo"
    );
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.userAuth?.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    console.log("tokenData:", tokenData);

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    console.log("token: ", token);

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        userData: {
          _id: user._id,
          firstName: user.userInfo?.fullName,
          lastName: user.userInfo?.username,
          email: user.userAuth?.email,
        },
      });
  } catch (error) {
    console.log(`Log in user error: ${error}`);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = (req, res) => {
  console.log("Inside log out user");
  try {
    console.log("Inside log out user try");

    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    // const { hostId } = req.id;
    // const meetings = await Meeting.find({ hostId });
    const users = await UserAuth.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};
