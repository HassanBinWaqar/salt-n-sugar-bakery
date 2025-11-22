export default function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#FFB4C5] via-[#FFD4D1] to-[#FFE4E1] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative Elements */}
          <div className="flex justify-center gap-6 mb-8 text-5xl">
            <span className="animate-bounce hover:scale-125 transition-transform cursor-pointer">🎂</span>
            <span className="animate-bounce delay-100 hover:scale-125 transition-transform cursor-pointer">🎉</span>
            <span className="animate-bounce delay-200 hover:scale-125 transition-transform cursor-pointer">🎈</span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
            Make Their Day<br/>Sweeter!
          </h2>

          <p className="text-xl md:text-2xl text-gray-800 mb-10 leading-relaxed font-medium max-w-3xl mx-auto">
            Unforgettable celebrations start with the perfect cake. 
            Let us help you create sweet moments that will be remembered forever! ✨
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gray-900 hover:bg-white hover:text-gray-900 text-white px-14 py-6 rounded-full font-bold text-xl transition-all transform hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-3xl border-4 border-transparent hover:border-gray-900">
              Order Now 🎂
            </button>
            <button className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 px-14 py-6 rounded-full font-bold text-xl transition-all transform hover:scale-110 shadow-xl">
              Contact Us
            </button>
          </div>

          {/* Additional Info */}
          <p className="mt-6 text-sm text-gray-700">
            📞 Contact us for a free consultation about your dream cake!
          </p>
        </div>
      </div>
    </section>
  )
}
