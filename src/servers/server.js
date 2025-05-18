import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import courseRoutes from "./routes/course.js";
import policyRoutes from "./routes/policyRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", authRoutes);
app.use("/api", protectedRoutes);
app.use('/api/courses', courseRoutes);
app.use("/api/policies", policyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
