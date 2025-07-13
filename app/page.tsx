'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowFanifyWorks from '@/components/HowFanifyWorks';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <HowFanifyWorks />
      <FAQ />
      <Footer />
    </main>
  );
}