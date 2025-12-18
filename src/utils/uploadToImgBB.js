import axios from "axios";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const uploadToImgBB = async (files) => {
  const uploadedUrls = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData
    );

    uploadedUrls.push(res.data.data.url);
  }

  return uploadedUrls;
};
