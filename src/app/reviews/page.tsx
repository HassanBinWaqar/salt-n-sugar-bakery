'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WriteReviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    review: '',
    profileImage: '',
    gender: 'male'
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', rating: 5, review: '', profileImage: '', gender: 'male' });
      setImagePreview('');
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({
          ...formData,
          profileImage: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-pink/20 to-mint/30 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-coral hover:text-coral/80 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Share Your <span className="text-coral">Experience</span>
          </h1>
          <p className="text-gray-600 text-lg">
            We&apos;d love to hear about your experience with Salt N Sugar!
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-8 animate-fadeIn">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-green-800 font-semibold text-lg">Thank you for your review!</h3>
                <p className="text-green-700">Your review has been submitted and is pending admin approval. Redirecting...</p>
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={50}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-coral focus:outline-none transition-colors"
                placeholder="Enter your full name"
                disabled={isSubmitting || success}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-coral focus:outline-none transition-colors"
                placeholder="your.email@example.com"
                disabled={isSubmitting || success}
              />
              <p className="text-sm text-gray-500 mt-1">Your email will not be displayed publicly</p>
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Profile Picture (Optional)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-coral/20">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData({ ...formData, profileImage: '' });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        disabled={isSubmitting || success}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                      👤
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isSubmitting || success}
                    className="hidden"
                  />
                  <label
                    htmlFor="profileImage"
                    className="inline-block px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl cursor-pointer transition-colors font-semibold"
                  >
                    {imagePreview ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Max size: 2MB. Supported: JPG, PNG, GIF
                  </p>
                </div>
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Gender
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="w-4 h-4 text-coral focus:ring-coral"
                    disabled={isSubmitting || success}
                  />
                  <span className="text-gray-700">👨 Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="w-4 h-4 text-coral focus:ring-coral"
                    disabled={isSubmitting || success}
                  />
                  <span className="text-gray-700">👩 Female</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={handleChange}
                    className="w-4 h-4 text-coral focus:ring-coral"
                    disabled={isSubmitting || success}
                  />
                  <span className="text-gray-700">🧑 Other</span>
                </label>
              </div>
            </div>

            {/* Rating Field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    disabled={isSubmitting || success}
                    className="focus:outline-none transition-transform hover:scale-110 disabled:cursor-not-allowed"
                  >
                    <svg
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || formData.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      } transition-colors`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                ))}
                <span className="ml-3 text-lg font-semibold text-gray-700">
                  {formData.rating} {formData.rating === 1 ? 'Star' : 'Stars'}
                </span>
              </div>
            </div>

            {/* Review Field */}
            <div>
              <label htmlFor="review" className="block text-gray-700 font-semibold mb-2">
                Your Review *
              </label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={500}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-coral focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your experience with our cakes and service..."
                disabled={isSubmitting || success}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Minimum 10 characters</span>
                <span>{formData.review.length}/500</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white font-bold py-4 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : success ? (
                '✓ Review Submitted!'
              ) : (
                'Submit Review'
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              By submitting this review, you agree to our terms and conditions.
            </p>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Your review will appear in our testimonials section and help others discover Salt N Sugar! 🎂
          </p>
        </div>
      </div>
    </div>
  );
}
