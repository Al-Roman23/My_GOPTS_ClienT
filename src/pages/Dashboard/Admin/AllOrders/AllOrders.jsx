import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useUserRole from "../../../../hooks/useUserRole";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { debounce } from "lodash";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const navigate = useNavigate();
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();

  const fetchOrders = useCallback(async () => {
    if (role !== "admin") return;
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/api/orders", {
        params: { status: statusFilter, search, page, limit },
      });
      setOrders(data.orders);
      setTotal(data.total);
    } catch {
      Swal.fire("Error", "Failed to fetch orders!", "error");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, statusFilter, search, page, limit, role]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      setSearch(value);
    }, 500),
    []
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleView = (id) => {
    navigate(`/dashboard/order-details/${id}`);
  };

  const totalPages = Math.ceil(total / limit);
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner"></div>
      </div>
    );

  if (!orders.length)
    return <p className="text-center py-4">No Orders Found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by Tracking ID or Email..."
          className="input input-bordered w-full sm:w-64"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
        <select
          className="select select-bordered w-full sm:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Tracking ID</th>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Qty</th>
              <th className="border px-4 py-2">Payment Option</th>
              <th className="border px-4 py-2">Payment Status</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="text-center border-b hover:bg-gray-50 transition-colors"
              >
                <td className="border px-4 py-2 font-mono">
                  {order.trackingId}
                </td>
                <td className="border px-4 py-2">{order.userName}</td>
                <td className="border px-4 py-2">{order.userEmail}</td>
                <td className="border px-4 py-2">{order.productName}</td>
                <td className="border px-4 py-2">{order.quantity}</td>
                <td className="border px-4 py-2">
                  {order.paymentOption === "COD"
                    ? "Cash on Delivery"
                    : "Pay First"}
                </td>
                <td
                  className={`border px-4 py-2 font-semibold capitalize ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.paymentStatus}
                </td>
                <td
                  className={`border px-4 py-2 font-semibold capitalize ${
                    order.status === "pending"
                      ? "text-yellow-500"
                      : order.status === "completed"
                      ? "text-green-600"
                      : order.status === "canceled"
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  {order.status}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => handleView(order._id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-3">
        <button
          className="btn btn-sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllOrders;
