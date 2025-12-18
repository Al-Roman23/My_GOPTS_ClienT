import { Link } from "react-router";
import { motion } from "framer-motion";
import WorldMap from "../../../assets/World Map.svg";

const BannerSection = () => (
  <motion.section
    className="relative h-[80vh] flex flex-col justify-center items-center text-center text-white overflow-hidden rounded-2xl mt-5 mb-5"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div
      className="absolute inset-0 bg-center bg-cover"
      style={{ backgroundImage: `url(${WorldMap})` }}
    ></div>
    <div className="absolute inset-0 bg-black/60"></div>

    <motion.div
      className="relative z-10 px-6 flex flex-col items-center justify-center max-w-4xl"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-center mb-6">
        Smart Garments Order & Production Management
      </h1>
      <p className="text-lg sm:text-xl text-gray-200 mb-8 text-center max-w-2xl">
        Track your orders, manage production, and ensure timely delivery
        effortlessly.
      </p>
      <Link
        to="/all-products"
        className="bg-primary hover:bg-primary-dark transition text-white font-semibold px-6 py-3 rounded-lg shadow-lg"
      >
        Explore Our Products
      </Link>
    </motion.div>
  </motion.section>
);

export default BannerSection;
