import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/api/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed To Fetch Users!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole, userName) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Change role of ${userName} to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/api/users/${userId}/role`, { role: newRole });
      Swal.fire("Success", "User Role Updated!", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed To Update Role!", "error");
    }
  };

  const handleStatusChange = async (user) => {
    if (user.uid === currentUser.uid) {
      Swal.fire("Error", "You cannot change your own status!", "error");
      return;
    }

    let reason = "";
    let feedback = "";

    if (user.status === "active") {
      const { value: formValues } = await Swal.fire({
        title: "Suspend User",
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Reason">' +
          '<input id="swal-input2" class="swal2-input" placeholder="Feedback">',
        focusConfirm: false,
        preConfirm: () => [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ],
      });

      if (!formValues) return;
      [reason, feedback] = formValues;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Change status of ${user.name} to ${
        user.status === "active" ? "suspended" : "active"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/api/users/${user._id}/status`, {
        status: user.status === "active" ? "suspended" : "active",
        reason,
        feedback,
      });
      Swal.fire("Success", "User Status Updated!", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed To Update Status!", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner"></div>
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <div className="overflow-x-auto hidden sm:block">
        <table className="table-auto w-full border text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
            {users.map((user, index) => (
              <tr key={user._id} className="border-b text-center">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value, user.name)
                    }
                    className="border px-2 py-1 rounded"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={user.status}
                    onChange={() => handleStatusChange(user)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value={user.status}>{user.status}</option>
                    <option
                      value={user.status === "active" ? "suspended" : "active"}
                    >
                      {user.status === "active" ? "suspended" : "active"}
                    </option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleStatusChange(user)}
                    className="btn btn-sm btn-error"
                    disabled={user.uid === currentUser.uid}
                  >
                    Change Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden">
        {users.map((user, index) => (
          <div
            key={user._id}
            className="border rounded p-4 mb-4 shadow-sm bg-white"
          >
            <p>
              <strong>#{index + 1} Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              <select
                value={user.role}
                onChange={(e) =>
                  handleRoleChange(user._id, e.target.value, user.name)
                }
                className="border px-2 py-1 rounded mt-1"
              >
                <option value="buyer">Buyer</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <select
                value={user.status}
                onChange={() => handleStatusChange(user)}
                className="border px-2 py-1 rounded mt-1"
              >
                <option value={user.status}>{user.status}</option>
                <option
                  value={user.status === "active" ? "suspended" : "active"}
                >
                  {user.status === "active" ? "suspended" : "active"}
                </option>
              </select>
            </p>
            <button
              onClick={() => handleStatusChange(user)}
              className="btn btn-sm btn-error mt-2"
              disabled={user.uid === currentUser.uid}
            >
              Change Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
