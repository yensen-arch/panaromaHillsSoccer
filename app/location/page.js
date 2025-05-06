'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useEffect } from 'react';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import Image from 'next/image';

export default function LocationPage() {
  useEffect(() => {

    window.initMap = function() {
      // Panaroma Hills Soccer Club (fictional location)
      const location = { lat: 51.507351, lng: -0.127758 };
      const mapOptions = {
        zoom: 15,
        center: location,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "weight": "2.00"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [
              {
                "color": "#f2f2f2"
              }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
              {
                "color": "#f2f2f2"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
              {
                "saturation": -100
              },
              {
                "lightness": 45
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
              {
                "visibility": "simplified"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
              {
                "color": "#0e9e4b"
              },
              {
                "visibility": "on"
              }
            ]
          }
        ]
      };

      const map = new google.maps.Map(document.getElementById('map'), mapOptions);

      const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: "Panaroma Hills Soccer Club"
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="padding: 10px; max-width: 200px;">
                    <h3 style="margin: 0 0 5px; font-weight: bold;">Panaroma Hills Soccer Club</h3>
                    <p style="margin: 0;">123 Football Lane<br>London, UK</p>
                  </div>`
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    };

  }, []);

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
    <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Us</h1>
    <p className="text-xl max-w-2xl mx-auto">
      Visit our facilities and join us for matches and training sessions
    </p>
  </div>
</div>


      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Location</h2>
            <div className="h-1 w-20 bg-primary-600 mb-6"></div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="mr-4 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Address</h3>
                  <p className="text-gray-700">
                    Panamount Soccer Field<br />
                    Panamount Blvd NW<br />
                    Calgary, AB T3K 0J1<br />
                    Canada
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="mr-4 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Contact</h3>
                  <p className="text-gray-700">
                    Phone: +44 (0) 123 456 7890<br />
                    Fax: +44 (0) 123 456 7891
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="mr-4 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-gray-700">
                    General Enquiries: info@fcgreenvalley.com<br />
                    Membership: members@fcgreenvalley.com<br />
                    Youth Programs: youth@fcgreenvalley.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="mr-4 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Opening Hours</h3>
                  <p className="text-gray-700">
                    Monday - Friday: 9:00am - 9:00pm<br />
                    Saturday: 8:00am - 6:00pm<br />
                    Sunday: 9:00am - 5:00pm
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Getting Here</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">By Car:</span>
                  <p className="text-gray-700">Parking available on site with 50 free spaces.</p>
                </div>
                <div>
                  <span className="font-medium">By Bus:</span>
                  <p className="text-gray-700">Routes 73, 94, and 148 stop within a 5-minute walk.</p>
                </div>
                <div>
                  <span className="font-medium">By Train:</span>
                  <p className="text-gray-700">Green Valley Station is a 10-minute walk from our facilities.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-300 rounded-lg shadow-md overflow-hidden h-[500px] relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2507.915289399681!2d-114.09594902345654!3d51.16093217178967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537166571536a901%3A0x82795d0ecfea372e!2sPanamount%20Soccer%20Field!5e0!3m2!1sen!2sca!4v1710864000000!5m2!1sen!2sca"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            
            <div className="mt-8 p-6 bg-primary-50 rounded-lg border border-primary-100">
              <h3 className="font-semibold text-lg mb-4">Facilities Available</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Full-size football pitch (grass)</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>5-a-side pitch (artificial turf)</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Training area with equipment</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Clubhouse with refreshments</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Meeting rooms for team talks</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free WiFi throughout</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}