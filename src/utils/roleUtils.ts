import decoded from "@/Components/utils/fetchCredential";

export const EXECUTIVE_ROLES = ["superadmin", "hr"];

export const isExecutive = () =>
  EXECUTIVE_ROLES.includes(decoded.userData.role);

export const isAdmin = () => decoded.userData.role === "admin";

export const isTeacher = () => decoded.userData.role === "teacher";

export const isHR = () => decoded.userData.role === "hr";
