import { Header } from "@/components/Header";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

// 3. Use the renamed section inside the actual Page component
const PricingPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      <main>
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;