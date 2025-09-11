import React from "react";
import Header from "../components/Landing/Header";
import Hero from "../components/Landing/Hero";
import Feature from "../components/Landing/Feature";
import HowItWorks from "../components/Landing/HowItWorks";
import Faq from "../components/Landing/Faq";
import Cta from "../components/Landing/Cta";
import Footer from "../components/Landing/Footer";
import Vision from "../components/Landing/Vision";

const Landingpage = () => {
  return (
    <div className="bg-[#f8f9fe] min-w-[350px]">

      <Header />
      <Hero />
      <Feature/>
      <HowItWorks/>
      <Vision/>
      <Faq/>
      <Cta/>
      <Footer/>
      
    </div>
  );
};

export default Landingpage;
