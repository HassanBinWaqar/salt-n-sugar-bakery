'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
        : 'bg-white/80 backdrop-blur-sm shadow-sm py-4'
    }`}>
      <nav className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className={`font-black transition-all duration-300 ${
          isScrolled ? 'text-2xl' : 'text-3xl'
        }`}>
          <span className="text-[#FF6B6B] hover:scale-110 inline-block transition-transform cursor-pointer">Salt N</span>
          <span className="text-gray-800"> Sugar</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8 text-gray-700 font-semibold">
            <li><a href="#home" className="hover:text-[#FF6B6B] transition-all hover:scale-110 inline-block">Home</a></li>
            <li><a href="#products" className="hover:text-[#FF6B6B] transition-all hover:scale-110 inline-block">Products</a></li>
            <li><a href="#about" className="hover:text-[#FF6B6B] transition-all hover:scale-110 inline-block">About</a></li>
            <li><a href="#testimonials" className="hover:text-[#FF6B6B] transition-all hover:scale-110 inline-block">Reviews</a></li>
            <li><a href="#contact" className="hover:text-[#FF6B6B] transition-all hover:scale-110 inline-block">Contact</a></li>
          </ul>
          
          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-coral text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
          </Link>

          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Hello, <span className="font-bold">{user.name}</span></span>
              <button
                onClick={logout}
                className="bg-gray-900 hover:bg-[#FF6B6B] text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link href="/login">
                <button className="border-2 border-gray-900 hover:border-[#FF6B6B] text-gray-900 hover:text-[#FF6B6B] px-6 py-2 rounded-full font-semibold transition-all">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-gray-900 hover:bg-[#FF6B6B] text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-700"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <ul className="flex flex-col space-y-4 px-4 py-6 text-gray-700">
            <li><a href="#home" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF6B6B] transition">Home</a></li>
            <li><a href="#products" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF6B6B] transition">Products</a></li>
            <li><a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF6B6B] transition">About</a></li>
            <li><a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF6B6B] transition">Reviews</a></li>
            <li><a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FF6B6B] transition">Contact</a></li>
            <li><Link href="/reviews" onClick={() => setIsMenuOpen(false)} className="block bg-gradient-to-r from-coral to-pink text-white px-6 py-3 rounded-full font-semibold text-center hover:shadow-lg transition-all">Write a Review ✨</Link></li>
            
            {/* Mobile Auth */}
            <div className="border-t pt-4 space-y-3">
              {user ? (
                <>
                  <div className="text-sm text-gray-700 px-2">Hello, <span className="font-bold">{user.name}</span></div>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full bg-gray-900 hover:bg-[#FF6B6B] text-white px-6 py-3 rounded-full font-semibold transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <button className="w-full border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-full font-semibold transition-all">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup" className="block">
                    <button className="w-full bg-gray-900 hover:bg-[#FF6B6B] text-white px-6 py-3 rounded-full font-semibold transition-all">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </ul>
        </div>
      )}
    </header>
  )
}
