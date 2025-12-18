import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";

const ManageProducts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["my-products", searchTerm, categoryFilter],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/products/manager/my-products", {
        params: { category: categoryFilter },
      });

      return res.data.products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      await axiosSecure.delete(`/api/products/manager/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries(["my-products"]);
      toast.success("Product deleted successfully!");
    },

    onError: () => toast.error("Failed to delete product."),
  });

  const handleDelete = (product) => {
    Swal.fire({
      title: `Delete "${product.name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(product._id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-5 text-center text-gray-500">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Manage Products</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-7">
        <input
          type="text"
          placeholder="Search by product name..."
          className="border p-2 rounded w-full sm:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full sm:w-1/5"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Shirt">Shirt</option>
          <option value="Pant">Pant</option>
          <option value="Jacket">Jacket</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Payment Mode</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}

            {data.map((product, index) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>

                <td className="p-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded border mx-auto"
                  />
                </td>

                <td className="p-3">{product.name}</td>
                <td className="p-3">₹{product.price}</td>
                <td className="p-3">{product.paymentOption}</td>

                <td className="p-3 flex gap-2 justify-center">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white"
                    onClick={() =>
                      navigate(`/dashboard/update-product/${product._id}`)
                    }
                    disabled={
                      product.status === "suspended" ||
                      product.status === "pending"
                    }
                  >
                    Update
                  </button>

                  <button
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                    onClick={() => handleDelete(product)}
                    disabled={
                      product.status === "suspended" ||
                      product.status === "pending"
                    }
                  >
                    Delete
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

export default ManageProducts;
