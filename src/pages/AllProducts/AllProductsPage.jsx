import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosSecure.get("/api/products");
        setProducts(
          Array.isArray(res.data) ? res.data : res.data.products || []
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading products...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-5 text-red-500">{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-5 text-gray-500">No products found.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
      {products.map((product) => (
        <div
          key={product._id}
          className="border rounded shadow p-4 flex flex-col"
        >
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            className="w-full h-48 object-cover rounded"
          />
          <h2 className="font-bold text-lg mt-2">{product.name}</h2>
          <p className="text-gray-600">Category: {product.category}</p>
          <p className="text-gray-600">Price: ₹{product.price}</p>
          <p className="text-gray-600">Available: {product.quantity}</p>
          <button
            className="mt-auto px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default AllProductsPage;
