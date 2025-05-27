import express from "express";
import {
  sendConflictQuery,
  getNotifications,
} from "../controllers/conflictController.js";
import isUserAuthenticated from "../middleware/isUserAuthenticated.js";


const router = express.Router();

router.post("/send", isUserAuthenticated, sendConflictQuery);

router.get("/get", isUserAuthenticated, getNotifications);

export default router;
