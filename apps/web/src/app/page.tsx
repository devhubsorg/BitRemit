import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { PaymentRailCards } from "@/components/PaymentRailCards";
import { HowItWorks } from "@/components/HowItWorks";
import { LiveStatsBar } from "@/components/LiveStatsBar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <LiveStatsBar />
        <PaymentRailCards />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
