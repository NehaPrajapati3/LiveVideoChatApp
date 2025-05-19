import express from "express";
import { signup, login, logout, getUsers } from "../controllers/userAuthController.js";
import isUserAuthenticated  from "../middleware/isUserAuthenticated.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(  login);
router.route("/logout").get(isUserAuthenticated, logout);
router.route("/getAll").get(isUserAuthenticated, getUsers);

console.log("User route");

export default router;
