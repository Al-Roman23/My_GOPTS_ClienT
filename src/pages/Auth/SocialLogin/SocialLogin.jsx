import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { SiGoogle } from "react-icons/si";

const SocialLogin = () => {
  const { signInGoogle } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInGoogle();
      const idToken = await result.user.getIdToken();

      const userPayload = {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL || "",
        role: "buyer",
        status: "active",
      };

      try {
        await axiosSecure.get(`/api/users/${userPayload.uid}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
      } catch (err) {
        if (err.response?.status === 404) {
          await axiosSecure.post("/api/users", userPayload, {
            headers: { Authorization: `Bearer ${idToken}` },
          });
        } else {
          throw err;
        }
      }

      navigate(location?.state?.from || "/dashboard/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed!",
        text: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="text-center pb-7">
      <p className="mb-1">OR</p>
      <button
        className="btn bg-white text-black border-[#e5e5e5] gap-2 mt-2"
        onClick={handleGoogleSignIn}
      >
        <SiGoogle className="text-2xl" />
        LOGIN WITH GOOGLE
      </button>
    </div>
  );
};

export default SocialLogin;
