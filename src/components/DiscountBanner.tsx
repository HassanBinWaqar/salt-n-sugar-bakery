export default function DiscountBanner() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#FFF8F0]">
      <div className="container mx-auto px-4">
        <div className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
          {/* Background with overlay */}
          <div className="relative bg-gradient-to-br from-[#FFE4E1] via-[#FFD4D1] to-[#FFF8F0] p-16 md:p-20">
            {/* Background Decorations */}
            <div className="absolute top-8 right-8 text-7xl opacity-20 animate-bounce">🎂</div>
            <div className="absolute bottom-8 left-8 text-6xl opacity-20 animate-pulse">🎉</div>
            <div className="absolute top-1/2 left-1/4 text-5xl opacity-10 animate-spin-slow">✨</div>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="inline-block bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full mb-6 shadow-lg">
                <span className="text-sm font-bold text-[#FF6B6B]">⚡ SPECIAL OFFER</span>
              </div>
              
              <h2 className="text-6xl md:text-8xl font-black mb-6 animate-pulse">
                <span className="text-[#FF6B6B] inline-block hover:scale-110 transition-transform">10%</span> OFF
              </h2>
              
              <p className="text-xl md:text-2xl mb-10 text-gray-800 max-w-3xl mx-auto font-medium leading-relaxed">
                For first-time customers! Don&apos;t miss out on getting this amazing discount!
              </p>

              <button className="bg-gray-900 hover:bg-[#FF6B6B] text-white px-14 py-6 rounded-full font-bold text-xl transition-all transform hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-3xl">
                Claim Discount Now! 🎁
              </button>
              
              <p className="mt-6 text-sm text-gray-600">*Valid for purchases over $50</p>
            </div>

            {/* Decorative Cake Image */}
            <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 opacity-30">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <text x="100" y="120" fontSize="120" textAnchor="middle">🎂</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
