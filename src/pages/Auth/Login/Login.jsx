import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userCredential = await signInUser(data.email, data.password);
      const user = userCredential.user;

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome Back ${user.displayName || user.email}`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(location?.state?.from || "/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed!",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 px-4 py-10 rounded-2xl">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-200 mb-6">
          Login To Your Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="Enter Your Email"
              {...register("email", { required: "Email Is Required!" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Enter Your Password"
              {...register("password", { required: "Password Is Required!" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          <p className="text-center text-gray-700 dark:text-gray-300 pt-2">
            Don't Have An Account?
            <Link to="/register" className="text-blue-600 ml-1 hover:underline">
              Register
            </Link>
          </p>
        </form>

        <div className="mt-6">
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Login;
