import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosSecure.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch product details!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [axiosSecure, id]);

  if (loading || roleLoading) {
    return (
      <div className="text-center py-10 text-lg text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-lg text-red-500">
        Product not found!
      </div>
    );
  }

  const isBookingDisabled =
    !user || ["admin", "manager"].includes(role) || user.suspend?.isSuspended;

  const handleOrderClick = () => {
    if (isBookingDisabled) return;
    navigate(`/booking/${product._id}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-5 mb-5">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        {product.name}
      </h1>

      <div className="flex gap-6 mb-8 overflow-x-auto">
        {product.images?.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={product.name}
            className="w-60 h-60 object-cover rounded-lg shadow-md"
          />
        ))}
        {product.videoLink && (
          <video controls className="w-60 h-60 rounded-lg shadow-md">
            <source src={product.videoLink} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className="space-y-4 mb-8 text-lg text-gray-700">
        <p>
          <strong>Description:</strong> {product.description}
        </p>
        <p>
          <strong>Category:</strong> {product.category}
        </p>
        <p>
          <strong>Price:</strong> ₹{product.price}
        </p>
        <p>
          <strong>Available Quantity:</strong> {product.quantity}
        </p>
        <p>
          <strong>Minimum Order:</strong> {product.moq}
        </p>
        <p>
          <strong>Payment Option:</strong> {product.paymentOption}
        </p>
      </div>

      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={handleOrderClick}
          disabled={isBookingDisabled}
          className={`px-6 py-3 rounded-lg text-white text-lg font-semibold transition duration-200 ${
            isBookingDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Order / Booking
        </button>
      </div>

      {isBookingDisabled && (
        <div className="mt-4 text-center text-red-600 text-sm">
          {["admin", "manager"].includes(role) ? (
            <p>
              You have administrative privileges. You can directly manage
              bookings for this product.
            </p>
          ) : (
            <p>
              Your account is suspended. Booking is not allowed until your
              account is active.
            </p>
          )}
        </div>
      )}

      {/* Additional Role-based Information */}
      {role === "admin" && (
        <div className="mt-4 text-center text-blue-600 text-sm">
          <p>
            Admins can manage all products and orders directly from the
            dashboard.
          </p>
        </div>
      )}
      {role === "manager" && (
        <div className="mt-4 text-center text-blue-600 text-sm">
          <p>Managers can approve or deny booking requests for products.</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
