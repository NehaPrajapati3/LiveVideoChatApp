import express from "express";
import isUserAuthenticated from "../middleware/isUserAuthenticated.js";

import {
  createMeeting,
  getMeetingsByHost,
  getMeetingById,
} from "../controllers/meetingController.js";

const router = express.Router();

router.post("/create", isUserAuthenticated, createMeeting);
router.get("/getMeetings", isUserAuthenticated, getMeetingsByHost);
router.get("/:id", isUserAuthenticated, getMeetingById);

export default router;
