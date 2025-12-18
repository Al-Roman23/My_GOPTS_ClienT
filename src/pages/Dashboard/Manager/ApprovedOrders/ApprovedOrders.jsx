import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const allowedStatuses = [
  "Cutting Completed!",
  "Sewing Started!",
  "Finishing!",
  "QC Checked!",
  "Packed!",
  "Shipped!",
  "Out For Delivery!",
  "Delivered!",
];

const ApprovedOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["manager-approved-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("api/orders/manager/approved");
      return res.data;
    },
  });

  const addTrackingMutation = useMutation({
    mutationFn: async ({ id, status, location, note }) => {
      return axiosSecure.post(`/api/orders/manager/${id}/tracking`, {
        status,
        location,
        note,
      });
    },
    onSuccess: () => {
      Swal.fire("Success", "Tracking log added successfully!", "success");
      queryClient.invalidateQueries(["manager-approved-orders"]);
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Something went wrong!",
        "error"
      );
    },
  });

  const handleAddTracking = (order) => {
    Swal.fire({
      title: `Add Tracking - ${order.productName}`,
      html: `<select id="status" class="swal2-select">
      <option value="" disabled selected>Select status</option>
      ${allowedStatuses
        .map((s) => `<option value="${s}">${s}</option>`)
        .join("")}
    </select>
    <input id="location" class="swal2-input" placeholder="Location">
    <textarea id="note" class="swal2-textarea" placeholder="Note (optional)"></textarea>`,
      showCancelButton: true,
      preConfirm: () => {
        const status = document.getElementById("status").value;
        const location = document.getElementById("location").value;
        const note = document.getElementById("note").value;
        if (!status || !location) {
          Swal.showValidationMessage("Status and Location are required!");
          return false;
        }
        return { status, location, note };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        addTrackingMutation.mutate({ id: order._id, ...result.value });
      }
    });
  };

  const viewTracking = () => {
    navigate(`/track-order`);
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError || !data?.orders)
    return (
      <p className="text-center text-red-500">
        Failed to load approved orders.
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Approved Orders</h1>
      {data.orders.length === 0 ? (
        <p>No approved orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Tracking ID</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Approved Date</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border px-4 py-2">{order.trackingId}</td>
                  <td className="border px-4 py-2">{order.userName}</td>
                  <td className="border px-4 py-2">{order.productName}</td>
                  <td className="border px-4 py-2">{order.status}</td>
                  <td className="border px-4 py-2">
                    {new Date(order.approvedAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleAddTracking(order)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Add Tracking
                    </button>
                    <button
                      onClick={viewTracking}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View Tracking
                    </button>
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

export default ApprovedOrders;
