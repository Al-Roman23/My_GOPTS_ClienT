import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Buyer",
    feedback:
      "The platform made ordering garments effortless. Production tracking is very clear and reliable.",
    avatar: "https://i.ibb.co.com/mCrtpLPN/experts3.jpg",
  },
  {
    name: "Rahim Khan",
    role: "Manager",
    feedback:
      "Managing products and orders has never been easier. The dashboard is intuitive and fast.",
    avatar: "https://i.ibb.co.com/0j0qzB7G/experts1.jpg",
  },
  {
    name: "Nabila Roy",
    role: "Buyer",
    feedback:
      "I love how I can track my orders step-by-step. The notifications and updates are very helpful.",
    avatar: "https://i.ibb.co.com/Pv1Xgs5T/experts2.jpg",
  },
];

const CustomerFeedback = () => {
  const [current, setCurrent] = useState(0);
  const length = testimonials.length;

  const nextTestimonial = () => setCurrent((prev) => (prev + 1) % length);
  const prevTestimonial = () =>
    setCurrent((prev) => (prev - 1 + length) % length);

  return (
    <section className="py-20 rounded-2xl bg-gray-50 mb-5 mt-5">
      <h2 className="text-3xl font-bold text-center mb-12">
        Customer Feedback
      </h2>

      <div className="max-w-3xl mx-auto relative">
        <AnimatePresence>
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="p-8 bg-gray-100 dark:bg-neutral-800 rounded-2xl text-center shadow-md"
          >
            <div className="flex justify-center mb-4 text-primary text-2xl">
              <FaQuoteLeft />
            </div>

            <p className="text-gray-700 dark:text-gray-200 mb-6">
              {testimonials[current].feedback}
            </p>

            <div className="flex flex-col items-center">
              <img
                src={testimonials[current].avatar}
                alt={testimonials[current].name}
                className="w-16 h-16 rounded-full mb-2 object-cover"
              />
              <h3 className="font-semibold">{testimonials[current].name}</h3>
              <span className="text-sm text-gray-500">
                {testimonials[current].role}
              </span>
            </div>

            <div className="flex justify-center mt-6 gap-4 text-primary">
              <button
                onClick={prevTestimonial}
                className="btn btn-sm btn-circle"
              >
                ‹
              </button>
              <button
                onClick={nextTestimonial}
                className="btn btn-sm btn-circle"
              >
                ›
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CustomerFeedback;
