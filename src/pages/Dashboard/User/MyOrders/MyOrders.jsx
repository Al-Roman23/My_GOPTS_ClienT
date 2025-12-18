import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const MyOrders = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/orders/user/${user.uid}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (orderId) => axiosSecure.delete(`/api/orders/${orderId}`),
    onSuccess: () => {
      Swal.fire("Deleted!", "Order has been canceled.", "success");
      queryClient.invalidateQueries(["my-orders"]);
    },
  });

  const handleCancel = (orderId) => {
    Swal.fire({
      title: "Cancel This Order?",
      text: "This will permanently delete your order. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(orderId);
    });
  };

  const handlePay = async (trackingId) => {
    try {
      const res = await axiosSecure.post(`/api/payments/create-session`, {
        trackingId,
      });
      window.location.href = res.data.url;
    } catch (error) {
      Swal.fire("Error", "Payment initiation failed", "error");
    }
  };

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (!sessionId) return;

    const confirmPayment = async () => {
      try {
        await axiosSecure.patch(
          `/api/payments/payment-success?session_id=${sessionId}`
        );
        queryClient.invalidateQueries(["my-orders"]);
        window.history.replaceState({}, document.title, "/dashboard/my-orders");
        Swal.fire(
          "Payment Successful!",
          "Your payment has been confirmed.",
          "success"
        );
      } catch {
        Swal.fire("Error", "Payment confirmation failed", "error");
      }
    };

    confirmPayment();
  }, [axiosSecure, queryClient]);

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {data?.orders?.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Tracking ID</th>
                <th className="border px-4 py-2">Payment Option</th>
                <th className="border px-4 py-2">Payment Status</th>
                <th className="border px-4 py-2">Transaction ID</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border px-4 py-2 font-mono">
                    {order.trackingId}
                  </td>
                  <td className="border px-4 py-2">
                    {order.paymentOption === "COD" ? (
                      "Cash on Delivery"
                    ) : (
                      <div className="flex items-center gap-2 justify-center">
                        <span className="font-medium">Pay First</span>
                        {order.paymentStatus === "paid" ? (
                          <span className="text-green-600 font-semibold">
                            Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePay(order.trackingId)}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {order.paymentStatus}
                  </td>
                  <td className="border px-4 py-2">
                    {order.paymentStatus === "paid"
                      ? order.transactionId
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">{order.productName}</td>
                  <td className="border px-4 py-2">{order.quantity}</td>
                  <td className="border px-4 py-2 capitalize">
                    {order.status}
                  </td>
                  <td className="border px-4 py-2">
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Cancel
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

export default MyOrders;
