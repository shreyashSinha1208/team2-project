import mongoose from "mongoose";

// Define the schema for permissions
const permissionSchema = new mongoose.Schema(
  {
    actions: [String], // array of strings like "view", "edit", etc.
  },
  { _id: false } // prevents auto _id generation for subdocs
);

// Define the schema for policy
const policySchema = new mongoose.Schema(
  {
    role: String, // e.g., "admin", "teacher", etc.
    permissions: [permissionSchema], // array of permission objects
  },
  { timestamps: true } // adds createdAt and updatedAt fields
);

export default mongoose.model("Policy", policySchema);
