export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-[#FFF8F0]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Tentang <span className="text-[#FF6B6B]">Joyful</span> Bakes
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Joyful Bakes adalah toko kue yang didedikasikan untuk menciptakan momen 
            spesial Anda menjadi lebih berkesan. Dengan menggunakan bahan-bahan berkualitas 
            premium dan resep yang telah teruji, kami berkomitmen untuk memberikan kue 
            terbaik yang tidak hanya indah dipandang, tetapi juga lezat di setiap gigitan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white rounded-2xl shadow-md">
              <div className="text-4xl mb-4">🎂</div>
              <h3 className="text-xl font-bold mb-2">100% Fresh</h3>
              <p className="text-gray-600">Dibuat fresh setiap hari dengan bahan pilihan</p>
            </div>
            
            <div className="p-6 bg-white rounded-2xl shadow-md">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">Custom Design</h3>
              <p className="text-gray-600">Desain kue sesuai keinginan Anda</p>
            </div>
            
            <div className="p-6 bg-white rounded-2xl shadow-md">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Pengiriman cepat & aman ke lokasi Anda</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
