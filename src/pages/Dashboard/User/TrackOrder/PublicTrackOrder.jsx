import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://mygopts.vercel.app",
});

const PublicTrackOrder = () => {
  const { trackingId: paramId } = useParams();
  const [trackingId, setTrackingId] = useState(paramId || "");

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["track-order", trackingId],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/api/orders/public/track/${trackingId}`
      );
      return res.data;
    },
    enabled: !!trackingId,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim()) refetch();
  };

  return (
    <div className="bg-gray-50 min-h-[80vh] flex flex-col items-center justify-start rounded-2xl mt-5 mb-5 px-4 py-6">
      <h2 className="text-4xl font-bold mb-6 text-center">Track Your Order</h2>
      <form
        onSubmit={handleSearch}
        className="mb-6 flex gap-2 w-full max-w-sm mx-auto"
      >
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary px-4 text-black">
          Track
        </button>
      </form>
      {isLoading && <p>Loading order details...</p>}
      {isError && (
        <p className="text-red-500 text-center">
          Failed to load order. {error?.message || ""}
        </p>
      )}
      {!isLoading && !isError && order && (
        <div className="w-full max-w-md bg-white border rounded p-4 space-y-4">
          <p>
            <strong>Tracking ID:</strong> {order.trackingId}
          </p>
          <p>
            <strong>User:</strong> {order.userName} ({order.userEmail})
          </p>
          <p>
            <strong>Product:</strong> {order.productName}
          </p>
          <p>
            <strong>Quantity:</strong> {order.quantity}
          </p>
          <p>
            <strong>Total Price:</strong> ${order.totalPrice}
          </p>
          <p>
            <strong className="capitalize">Status:</strong>{" "}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </p>
          <p>
            <strong className="capitalize">Payment:</strong>{" "}
            {order.paymentOption} -{" "}
            {order.paymentStatus.charAt(0).toUpperCase() +
              order.paymentStatus.slice(1)}
          </p>
          {order.approvedAt && (
            <p>
              <strong>Approved At:</strong>{" "}
              {new Date(
                order.approvedAt.$date || order.approvedAt
              ).toLocaleString()}
            </p>
          )}
          {order.managerEmail && (
            <p>
              <strong>Approved By:</strong> {order.managerEmail}
            </p>
          )}
          <h3 className="text-xl font-semibold mt-4 mb-2 text-center">
            Tracking Logs
          </h3>
          {order.trackingLogs?.length === 0 ? (
            <p className="text-red-500 text-center">
              No tracking logs available.
            </p>
          ) : (
            order.trackingLogs.map((log, idx) => (
              <div key={idx} className="border p-3 rounded mb-2">
                <p>
                  <strong>Status:</strong> {log.status}
                </p>
                <p>
                  <strong>Location:</strong> {log.location}
                </p>
                <p>
                  <strong>Note:</strong> {log.note || "N/A"}
                </p>
                <p>
                  <strong>By:</strong> {log.by?.role || "System"}{" "}
                  {log.by?.email ? `(${log.by.email})` : ""}
                </p>
                {log.createdAt && (
                  <p className="text-sm text-gray-500">
                    {new Date(
                      log.createdAt.$date || log.createdAt
                    ).toLocaleString()}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PublicTrackOrder;
