'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  id: string;
  name: string;
  image: string;
}

export default function FavoriteCakes() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        cache: 'no-store'
      });
      const data = await response.json();
      if (data.success) {
        // Show only first 6 active products
        setProducts(data.products.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#FFF8F0] to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Most Popular Favorite Cakes
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
            Showcasing our best cakes that keep people coming back for more. From birthday cakes to cupcakes, our favorites are guaranteed to impress your guests!
          </p>
        </div>

        {/* Gallery Grid */}
        <div id="products" className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {products.map((product, index) => (
            <Link key={product._id} href={`/product/${product.id}`}>
              <div
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <span className="text-white font-semibold text-sm">{product.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/product/chocolate-fantasy">
            <button className="bg-gray-900 hover:bg-[#FF6B6B] text-white px-12 py-5 rounded-full font-semibold text-lg transition-all transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
              Order Now 🎂
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
