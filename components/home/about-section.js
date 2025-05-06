import Image from 'next/image';

export function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Our Club</h2>
            <div className="h-1 w-20 bg-primary-600 mb-6"></div>
            <p className="text-lg text-gray-700 mb-4">
              FC Green Valley was founded in 2005 with a vision to create a community-focused 
              football club that develops talent and promotes the love of the beautiful game.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Over the years, we've grown from a small local team to a thriving club with multiple 
              age groups, dedicated coaches, and a supportive community of members and fans.
            </p>
            <p className="text-lg text-gray-700">
              Our philosophy centers around skill development, sportsmanship, and creating 
              a positive environment where players of all abilities can thrive and enjoy the game.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image 
                src="https://images.pexels.com/photos/3041176/pexels-photo-3041176.jpeg" 
                alt="Team celebration" 
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image 
                src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg" 
                alt="Stadium" 
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image 
                src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg" 
                alt="Football match" 
                fill
                className="object-cover" 
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image 
                src="https://images.pexels.com/photos/1667583/pexels-photo-1667583.jpeg" 
                alt="Training session" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}