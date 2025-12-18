import { motion } from "framer-motion";

const CTASection = () => (
  <section className="py-20 text-black rounded-2xl bg-gray-50 mb-5 mt-5">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto text-center"
    >
      <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
      <p className="mb-6">
        Subscribe to our newsletter for the latest products and updates.
      </p>
      <form className="flex flex-col sm:flex-row gap-3 justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-3 rounded-lg text-black flex-1"
        />
        <button type="submit" className="btn btn-secondary px-6 py-3">
          Subscribe
        </button>
      </form>
    </motion.div>
  </section>
);

export default CTASection;
