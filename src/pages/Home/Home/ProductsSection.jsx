import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const fetchHomeProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/api/products?home=true&limit=6");
      const allProducts = Array.isArray(data) ? data : data.products || [];
      const filteredProducts = allProducts.filter(
        (product) => product.showOnHome
      );
      setProducts(filteredProducts.slice(0, 6));
    } catch (err) {
      Swal.fire("Error", "Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeProducts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner"></div>
      </div>
    );

  if (products.length === 0)
    return (
      <p className="text-center py-10 text-gray-500">No products available</p>
    );

  return (
    <section className="py-20 mt-5 mb-5">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-12"
      >
        Our Products
      </motion.h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
          >
            <img
              src={product.images?.[0] || "/placeholder.png"}
              className="h-48 w-full object-cover"
              alt={product.name}
            />

            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>

              <p className="text-sm text-gray-600 flex-1">
                {product.description.slice(0, 90)}...
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-primary">৳{product.price}</span>

                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
