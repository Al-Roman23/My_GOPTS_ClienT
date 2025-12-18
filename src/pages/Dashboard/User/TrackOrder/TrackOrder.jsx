import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const TrackOrder = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaidOrders = async () => {
      try {
        const res = await axiosSecure.get(`/api/orders/user/${user.uid}`);
        const paidOrders = res.data.orders.filter(
          (order) => order.paymentStatus === "paid"
        );
        setOrders(paidOrders);
      } catch (error) {
        console.error("Failed to fetch paid orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchPaidOrders();
    }
  }, [user?.uid, axiosSecure]);

  const handleTrack = () => {
    navigate(`/track-order`);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!orders.length)
    return <p className="text-center">No paid orders found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Track Orders: Paid Orders</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Tracking ID</th>
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="border px-4 py-2 font-mono">
                  {order.trackingId}
                </td>
                <td className="border px-4 py-2">{order.productName}</td>
                <td className="border px-4 py-2">{order.quantity}</td>
                <td className="border px-4 py-2">{order.totalPrice}</td>
                <td className="border px-4 py-2 capitalize">{order.status}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={handleTrack}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Track Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackOrder;
