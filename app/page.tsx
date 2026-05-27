import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import FeaturesSection from "./components/FeaturesSection";
import PopularSection from "./components/PopularSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import AppDownloadSection from "./components/AppDownloadSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="animated-bg">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <PopularSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <AppDownloadSection />
      <Footer />
    </main>
  );
}
