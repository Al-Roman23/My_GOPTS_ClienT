import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const PendingOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch Pending Orders
  const { data, isLoading, isError } = useQuery({
    queryKey: ["manager-pending-orders"],
    queryFn: async () => {
      const response = await axiosSecure.get("api/orders/manager/pending");
      return response.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (orderId) =>
      (await axiosSecure.patch(`api/orders/manager/${orderId}/approve`)).data,
    onSuccess: () => {
      Swal.fire("Approved!", "Order approved successfully.", "success");
      queryClient.invalidateQueries(["manager-pending-orders"]);
    },
    onError: (error) =>
      Swal.fire(
        "Error!",
        error?.response?.data?.message || "Something went wrong.",
        "error"
      ),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ orderId, reason }) =>
      (
        await axiosSecure.patch(`api/orders/manager/${orderId}/reject`, {
          reason,
        })
      ).data,
    onSuccess: () => {
      Swal.fire("Rejected!", "Order rejected successfully.", "success");
      queryClient.invalidateQueries(["manager-pending-orders"]);
    },
    onError: (error) =>
      Swal.fire(
        "Error!",
        error?.response?.data?.message || "Something went wrong.",
        "error"
      ),
  });

  const handleApprove = (orderId) => {
    Swal.fire({
      title: "Approve this order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
    }).then((result) => {
      if (result.isConfirmed) approveMutation.mutate(orderId);
    });
  };

  const handleReject = (orderId) => {
    Swal.fire({
      title: "Reject Order",
      input: "textarea",
      inputLabel: "Rejection Reason",
      inputPlaceholder: "Write reason...",
      showCancelButton: true,
      inputValidator: (value) => !value && "Rejection reason is required!",
    }).then((result) => {
      if (result.isConfirmed)
        rejectMutation.mutate({ orderId, reason: result.value });
    });
  };

  const handleView = (orderId) =>
    navigate(`/dashboard/order-details/${orderId}`);

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500">Failed to load pending orders.</p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Orders</h1>

      {data?.orders?.length === 0 ? (
        <p>No pending orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Tracking ID</th>
                <th className="border px-4 py-2">Payment</th>
                <th className="border px-4 py-2">Payment Status</th>
                <th className="border px-4 py-2">Transaction ID</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border px-4 py-2">{order.trackingId}</td>
                  <td className="border px-4 py-2">
                    {order.paymentOption === "COD"
                      ? "Cash on Delivery"
                      : "PayFirst"}
                  </td>
                  <td className="border px-4 py-2">
                    {order.paymentStatus?.replace(/\b\w/g, (c) =>
                      c.toUpperCase()
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {order.paymentOption === "COD"
                      ? "N/A"
                      : order.transactionId || "N/A"}
                  </td>
                  <td className="border px-4 py-2">{order.productName}</td>
                  <td className="border px-4 py-2">{order.quantity}</td>
                  <td className="border px-4 py-2 space-x-2">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(order._id)}
                          disabled={approveMutation.isLoading}
                          className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(order._id)}
                          disabled={rejectMutation.isLoading}
                          className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleView(order._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    {order.status === "approved" && (
                      <button
                        onClick={() =>
                          navigate(`/dashboard/order/${order._id}/next`)
                        }
                        className="bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Next Step
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
