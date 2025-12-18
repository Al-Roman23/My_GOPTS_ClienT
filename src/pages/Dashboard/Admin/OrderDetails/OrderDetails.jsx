import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useUserRole from "../../../../hooks/useUserRole";

const OrderDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { role, isLoading: roleLoading } = useUserRole();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        let res;
        if (role === "admin") {
          res = await axiosSecure.get(`/api/orders/${id}`);
        } else if (role === "manager") {
          res = await axiosSecure.get(
            `/api/orders/manager/order-details/${id}`
          );
        }
        setOrder(res.data);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch order details!", "error");
      } finally {
        setLoading(false);
      }
    };
    if (!roleLoading) {
      fetchOrder();
    }
  }, [id, role, roleLoading, axiosSecure]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!order) return <p className="text-center py-10">Order not found!</p>;

  const createdAt = order.createdAt || null;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">General Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <span className="font-semibold">Tracking ID:</span>{" "}
            {String(order.trackingId)}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`capitalize font-medium ${
                order.status === "pending"
                  ? "text-yellow-500"
                  : order.status === "canceled"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {String(order.status)}
            </span>
          </p>
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {createdAt ? new Date(createdAt).toLocaleString() : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Payment Option:</span>{" "}
            {String(order.paymentOption)}{" "}
            <span
              className={`ml-2 font-medium ${
                order.paymentStatus === "paid"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              (
              {order.paymentStatus
                ?.toLowerCase()
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              )
            </span>
          </p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {String(order.firstName)} {String(order.lastName)}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {String(order.userEmail)}
          </p>
          <p>
            <span className="font-semibold">Contact:</span>{" "}
            {String(order.contactNumber)}
          </p>
          <p>
            <span className="font-semibold">Manager Email:</span>{" "}
            {String(order.managerEmail || "N/A")}
          </p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Product Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <span className="font-semibold">Product Name:</span>{" "}
            {String(order.productName)}
          </p>
          <p>
            <span className="font-semibold">Quantity:</span>{" "}
            {Number(order.quantity || 0)}
          </p>
          <p>
            <span className="font-semibold">Price:</span> $
            {Number(order.price || 0).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Total Price:</span> $
            {Number(order.totalPrice || 0).toLocaleString()}
          </p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Delivery & Notes</h2>
        <p>
          <span className="font-semibold">Address:</span>{" "}
          {String(order.deliveryAddress || "N/A")}
        </p>
        <p>
          <span className="font-semibold">Additional Notes:</span>{" "}
          {String(order.additionalNotes || "N/A")}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Tracking Logs</h2>
        {Array.isArray(order.trackingLogs) && order.trackingLogs.length > 0 ? (
          <ul className="space-y-3">
            {order.trackingLogs.map((log, idx) => (
              <li
                key={log.trackingId || idx}
                className="p-3 border rounded-md bg-gray-50"
              >
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {String(log.status)}
                </p>
                <p>
                  <span className="font-semibold">Message:</span>{" "}
                  {String(log.message)}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {typeof log.location === "object"
                    ? String(log.location?.name || log.location?.city || "N/A")
                    : String(log.location || "N/A")}
                </p>
                <p>
                  <span className="font-semibold">By:</span>{" "}
                  {typeof log.by === "object"
                    ? String(log.by?.name || log.by?.email || "System")
                    : String(log.by || "System")}
                </p>
                <p className="text-sm text-gray-500">
                  {log.createdAt
                    ? new Date(log.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tracking logs yet.</p>
        )}
      </section>
    </div>
  );
};

export default OrderDetails;
