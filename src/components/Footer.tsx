export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Logo */}
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black mb-3">
              <span className="text-[#FF6B6B]">Salt N</span> Sugar
            </h3>
            <p className="text-gray-600 text-sm">Creating happiness in every bite 🎂</p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
            <div>
              <h4 className="font-bold mb-4">Menu</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#home" className="hover:text-[#FF6B6B] transition">Home</a></li>
                <li><a href="#about" className="hover:text-[#FF6B6B] transition">About Us</a></li>
                <li><a href="#menu" className="hover:text-[#FF6B6B] transition">Menu</a></li>
                <li><a href="#testimonials" className="hover:text-[#FF6B6B] transition">Reviews</a></li>
                <li><a href="/reviews" className="hover:text-[#FF6B6B] transition font-semibold">Write a Review</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Social Media</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="https://instagram.com" className="hover:text-[#FF6B6B] transition flex items-center justify-center md:justify-start gap-2">
                    <span>📷</span> Instagram
                  </a>
                </li>
                <li>
                  <a href="https://facebook.com" className="hover:text-[#FF6B6B] transition flex items-center justify-center md:justify-start gap-2">
                    <span>📘</span> Facebook
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Market Place</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-[#FF6B6B] transition">Shopee</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#FF6B6B] transition">Tokopedia</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Address</h4>
              <p className="text-gray-600 text-sm">
                📍 123 Sweet Street, Bakery District, New York, NY 10001
              </p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 mb-6">
            <a href="https://instagram.com" className="w-10 h-10 bg-gray-200 hover:bg-[#FF6B6B] rounded-full flex items-center justify-center transition">
              <span className="text-xl">📷</span>
            </a>
            <a href="https://facebook.com" className="w-10 h-10 bg-gray-200 hover:bg-[#FF6B6B] rounded-full flex items-center justify-center transition">
              <span className="text-xl">📘</span>
            </a>
            <a href="https://wa.me/6281234567890" className="w-10 h-10 bg-gray-200 hover:bg-[#FF6B6B] rounded-full flex items-center justify-center transition">
              <span className="text-xl">📱</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-600 text-sm pt-6 border-t">
            <p>&copy; 2024 Salt N Sugar. All rights reserved. Made with ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
