import { UserAuth } from "../models/user.model.js";

export const verify = async (req, res) => {
  try {
    if (!req.id) {
      return res.status(401).json({
        auth: false,
        message: "User not authenticated",
      });
    }

   const user = await UserAuth.findById(req.id).select(
     "userInfo role userAuth.email"
   );

    console.log("user", user);
    return res.status(200).json({
      auth: true,
      user: user || null,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ auth: false, message: "Error verifying user" });
  }
};
