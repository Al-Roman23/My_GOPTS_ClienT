import { motion } from "framer-motion";
import { FaBoxOpen, FaUsers, FaCheckCircle, FaIndustry } from "react-icons/fa";

const stats = [
  {
    icon: <FaBoxOpen className="text-4xl text-primary" />,
    value: 120,
    label: "Products",
  },
  {
    icon: <FaUsers className="text-4xl text-primary" />,
    value: 75,
    label: "Happy Customers",
  },
  {
    icon: <FaCheckCircle className="text-4xl text-primary" />,
    value: 250,
    label: "Orders Completed",
  },
  {
    icon: <FaIndustry className="text-4xl text-primary" />,
    value: 8,
    label: "Active Managers",
  },
];

const StatisticsSection = () => (
  <section className="py-20 bg-gray-50 rounded-2xl mb-5 mt-5">
    <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
          className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-md flex flex-col items-center"
        >
          {stat.icon}
          <h3 className="text-3xl font-bold mt-4">{stat.value}+</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default StatisticsSection;
