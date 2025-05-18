// src/servers/routes/protected.js
import express from "express";
import authenticateJWT from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";
import {
  listStudents,
  deleteStudent,
  editAssignedStudent
} from "../controllers/userController.js";

const router = express.Router();

// GET /students
router.get(
  "/students",
  authenticateJWT,
  authorize,
  listStudents
);

// DELETE /students/:id
router.delete(
  "/students/:id",
  authenticateJWT,
  authorize,
  deleteStudent
);

// PUT /students/:id → edit assigned OR all depending on policy
router.put(
  "/students/:id",
  authenticateJWT,
  authorize,
  editAssignedStudent, // Will internally decide between editAssigned or edit
);

export default router;
