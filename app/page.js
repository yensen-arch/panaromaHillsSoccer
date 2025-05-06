import Link from 'next/link';
import Image from 'next/image';
import { LatestUpdates } from '@/components/home/latest-updates';
import { HeroSection } from '@/components/home/hero-section';
import { AboutSection } from '@/components/home/about-section';
import { StatsSection } from '@/components/home/stats-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { JoinCTA } from '@/components/home/join-cta';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <HeroSection />
      
      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ltest Updates</h2>
          <div className="h-1 w-20 bg-primary-600 mx-auto"></div>
        </div>
        <LatestUpdates />
      </section>
      
      <AboutSection />
      
      <StatsSection />
      
      <section className="bg-primary-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-[400px] overflow-hidden rounded-lg">
              <Image 
                src="https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg" 
                alt="Football training" 
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Join Our Next Training Session</h2>
              <p className="text-lg text-gray-200">
                Whether you're a beginner or experienced player, our training sessions are designed to help you improve your skills in a fun and supportive environment.
              </p>
              <div className="pt-4">
                <Link href="/register" className="primary-button inline-block bg-white text-primary-800 border-2 border-white hover:bg-transparent hover:text-white">
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <TestimonialsSection />
      
      <JoinCTA />
      <Footer />
    </div>
  );
}