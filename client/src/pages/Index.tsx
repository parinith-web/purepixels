import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UseCaseGrid } from "@/components/landing/UseCaseGrid";
import { PricingPreview } from "@/components/landing/PricingPreview";
import { FAQSection } from "@/components/landing/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <UseCaseGrid />
      <PricingPreview />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
