export function StatsSection() {
  const stats = [
    { value: '15+', label: 'Years of Excellence' },
    { value: '200+', label: 'Active Members' },
    { value: '20+', label: 'Qualified Coaches' },
    { value: '50+', label: 'Tournaments Won' }
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
          <div className="h-1 w-20 bg-primary-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-lg bg-gray-50 border-b-4 border-primary-600 shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary-800 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}