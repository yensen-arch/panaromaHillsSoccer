import Link from 'next/link';
import { LatestNewsFeed } from '@/components/latest/latest-news-feed';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import Image from 'next/image';
import clientPromise from '@/lib/mongodb';

export const metadata = {
  title: 'Latest News & Updates | Panaroma Hills Soccer Club',
  description: 'Stay up-to-date with the latest news, events, and announcements from Panaroma Hills Soccer Club',
};

export default async function LatestNewsPage() {
  // Fetch news data server-side
  const client = await clientPromise;
  const db = client.db();
  const newsItems = await db.collection('news')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  // Convert ObjectIds to strings
  const formattedNews = newsItems.map(item => ({
    ...item,
    _id: item._id.toString(),
    createdAt: item.createdAt.toISOString()
  }));

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="relative bg-primary-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dqh2tacov/image/upload/v1746527286/texture-grass-field_1232-251_vbf97q.webp"
            alt="Grass Background"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
        
        <LatestNewsFeed initialNews={formattedNews} />
      </section>
      <Footer />
    </div>
  );
}