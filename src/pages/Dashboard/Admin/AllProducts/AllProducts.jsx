import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [isSuspended, setIsSuspended] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/api/products");
      setProducts(data || []);
    } catch {
      Swal.fire("Error", "Failed To Fetch Products!", "error");
    } finally {
      setLoading(false);
    }
  };

  const checkSuspension = async () => {
    try {
      const res = await axiosSecure.get("/api/users/me/status");
      setIsSuspended(res.data?.status === "suspended");
    } catch {
      setIsSuspended(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    checkSuspension();
  }, [user]);

  const handleShowOnHome = async (productId, show) => {
    if (isSuspended) return;
    try {
      await axiosSecure.patch(`/api/products/${productId}/show-on-home`, {
        show,
      });
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, showOnHome: show } : p))
      );
      Swal.fire("Success", "Product Updated Successfully!", "success");
    } catch {
      Swal.fire("Error", "Update Failed!", "error");
    }
  };

  const handleDelete = async (productId) => {
    if (isSuspended) return;
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;
    try {
      await axiosSecure.delete(`/api/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      Swal.fire("Deleted!", "Product has been deleted.", "success");
    } catch {
      Swal.fire("Error", "Delete Failed!", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner"></div>
      </div>
    );

  if (products.length === 0)
    return <p className="text-center py-4">No products found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>

      {isSuspended && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-center font-semibold">
          Your account is suspended. You cannot take any actions.
        </div>
      )}

      <div className="overflow-x-auto hidden sm:block">
        <table className="table-auto w-full border text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Created By</th>
              <th className="px-4 py-2">Show On Home</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b text-center">
                <td className="px-4 py-2">
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-16 h-16 object-cover mx-auto"
                  />
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(product.price)}
                </td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">{product.createdBy}</td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={product.showOnHome || false}
                    onChange={(e) =>
                      handleShowOnHome(product._id, e.target.checked)
                    }
                    disabled={isSuspended}
                  />
                </td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() =>
                      navigate(`/dashboard/admin/update-product/${product._id}`)
                    }
                    disabled={isSuspended}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(product._id)}
                    disabled={isSuspended}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded p-4 mb-4 shadow-sm bg-white"
          >
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <p>
              <strong>Name:</strong> {product.name}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(product.price)}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Created By:</strong> {product.createdBy}
            </p>
            <p className="flex items-center gap-2">
              <strong>Show On Home:</strong>
              <input
                type="checkbox"
                checked={product.showOnHome || false}
                onChange={(e) =>
                  handleShowOnHome(product._id, e.target.checked)
                }
                disabled={isSuspended}
              />
            </p>
            <div className="flex justify-between mt-2">
              <button
                className="btn btn-sm btn-warning"
                onClick={() =>
                  navigate(`/dashboard/admin/update-product/${product._id}`)
                }
                disabled={isSuspended}
              >
                Update
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => handleDelete(product._id)}
                disabled={isSuspended}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
