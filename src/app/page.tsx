import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import PlatformOverview from "@/components/landing/platform-overview";
import HowItWorks from "@/components/landing/how-it-works";
import ToolsSuite from "@/components/landing/tools-suite";
import TrustCta from "@/components/landing/trust-cta";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <PlatformOverview />
      <ToolsSuite />

      <HowItWorks />
      <TrustCta />
      <Footer />
    </main>
  );
}

