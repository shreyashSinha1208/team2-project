import Policy from "../models/Policy.js";

export default async function authorize(req, res, next) {
  try {
    const { role } = req.user;
    const policy = await Policy.findOne({ role }).lean();
    if (!policy?.permissions?.length) {
      return res.status(403).json({ message: "No policy found for your role" });
    }
    req.policy = policy;
    next();
  } catch (err) {
    console.error("Authorization lookup error:", err);
    res.status(500).json({ message: "Internal server error in authorize" });
  }
}
