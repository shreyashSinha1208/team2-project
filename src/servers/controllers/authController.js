
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import Policy from "../models/Policy.js";

export const signup = async (req, res) => {
  try {
    const { email, password, role = "student" } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role });

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Logged in successfully",
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPolicies = async (req, res) => {
  try {
    const { role } = req.user;               
    const policy = await Policy.findOne({ role });

    if (!policy) {
      return res.status(404).json({ message: "Policy not found for role" });
    }

    return res.json({ permissions: policy.permissions });
  } catch (err) {
    console.error("getPolicies error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
