import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NewsDetail } from '@/components/latest/news-detail';

export async function generateMetadata({ params }) {
  // In a real app, fetch the news item from the database
  // For now, we'll return placeholder metadata
  return {
    title: 'News Details | FC Green Valley',
    description: 'Read the full story of our latest news and updates',
  };
}

export default function NewsPage({ params }) {
  const { id } = params;
  
  // In a real app, you would fetch the specific news item here
  // For this example, we'll render the NewsDetail component which will fetch the data client-side
  
  if (!id) return notFound();
  
  return (
    <div className="flex flex-col w-full">
      <div className="bg-primary-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">News & Updates</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Details and information about our club activities
          </p>
        </div>
      </div>

      <section className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/" className="text-gray-600 hover:text-primary-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/latest" className="text-gray-600 hover:text-primary-700">Latest News</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Article</span>
          </div>
        </div>
        
        <NewsDetail id={id} />
      </section>
    </div>
  );
}