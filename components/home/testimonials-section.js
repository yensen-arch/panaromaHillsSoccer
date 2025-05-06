import Image from 'next/image';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Joining FC Green Valley was one of the best decisions I've made. The coaching is excellent and I've made lifelong friends here.",
      author: "Michael Johnson",
      role: "Club Member, 3 years",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
    },
    {
      quote: "My son has developed not just as a player but as a person since joining the youth program. The focus on values and teamwork is incredible.",
      author: "Sarah Williams",
      role: "Parent",
      image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
    },
    {
      quote: "The community spirit at this club is unlike anything I've experienced before. It truly feels like a football family.",
      author: "David Rodriguez",
      role: "Club Member, 5 years",
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Members Say</h2>
          <div className="h-1 w-20 bg-primary-600 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.author} 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <blockquote className="text-gray-700 text-center italic mb-4">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}