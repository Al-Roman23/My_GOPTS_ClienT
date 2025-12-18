import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { uploadToImgBB } from "../../../../utils/uploadToImgBB";
import useAuth from "../../../../hooks/useAuth";

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const watchImages = watch("images");

  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      setPreviewImages(
        Array.from(watchImages).map((file) => URL.createObjectURL(file))
      );
    } else {
      setPreviewImages([]);
    }
  }, [watchImages]);

  if (user.status === "pending" || user.suspend?.isSuspended) {
    return (
      <div className="max-w-3xl mx-auto p-5 text-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        {user.status === "pending"
          ? "Your account is pending approval. You cannot add products."
          : "Your account is suspended. You cannot add products."}
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const imageUrls = await uploadToImgBB(data.images);

      const productData = {
        name: data.name,
        description: data.description,
        category: data.category,
        price: Number(data.price),
        quantity: Number(data.availableQty),
        moq: Number(data.moq),
        images: imageUrls,
        videoLink: data.demoVideo || "",
        paymentOption: data.paymentOption,
        showOnHome: Boolean(data.showOnHome),
        managerEmail: user.email,
      };

      await axiosSecure.post("/api/products", productData);
      toast.success("Product added successfully!");
      reset();
      setPreviewImages([]);
    } catch {
      toast.error("Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Add Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Product Name *</label>
          <input
            type="text"
            {...register("name", { required: "Product Name is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label>Description *</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full border p-2 rounded"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label>Category *</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="Shirt">Shirt</option>
            <option value="Pant">Pant</option>
            <option value="Jacket">Jacket</option>
            <option value="Accessories">Accessories</option>
          </select>
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label>Price *</label>
          <input
            type="number"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className="w-full border p-2 rounded"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label>Available Quantity *</label>
          <input
            type="number"
            {...register("availableQty", {
              required: "Available quantity is required",
              min: 0,
            })}
            className="w-full border p-2 rounded"
          />
          {errors.availableQty && (
            <p className="text-red-500">{errors.availableQty.message}</p>
          )}
        </div>

        <div>
          <label>Minimum Order Quantity (MOQ) *</label>
          <input
            type="number"
            {...register("moq", { required: "MOQ is required", min: 1 })}
            className="w-full border p-2 rounded"
          />
          {errors.moq && <p className="text-red-500">{errors.moq.message}</p>}
        </div>

        <div>
          <label>Demo Video Link</label>
          <input
            type="url"
            {...register("demoVideo")}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Payment Option *</label>
          <select
            {...register("paymentOption", { required: true })}
            className="w-full border p-2 rounded"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="PayFirst">PayFirst</option>
          </select>
        </div>

        <div>
          <label>
            <input type="checkbox" {...register("showOnHome")} /> Show On Home
            Page
          </label>
        </div>

        <div>
          <label className="block mb-1">Upload Images *</label>
          <input
            type="file"
            {...register("images", {
              required: "At least one image is required",
            })}
            multiple
            accept="image/*"
            className="w-full border p-2 rounded cursor-pointer"
          />
          {errors.images && (
            <p className="text-red-500 mt-1">{errors.images.message}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {previewImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Preview"
                className="w-20 h-20 object-cover border rounded"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
