import { TestnetBanner } from "@/components/TestnetBanner";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { PaymentRailCards } from "@/components/PaymentRailCards";
import { HowItWorks } from "@/components/HowItWorks";
import { LiveStatsBar } from "@/components/LiveStatsBar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col text-white"
      style={{ background: "#0D1117" }}
    >
      <TestnetBanner />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PaymentRailCards />
        <HowItWorks />
        <LiveStatsBar />
      </main>
      <Footer />
    </div>
  );
}
