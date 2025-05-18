'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Cog } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => pathname === path;

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-primary-800 py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <Cog className="h-8 w-8 text-primary-600 rotate-45" />
              <span className={`font-bold text-xl ${isScrolled ? 'text-primary-800' : 'text-white'}`}>
                Panaroma Hills Soccer Club
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`${
                isActive('/') 
                  ? 'text-primary-600 font-semibold' 
                  : isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-primary-200'
              } transition-colors duration-300`}
            >
              Home
            </Link>
            <Link 
              href="/latest" 
              className={`${
                isActive('/latest') 
                  ? 'text-primary-600 font-semibold' 
                  : isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-primary-200'
              } transition-colors duration-300`}
            >
              Latest
            </Link>
            <Link 
              href="/gallery" 
              className={`${
                isActive('/gallery') 
                  ? 'text-primary-600 font-semibold' 
                  : isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-primary-200'
              } transition-colors duration-300`}
            >
              Gallery
            </Link>
            <Link 
              href="/location" 
              className={`${
                isActive('/location') 
                  ? 'text-primary-600 font-semibold' 
                  : isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-primary-200'
              } transition-colors duration-300`}
            >
              Location
            </Link>
            <Link 
              href="/register" 
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
            >
              Join Now
            </Link>
            <Link 
              href="/contact" 
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-50 transition-all duration-300 ease-in-out transform ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                isActive('/') ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/latest" 
              className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                isActive('/latest') ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Latest
            </Link>
            <Link 
              href="/gallery" 
              className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                isActive('/gallery') ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link 
              href="/location" 
              className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                isActive('/location') ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Location
            </Link>
            <Link 
              href="/register" 
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium text-center transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Join Now
            </Link>
            <Link 
              href="/contact" 
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium text-center transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}