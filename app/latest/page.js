import Link from 'next/link';
import { LatestNewsFeed } from '@/components/latest/latest-news-feed';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

export const metadata = {
  title: 'Latest News & Updates | Panaroma Hills Soccer Club',
  description: 'Stay up-to-date with the latest news, events, and announcements from Panaroma Hills Soccer Club',
};

export default function LatestNewsPage() {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="bg-primary-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest News & Updates</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Stay up-to-date with the latest news, events, and announcements from Panaroma Hills Soccer Club
          </p>
        </div>
      </div>

      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/" className="text-gray-600 hover:text-primary-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Latest News</span>
          </div>
        </div>
        
        <LatestNewsFeed />
      </section>
      <Footer />
    </div>
  );
}