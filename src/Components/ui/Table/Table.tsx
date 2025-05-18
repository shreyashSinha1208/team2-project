"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Dialog component using Tailwind
function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div
      onClick={() => onOpenChange(false)}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-6 min-w-[300px] max-w-[90vw] max-h-[90vh] overflow-y-auto shadow-lg"
      >
        {children}
      </div>
    </div>
  );
}

function DialogTitle({ children }) {
  return <h2 className="text-xl font-semibold m-0">{children}</h2>;
}

function DialogContent({ children }) {
  return <div className="mt-2">{children}</div>;
}

export default function PoliciesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newPermissions, setNewPermissions] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);

  // Fetch all roles and available actions
  useEffect(() => {
    fetchRoles();
    fetchAvailableActions();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/policies/list"); // adjust to your real API
      setRoles(res.data);
    } catch (e) {
      alert("Failed to fetch roles");
    }
    setLoading(false);
  };

  const fetchAvailableActions = async () => {
    try {
      // If your backend has an API endpoint for valid actions, replace this URL
      // else use the hardcoded list below:
      // const res = await axios.get("/api/policies/actions");
      // setAvailableActions(res.data);

      setAvailableActions([
        "view",
        "edit",
        "delete",
        "assign_students",
        "publish",
        "unpublish",
        "viewCourse",
        "changePolicies",
        "viewAssigned",
      ]);
    } catch {
      setAvailableActions([]);
    }
  };

  // Add Role Submit
  const handleAddRole = async () => {
    if (!newRole.trim()) {
      alert("Role is required");
      return;
    }
    if (newPermissions.length === 0) {
      alert("Select at least one permission");
      return;
    }

    // Format payload as required by backend
    const payload = {
      role: newRole.trim(),
      permissions: [
        {
          actions: newPermissions,
        },
      ],
    };

    try {
      await axios.post("/api/policies/add", payload);
      setDialogOpen(false);
      setNewRole("");
      setNewPermissions([]);
      fetchRoles();
    } catch {
      alert("Failed to add role");
    }
  };

  // Toggle permission selection
  const togglePermission = (action) => {
    if (newPermissions.includes(action)) {
      setNewPermissions(newPermissions.filter((a) => a !== action));
    } else {
      setNewPermissions([...newPermissions, action]);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Roles & Policies</h1>
        <button
          onClick={() => setDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Role
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto border rounded shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Permissions (Actions)</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center p-4">
                    No roles found.
                  </td>
                </tr>
              )}
              {roles.map(({ _id, role, permissions }) => (
                <tr key={_id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-semibold">{role}</td>
                  <td className="py-2 px-4 border-b">
                    {permissions
                      .map((perm) => perm.actions.join(", "))
                      .join("; ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Role Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Role Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Enter role name"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Select Permissions</label>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {availableActions.map((action) => (
                <div key={action} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`perm-${action}`}
                    checked={newPermissions.includes(action)}
                    onChange={() => togglePermission(action)}
                    className="mr-2"
                  />
                  <label htmlFor={`perm-${action}`} className="cursor-pointer">
                    {action}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRole}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add Role
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
