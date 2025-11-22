import Image from 'next/image'

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#FFF8F0]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Why Choose <span className="text-[#FF6B6B] inline-block hover:scale-110 transition-transform">Salt N Sugar</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF6B6B] to-[#FFB4C5] mx-auto rounded-full"></div>
        </div>

        {/* Image and Cards */}
        <div className="max-w-5xl mx-auto">
          {/* Children Image */}
          <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-8">
            <Image
              src="/why-choose-us.svg"
              alt="Happy children celebrating"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>

          {/* Benefit Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 - Delicious Cakes */}
            <div className="group bg-gradient-to-br from-[#FFE4E1] to-[#FFD4D1] rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white p-5 rounded-full shadow-md group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🎂</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Delicious Cakes</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Premium quality ingredients that keep customers coming back for more
              </p>
            </div>

            {/* Card 2 - Warm Service */}
            <div className="group bg-gradient-to-br from-[#FFB4C5] to-[#FF9CB5] rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white p-5 rounded-full shadow-md group-hover:scale-110 transition-transform">
                  <span className="text-4xl">👋</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Warm Service</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Friendly team ensuring your celebration runs smoothly and perfectly
              </p>
            </div>

            {/* Card 3 - Fast Delivery */}
            <div className="group bg-gradient-to-br from-[#C0E6E4] to-[#A0D6D4] rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white p-5 rounded-full shadow-md group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🚚</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Fast Delivery</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We deliver your cakes anywhere quickly and safely, free of charge!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
