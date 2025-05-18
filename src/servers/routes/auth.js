// src/servers/routes/auth.js
import express from "express";
import { signup, login, getPolicies } from "../controllers/authController.js";
import authorize from '../middlewares/authorize.js';
import authenticateJWT from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", signup);
router.get("/policies",
    authenticateJWT,
    authorize,
    getPolicies);

export default router;
