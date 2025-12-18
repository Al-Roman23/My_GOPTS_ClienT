import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { uploadToImgBB } from "../../../../utils/uploadToImgBB";

const AdminUpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [previewImages, setPreviewImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const watchImages = watch("images");

  const { data: product } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/products/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        availableQty: product.quantity,
        moq: product.moq,
        paymentOption: product.paymentOption,
        demoVideo: product.videoLink,
        showOnHome: product.showOnHome,
      });
      setPreviewImages(product.images);
    }
  }, [product, reset]);

  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      const previews = Array.from(watchImages).map((file) =>
        URL.createObjectURL(file)
      );
      setNewImages(previews);
    } else {
      setNewImages([]);
    }
  }, [watchImages]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData) =>
      await axiosSecure.patch(`/api/products/${id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-products"]);
      toast.success("Product updated successfully!");
      navigate("/dashboard/all-products");
    },
    onError: () => toast.error("Failed to update product!"),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let uploadedImages = previewImages;

      if (data.images && data.images.length > 0) {
        const newImageUrls = await uploadToImgBB(data.images);
        uploadedImages = [...previewImages, ...newImageUrls];
      }

      const updatedProduct = {
        name: data.name,
        description: data.description,
        category: data.category,
        price: Number(data.price),
        quantity: Number(data.availableQty),
        moq: Number(data.moq),
        images: uploadedImages,
        videoLink: data.demoVideo || "",
        paymentOption: data.paymentOption,
        showOnHome: Boolean(data.showOnHome),
        updatedAt: new Date(),
      };

      await updateMutation.mutateAsync(updatedProduct);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (url) => {
    setPreviewImages((prev) => prev.filter((img) => img !== url));
  };

  if (!product)
    return <div className="text-center p-5">Loading product...</div>;

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Update Product (Admin)</h1>

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
        </div>

        <div>
          <label>Price *</label>
          <input
            type="number"
            {...register("price", { required: "Price is required", min: 0 })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Available Quantity *</label>
          <input
            type="number"
            {...register("availableQty", {
              required: "Quantity is required",
              min: 0,
            })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Minimum Order Quantity (MOQ) *</label>
          <input
            type="number"
            {...register("moq", { required: "MOQ is required", min: 1 })}
            className="w-full border p-2 rounded"
          />
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
          <label className="block mb-1">Upload New Images</label>
          <input
            type="file"
            {...register("images")}
            multiple
            accept="image/*"
            className="w-full border p-2 rounded cursor-pointer"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {previewImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt="Preview"
                  className="w-20 h-20 object-cover border rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            {newImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="New Preview"
                className="w-20 h-20 object-cover border rounded"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminUpdateProduct;
