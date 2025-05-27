import express from "express";
import isUserAuthenticated from "../middleware/isUserAuthenticated.js";

import {
  createClassroom,
  getAllClassrooms,
  getClassroomById,
  updateClassroom,
  enrollInClassroom,
  deleteClassroom,
  getAllClassroomsByAdminId,
  getEnrolledClassrooms

} from "../controllers/classController.js";

const router = express.Router();

router.post("/add", isUserAuthenticated, createClassroom);
router.get("/allByAdminId", isUserAuthenticated, getAllClassroomsByAdminId);
router.get("/all", isUserAuthenticated, getAllClassrooms);
router.get("/enrolled", isUserAuthenticated, getEnrolledClassrooms);

router.put("/edit/:id", isUserAuthenticated, updateClassroom);

router.post("/enroll/:id", isUserAuthenticated, enrollInClassroom);
router.get("/:id", isUserAuthenticated, getClassroomById);

// router.patch("/toggle-status/:id", isUserAuthenticated, toggleClassroomStatus);
// router.patch(
//   "/toggle-featured/:id",
//   isUserAuthenticated,
//   toggleClassroomFeatured
// );

router.delete("/delete/:id", isUserAuthenticated, deleteClassroom);

export default router;
