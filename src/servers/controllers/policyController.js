import Policy from "../models/Policy.js";

const VALID_ACTIONS = [
  "view",
  "edit",
  "delete",
  "assign_students",
  "publish",
  "unpublish",
  "viewCourse",
  "changePolicies",
  "viewAssigned",
  "viewSelf",
  "editAssigned"
];

export const createPolicy = async (req, res) => {
  try {
    const { permissions } = req.policy;
    if (!permissions.some(p => p.actions.includes("changePolicies"))) {
      return res.status(403).json({ error: "Access denied: missing changePolicies permission" });
    }

    const { role, permissions: inputPermissions } = req.body;

    if (!role || typeof role !== "string") {
      return res.status(400).json({ error: "Role is required and must be a string" });
    }

    if (!Array.isArray(inputPermissions) || inputPermissions.length === 0) {
      return res.status(400).json({ error: "Permissions must be a non-empty array" });
    }

    for (const perm of inputPermissions) {
      if (!Array.isArray(perm.actions) || perm.actions.length === 0) {
        return res.status(400).json({ error: "Each permission must contain non-empty actions array" });
      }

      const invalid = perm.actions.filter(a => !VALID_ACTIONS.includes(a));
      if (invalid.length > 0) {
        return res.status(400).json({ error: `Invalid actions: ${invalid.join(", ")}` });
      }
    }

    const policy = new Policy({ role, permissions: inputPermissions });
    const saved = await policy.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// GET all policies
export const getAllPolicies = async (req, res) => {
  try {
    const { permissions } = req.policy;
    if (!permissions.some(p => p.actions.includes("changePolicies"))) {
      return res.status(403).json({ error: "Access denied: missing changePolicies permission" });
    }

    const policies = await Policy.find({});
    res.status(200).json(policies);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch policies", details: err.message });
  }
};

// ADD a new role
export const addRole = async (req, res) => {
  try {
    const { permissions } = req.policy;
    if (!permissions.some(p => p.actions.includes("changePolicies"))) {
      return res.status(403).json({ error: "Access denied: missing changePolicies permission" });
    }

    const { role, permissions: inputPermissions } = req.body;

    const existing = await Policy.findOne({ role });
    if (existing) {
      return res.status(400).json({ error: "Role already exists" });
    }

    const newRole = new Policy({ role, permissions: inputPermissions });
    await newRole.save();

    res.status(201).json({ message: "Role added successfully", role: newRole });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// UPDATE policy
export const updatePolicy = async (req, res) => {
  try {
    const { permissions } = req.policy;
    if (!permissions.some(p => p.actions.includes("changePolicies"))) {
      return res.status(403).json({ error: "Access denied: missing changePolicies permission" });
    }

    const { id } = req.params;
    const { role, permissions: updatedPermissions } = req.body;

    if (!role || typeof role !== "string") {
      return res.status(400).json({ error: "Role is required and must be a string" });
    }

    if (!Array.isArray(updatedPermissions) || updatedPermissions.length === 0) {
      return res.status(400).json({ error: "Permissions must be a non-empty array" });
    }

    for (const perm of updatedPermissions) {
      if (!Array.isArray(perm.actions) || perm.actions.length === 0) {
        return res.status(400).json({ error: "Each permission must contain non-empty actions array" });
      }

      const invalid = perm.actions.filter(a => !VALID_ACTIONS.includes(a));
      if (invalid.length > 0) {
        return res.status(400).json({ error: `Invalid actions: ${invalid.join(", ")}` });
      }
    }

    const updated = await Policy.findByIdAndUpdate(id, { role, permissions: updatedPermissions }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
