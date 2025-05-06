import Link from 'next/link';

export function JoinCTA() {
  return (
    <section className="bg-primary-700 text-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Club?</h2>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Become part of FC Green Valley today and experience the passion, community, and excitement of football with us.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/register" 
            className="bg-white text-primary-700 hover:bg-gray-100 py-3 px-8 rounded-full font-semibold transform transition-all duration-300 hover:scale-105"
          >
            Register Now
          </Link>
          <Link 
            href="/contact" 
            className="bg-transparent hover:bg-white/20 text-white border-2 border-white py-3 px-8 rounded-full font-semibold transform transition-all duration-300 hover:scale-105"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}