import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaIndustry,
  FaCheckCircle,
  FaTruck,
} from "react-icons/fa";

const steps = [
  {
    title: "Place Order",
    description:
      "Select your desired garments and submit an order easily online.",
    icon: <FaShoppingCart className="text-4xl text-primary" />,
  },
  {
    title: "Production Starts",
    description:
      "Our team starts production following the cutting, sewing, and finishing process.",
    icon: <FaIndustry className="text-4xl text-primary" />,
  },
  {
    title: "Quality Check",
    description:
      "Every product goes through strict quality checks to ensure excellence.",
    icon: <FaCheckCircle className="text-4xl text-primary" />,
  },
  {
    title: "Shipping & Delivery",
    description:
      "Finished products are shipped quickly and delivered to your doorstep.",
    icon: <FaTruck className="text-4xl text-primary" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-50 rounded-2xl mb-5 mt-5">
      <motion.h2
        className="text-3xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        How It Works
      </motion.h2>

      <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-neutral-500 p-8 rounded-2xl shadow-md flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            {step.icon}
            <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
