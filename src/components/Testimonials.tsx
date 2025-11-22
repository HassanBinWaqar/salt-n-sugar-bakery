'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Review {
  _id: string;
  name: string;
  email?: string;
  rating: number;
  review: string;
  profileImage?: string;
  gender?: string;
  createdAt: string;
}

const colors = [
  'bg-[#C0E6E4]',
  'bg-[#FFE4E1]',
  'bg-[#FFB4C5]',
  'bg-[#FFF8DC]'
];

const avatars = ['👩', '👨', '👧', '👦', '🧑', '👴', '👵'];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      
      if (data.success && data.reviews.length > 0) {
        console.log('Fetched reviews:', data.reviews);
        setTestimonials(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvatar = (index: number) => avatars[index % avatars.length];
  const getColor = (index: number) => colors[index % colors.length];

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  const handleDeleteReview = async (reviewId: string) => {
    const userEmail = prompt('Enter your email to confirm deletion:');
    
    if (!userEmail) {
      return;
    }

    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Review deleted successfully!');
        fetchReviews(); // Refresh reviews
        setCurrentIndex(0); // Reset to first page
      } else {
        alert(data.error || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-[#FFF8F0]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-coral border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-[#FFF8F0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Customer <span className="text-[#FF6B6B]">Testimonials</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-lg mb-8">What our customers say about Salt N Sugar</p>
          </div>
          
          <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl">
            <div className="text-6xl mb-4">💭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Be the First to Review!</h3>
            <p className="text-gray-600 mb-8">Share your experience with Salt N Sugar and help others discover our delicious cakes!</p>
            <Link 
              href="/reviews"
              className="inline-block bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white font-bold py-4 px-8 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Write a Review ✨
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-[#FFF8F0]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Customer <span className="text-[#FF6B6B]">Testimonials</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg">What our customers say about Salt N Sugar</p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {testimonials.slice(currentIndex, currentIndex + 2).concat(
              testimonials.slice(0, Math.max(0, (currentIndex + 2) - testimonials.length))
            ).slice(0, 2).map((testimonial, idx) => (
              <div
                key={testimonial._id}
                className={`${getColor(currentIndex + idx)} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 relative transform hover:-translate-y-2`}
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-5xl opacity-20">❝</div>
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteReview(testimonial._id)}
                  className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-red-500 text-gray-600 hover:text-white p-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg group"
                  title="Delete review"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white/50 overflow-hidden">
                    {testimonial.profileImage && testimonial.profileImage.trim() !== '' ? (
                      <img 
                        src={testimonial.profileImage} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">
                        {testimonial.gender === 'female' ? '👩' : testimonial.gender === 'other' ? '🧑' : '👨'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-800">{testimonial.name}</h4>
                    <div className="text-yellow-500 text-lg">{renderStars(testimonial.rating)}</div>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-gray-800 leading-relaxed text-base font-medium">
                  {testimonial.review}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-[#FF6B6B] w-8' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Write a Review Button */}
          <div className="text-center">
            <Link 
              href="/reviews"
              className="inline-block bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white font-bold py-4 px-8 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Write a Review ✨
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
