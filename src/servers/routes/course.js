import express from 'express';
import authorize from '../middlewares/authorize.js';
import authenticateJWT from "../middlewares/authMiddleware.js";

import {
    createCourse,
    deleteCourse,
    assignStudentsToCourse,getAllCourses

} from '../controllers/courseController.js';

const router = express.Router();

router.get(
  '/list',
  authenticateJWT,
    authorize,
  getAllCourses
);

router.post(
    '/',
    authenticateJWT,
    authorize,
    createCourse
);

router.delete(
    '/:id',
    authenticateJWT,
    authorize,
    deleteCourse
);

router.put(
    '/:id/assign',
    authenticateJWT,
    authorize,
    assignStudentsToCourse
);

export default router;
