import React, { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const Profile = () => {
  const { user: authUser, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosSecure.get(`api/users/${authUser.uid}`);
        setUser(data);
      } catch (error) {
        console.error("Failed to load user:", error);
        alert("Failed to load profile information.");
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.uid) fetchUser();
  }, [authUser, axiosSecure]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading profile...</p>;
  if (!user) return <p className="text-center mt-6">User not found.</p>;

  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleString()
    : "N/A";
  const isSuspended = user.suspend?.isSuspended ? "Yes" : "No";

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow mt-7 rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="flex items-center space-x-4 mb-4">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <p>
          <strong>Role:</strong> {user.role || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {user.status || "N/A"}
        </p>
        <p>
          <strong>Created At:</strong> {createdAt}
        </p>
        <p>
          <strong>Suspended:</strong> {isSuspended}
        </p>
        {user.suspend?.isSuspended && (
          <>
            <p>
              <strong>Reason:</strong> {user.suspend.reason || "-"}
            </p>
            <p>
              <strong>Feedback:</strong> {user.suspend.feedback || "-"}
            </p>
          </>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
