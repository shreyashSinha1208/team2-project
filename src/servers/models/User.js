// src/servers/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher", "student"], required: true },
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {
  timestamps: true  
});

export default mongoose.model("User", userSchema);
