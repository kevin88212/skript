"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import FeaturesSection from "./components/FeaturesSection";
import DealsSection from "./components/DealsSection";
import PopularSection from "./components/PopularSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import AppDownloadSection from "./components/AppDownloadSection";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import CustomCursor from "./components/CustomCursor";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      <CustomCursor />
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <main className="animated-bg" style={{ opacity: splashDone ? 1 : 0, transition: "opacity 0.5s ease" }}>
        <Navbar />
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <DealsSection />
        <PopularSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <AppDownloadSection />
        <Footer />
      </main>
    </>
  );
}
