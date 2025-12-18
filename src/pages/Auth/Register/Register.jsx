import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import SocialLogin from "../SocialLogin/SocialLogin";

const validationRules = {
  name: { required: "Name Is Required!" },
  email: { required: "Email Is Required!" },
  password: {
    required: "Password Is Required!",
    minLength: { value: 6, message: "Password Must Be At Least 6 Characters!" },
    validate: {
      hasUpper: (value) =>
        /[A-Z]/.test(value) || "Must Contain One Uppercase Letter!",
      hasLower: (value) =>
        /[a-z]/.test(value) || "Must Contain One Lowercase Letter!",
    },
  },
  role: { required: "Role Is Required!" },
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { registerUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userCredential = await registerUser(data.email, data.password);
      const firebaseUser = userCredential.user;

      await updateUserProfile({
        displayName: data.name,
        photoURL: data.photoURL || "",
      });

      const userPayload = {
        uid: firebaseUser.uid,
        name: data.name,
        email: data.email,
        photoURL: data.photoURL || "",
        role: data.role,
        status: "pending",
      };

      await axiosSecure.post("/api/users", userPayload);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Welcome To The Platform!",
        timer: 1600,
        showConfirmButton: false,
      });

      reset();
      navigate(location?.state || "/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed!",
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 px-4 py-10 rounded-2xl">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-200 mb-6">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter Your Full Name"
              {...register("name", validationRules.name)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="Enter Your Email"
              {...register("email", validationRules.email)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1 dark:text-gray-300">
              Photo URL
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="Paste Image URL"
              {...register("photoURL")}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 dark:text-gray-300">
              Select Role
            </label>
            <select
              className="select select-bordered w-full"
              {...register("role", validationRules.role)}
            >
              <option value="">Choose Role</option>
              <option value="buyer">Buyer</option>
              <option value="manager">Manager</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Enter Password"
              {...register("password", validationRules.password)}
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
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-gray-700 dark:text-gray-300 pt-2">
            Already Have An Account?
            <Link to="/login" className="text-blue-600 ml-1 hover:underline">
              Login
            </Link>
          </p>

          <div className="mt-6">
            <SocialLogin />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
