import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative h-[90vh] bg-hero-pattern bg-cover bg-center">
      <div className="hero-overlay"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
          Panaroma Hills Soccer Club
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8 animate-fade-in">
          Join our community of football enthusiasts and be part of something special
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Link 
            href="/register" 
            className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-8 rounded-full font-semibold transform transition-all duration-300 hover:scale-105"
          >
            Join the Club
          </Link>
          <Link 
            href="/latest" 
            className="bg-transparent hover:bg-white/20 text-white border-2 border-white py-3 px-8 rounded-full font-semibold transform transition-all duration-300 hover:scale-105"
          >
            Latest News
          </Link>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <ChevronDown className="w-8 h-8 text-white animate-bounce-subtle" />
      </div>
    </section>
  );
}