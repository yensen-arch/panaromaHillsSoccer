import { HeroSection } from '@/components/home/hero-section';
import { AboutSection } from '@/components/home/about-section';
import { StatsSection } from '@/components/home/stats-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { JoinCTA } from '@/components/home/join-cta';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <TestimonialsSection />
      <JoinCTA />
    </div>
  );
}
