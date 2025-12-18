import React from "react";
import BannerSection from "./BannerSection";
import ProductsSection from "./ProductsSection";
import HowItWorks from "./HowItWorks";
import CustomerFeedback from "./CustomerFeedback";
import StatisticsSection from "./StatisticsSection";
import CTASection from "./CTASection";

const Home = () => {
  return (
    <div>
      <BannerSection />
      <ProductsSection />
      <HowItWorks />
      <CustomerFeedback />
      <StatisticsSection />
      <CTASection />
    </div>
  );
};

export default Home;
