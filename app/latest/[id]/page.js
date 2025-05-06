import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NewsDetail } from '@/components/latest/news-detail';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import clientPromise from '@/lib/mongodb';

export async function generateMetadata({ params }) {
  const { id } = params;
  
  try {
    const client = await clientPromise;
    const db = client.db();
    const news = await db.collection('news').findOne({ _id: id });

    if (!news) {
      return {
        title: 'News Not Found | Panaroma Hills Soccer Club',
        description: 'The requested news article could not be found',
      };
    }

    return {
      title: `${news.title} | Panaroma Hills Soccer Club`,
      description: news.content.substring(0, 160),
    };
  } catch (error) {
    return {
      title: 'News Details | Panaroma Hills Soccer Club',
      description: 'Read the full story of our latest news and updates',
    };
  }
}

export default async function NewsPage({ params }) {
  const { id } = params;
  
  if (!id) return notFound();
  
  try {
    const client = await clientPromise;
    const db = client.db();
    const news = await db.collection('news').findOne({ _id: id });

    if (!news) return notFound();
    
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest News</h1>
            <p className="text-xl max-w-2xl mx-auto">
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
          
          <NewsDetail news={news} />
        </section>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return notFound();
  }
}