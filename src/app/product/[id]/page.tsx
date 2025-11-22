'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  ingredients: string[];
  sizes: Array<{
    size: string;
    price: number;
  }>;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(1); // Default to medium
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        cache: 'no-store'
      });
      const data = await response.json();
      if (data.success) {
        const foundProduct = data.products.find((p: Product) => p.id === params.id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-pink/10 to-mint/20 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  if (!product) {
    return null;
  }

  const selectedSizeData = product.sizes[selectedSize];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: selectedSizeData.price,
        image: product.image,
        size: selectedSizeData.size,
      });
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-pink/10 to-mint/20 py-20 px-4">
      <div className="max-w-7xl mx-auto pt-16">
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

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fadeIn z-50 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">Added to cart!</span>
          </div>
        )}

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Product Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-coral/10 to-pink/10 rounded-3xl p-8 aspect-square flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            
            {/* Rating */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
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
                ))}
              </div>
              <span className="text-gray-700 font-semibold">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="inline-block px-4 py-1 bg-coral/10 text-coral rounded-full text-sm font-semibold mb-4 self-start">
              {product.category}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Premium Ingredients:</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-mint/30 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Select Size:</h3>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(index)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedSize === index
                        ? 'border-coral bg-coral/10 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-coral/50'
                    }`}
                  >
                    <div className="font-bold text-gray-900">{size.size}</div>
                    <div className="text-coral font-bold mt-1">Rs.{size.price.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Quantity:</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-xl transition-colors"
                >
                  −
                </button>
                <span className="text-2xl font-bold text-gray-900 w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500">Total Price:</div>
                  <div className="text-4xl font-bold text-coral">
                    Rs.{(selectedSizeData.price * quantity).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] text-white font-bold py-4 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  🛒 Add to Cart
                </button>
                
                <button
                  onClick={() => {
                    const message = `🎂 *Salt N Sugar - Order Request*\n\n*Product:* ${product.name}\n*Size:* ${selectedSizeData.size}\n*Quantity:* ${quantity}\n*Price:* Rs.${(selectedSizeData.price * quantity).toLocaleString()}\n\n📍 Please provide:\n• Delivery Address\n• Delivery Date & Time\n• Any special customization`;
                    const whatsappUrl = `https://wa.me/923335981875?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Order via WhatsApp
                </button>

                <Link href="/cart" className="block">
                  <button className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-full hover:border-coral hover:text-coral transition-all duration-300">
                    View Cart
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
