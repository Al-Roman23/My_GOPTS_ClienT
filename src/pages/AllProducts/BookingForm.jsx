import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const watchQuantity = watch("quantity", 0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosSecure.get(`/api/products/${id}`);
        setProduct(res.data);
        setValue("quantity", res.data.moq || 1);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [axiosSecure, id, setValue]);

  if (loading || roleLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="text-center p-5 text-red-500">Product not found</div>
    );
  }

  const isBookingDisabled =
    !user || ["admin", "manager"].includes(role) || user.isSuspended;

  const handleBooking = async (data) => {
    if (!product) return;
    const quantity = Number(data.quantity);

    if (quantity > product.quantity) {
      toast.error(
        `Cannot order more than available quantity (${product.quantity})`
      );
      return;
    }

    if (quantity < product.moq) {
      toast.error(
        `Cannot order less than minimum order quantity (${product.moq})`
      );
      return;
    }

    const totalPrice = quantity * product.price;

    const bookingData = {
      userId: user.uid,
      userName: `${data.firstName} ${data.lastName}`,
      userEmail: user.email,
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: Number(data.quantity),
      totalPrice: totalPrice,
      firstName: data.firstName,
      lastName: data.lastName,
      contactNumber: data.contactNumber,
      deliveryAddress: data.deliveryAddress,
      additionalNotes: data.additionalNotes || "",
      status: "pending",
      paymentOption: product.paymentOption,
      managerEmail: product.managerEmail,
    };

    try {
      setSubmitting(true);
      const res = await axiosSecure.post("/api/orders", bookingData);
      toast.success("Order placed successfully!");
      navigate("/dashboard/my-orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Book Product: {product.name}</h1>
      <form onSubmit={handleSubmit(handleBooking)} className="space-y-4">
        <input
          type="email"
          value={user.email}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
        <input
          type="text"
          value={product.name}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
        <input
          type="number"
          value={product.price}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
        <div>
          <label>First Name *</label>
          <input
            type="text"
            {...register("firstName", { required: true })}
            className="w-full border p-2 rounded"
          />
          {errors.firstName && (
            <p className="text-red-500">First name is required</p>
          )}
        </div>
        <div>
          <label>Last Name *</label>
          <input
            type="text"
            {...register("lastName", { required: true })}
            className="w-full border p-2 rounded"
          />
          {errors.lastName && (
            <p className="text-red-500">Last name is required</p>
          )}
        </div>
        <div>
          <label>Order Quantity *</label>
          <input
            type="number"
            {...register("quantity", {
              required: true,
              min: product.moq,
              max: product.quantity,
            })}
            className="w-full border p-2 rounded"
          />
          {errors.quantity && (
            <p className="text-red-500">Enter a valid quantity</p>
          )}
        </div>
        <label>Total Price *</label>
        <input
          type="number"
          value={watchQuantity * product.price}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
          placeholder="Total Price"
        />
        <div>
          <label>Contact Number *</label>
          <input
            type="text"
            {...register("contactNumber", { required: true })}
            className="w-full border p-2 rounded"
          />
          {errors.contactNumber && (
            <p className="text-red-500">Contact number is required</p>
          )}
        </div>
        <div>
          <label>Delivery Address *</label>
          <textarea
            {...register("deliveryAddress", { required: true })}
            className="w-full border p-2 rounded"
          />
          {errors.deliveryAddress && (
            <p className="text-red-500">Delivery address is required</p>
          )}
        </div>
        <div>
          <label>Additional Notes</label>
          <textarea
            {...register("additionalNotes")}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isBookingDisabled || submitting}
          className={`w-full px-4 py-2 rounded text-white ${
            isBookingDisabled
              ? "bg-gray-400"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {submitting ? "Placing Order..." : "Order Now"}
        </button>
        {isBookingDisabled && (
          <p className="text-red-500 text-sm mt-1">
            Only buyers with active accounts can place orders.
          </p>
        )}
      </form>
    </div>
  );
};

export default BookingForm;
