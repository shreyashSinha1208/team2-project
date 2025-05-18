import User from "../models/User.js";

export const listStudents = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { permissions } = req.policy;

    if (permissions.some(p => p.actions.includes("viewSelf"))) {
      return res.json([user]);
    }

    if (permissions.some(p => p.actions.includes("viewAssigned"))) {
      if (!user.assignedStudents?.length) {
        return res.json([]);
      }
      const students = await User.find({ _id: { $in: user.assignedStudents } });
      return res.json(students);
    }

    if (permissions.some(p => p.actions.includes("view"))) {
      const allUsers = await User.find({});
      return res.json(allUsers);
    }

    return res.status(403).json({ message: "Access denied: cannot view students" });
  } catch (err) {
    console.error("listStudents error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { permissions } = req.policy;
    if (!permissions.some(p => p.actions.includes("delete"))) {
      return res.status(403).json({ message: "Access denied: cannot delete student" });
    }
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteStudent error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const editAssignedStudent = async (req, res) => {
  try {
    const { permissions } = req.policy;
    const canEditAll = permissions.some(p => p.actions.includes("edit"));
    const canEditAssigned = permissions.some(p => p.actions.includes("editAssigned"));

    if (!canEditAll && !canEditAssigned) {
      return res.status(403).json({ message: "Access denied: cannot edit student" });
    }

    const updateData = req.body;
    const targetUserId = req.params.id;
    const updates = {};

    if (canEditAll) {
      Object.assign(updates, updateData);
    } else if (canEditAssigned) {
      const currentUser = await User.findOne({ email: req.user.email });
      if (!currentUser || !currentUser.assignedStudents?.includes(targetUserId)) {
        return res.status(403).json({ message: "Access denied: not assigned student" });
      }
      Object.assign(updates, updateData);
    }

    const updatedUser = await User.findByIdAndUpdate(targetUserId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error("editStudent error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
