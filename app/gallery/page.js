import Image from 'next/image';

export const metadata = {
  title: 'Gallery | FC Green Valley',
  description: 'View photos of FC Green Valley matches, events, and community activities',
};

export default function GalleryPage() {
  // In a real app, these would be fetched from a database
  const images = [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      alt: 'Football stadium',
      category: 'Facilities'
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
      alt: 'Football match action',
      category: 'Matches'
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
      alt: 'Football training',
      category: 'Training'
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/3041176/pexels-photo-3041176.jpeg',
      alt: 'Team celebration',
      category: 'Celebrations'
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/1667583/pexels-photo-1667583.jpeg',
      alt: 'Youth training',
      category: 'Youth'
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg',
      alt: 'Match action shot',
      category: 'Matches'
    },
    {
      id: 7,
      src: 'https://images.pexels.com/photos/3448250/pexels-photo-3448250.jpeg',
      alt: 'Team photo',
      category: 'Team'
    },
    {
      id: 8,
      src: 'https://images.pexels.com/photos/918798/pexels-photo-918798.jpeg',
      alt: 'Youth match',
      category: 'Youth'
    },
    {
      id: 9,
      src: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg',
      alt: 'Stadium during match',
      category: 'Facilities'
    },
    {
      id: 10,
      src: 'https://images.pexels.com/photos/3042425/pexels-photo-3042425.jpeg',
      alt: 'Community event',
      category: 'Community'
    },
    {
      id: 11,
      src: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
      alt: 'Awards ceremony',
      category: 'Events'
    },
    {
      id: 12,
      src: 'https://images.pexels.com/photos/8192129/pexels-photo-8192129.jpeg',
      alt: 'Football training drill',
      category: 'Training'
    }
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="bg-primary-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Capturing moments from our matches, events, and community activities
          </p>
        </div>
      </div>

      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="relative h-64 group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <Image 
                src={image.src} 
                alt={image.alt} 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-end p-4">
                <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block bg-primary-600 text-white text-xs px-2 py-1 rounded mb-2">
                    {image.category}
                  </span>
                  <h3 className="text-white font-semibold">{image.alt}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}