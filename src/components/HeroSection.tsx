'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react';

interface HeroPhoto {
  _id: string;
  imageUrl: string;
  title: string;
}

export default function HeroSection() {
  const [heroPhotos, setHeroPhotos] = useState<HeroPhoto[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchHeroPhotos();
  }, []);

  const fetchHeroPhotos = async () => {
    try {
      const response = await fetch('/api/admin/hero-photos', {
        cache: 'no-store'
      });
      const data = await response.json();
      if (data.success && data.photos.length > 0) {
        setHeroPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error fetching hero photos:', error);
    }
  };

  useEffect(() => {
    if (heroPhotos.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % heroPhotos.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroPhotos.length]);

  const currentPhoto = heroPhotos[currentPhotoIndex];

  return (
    <section id="home" className="pt-20 min-h-screen flex items-center bg-gradient-to-b from-white via-[#FFF8F0] to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFE4E1] rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#C0E6E4] rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="order-2 md:order-1 space-y-6 animate-fadeIn">
            <div className="inline-block bg-gradient-to-r from-[#C0E6E4] to-[#B0D6D4] px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-shadow">
              <span className="text-sm font-semibold text-gray-800">✨ Premium Custom Cakes</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Celebrate Every Moment with{' '}
              <span className="text-[#FF6B6B] inline-block hover:scale-105 transition-transform">Salt N Sugar</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              Celebrate Special Moments with Unique & Delicious Custom Cakes!
            </p>

            <p className="text-base text-gray-600 leading-relaxed">
              Create your dream birthday cake with happiness baked into every bite
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/product/chocolate-fantasy">
                <button className="bg-gray-900 hover:bg-[#FF6B6B] text-white px-10 py-4 rounded-full font-semibold transition-all transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
                  Order Now
                </button>
              </Link>
              <a href="#products">
                <button className="border-2 border-gray-900 hover:border-[#FF6B6B] text-gray-900 hover:text-[#FF6B6B] px-10 py-4 rounded-full font-semibold transition-all transform hover:scale-105">
                  View Menu
                </button>
              </a>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="order-1 md:order-2 relative animate-fadeIn delay-200">
            <div className="relative bg-gradient-to-br from-[#C0E6E4] to-[#A0D6D4] rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-rotate-1">
              {/* Decorative Stars */}
              <div className="absolute top-8 right-8 text-4xl animate-bounce hover:scale-125 transition-transform cursor-pointer">⭐</div>
              <div className="absolute bottom-12 left-8 text-3xl animate-pulse hover:scale-125 transition-transform cursor-pointer">🌟</div>
              <div className="absolute top-1/2 right-4 text-2xl animate-bounce delay-150 hover:scale-125 transition-transform cursor-pointer">✨</div>

              {/* Photo Gallery */}
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {currentPhoto ? (
                  <img
                    src={currentPhoto.imageUrl}
                    alt={currentPhoto.title}
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                  />
                ) : (
                  <Image
                    src="/cake-hero.svg"
                    alt="Delicious strawberry cake with decorative toppings"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>

              {/* Photo Indicators */}
              {heroPhotos.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {heroPhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        index === currentPhotoIndex ? 'bg-coral w-8' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Decorative Text */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentPhoto ? currentPhoto.title : 'Create your dream birthday cake & bring happiness to every bite!'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
