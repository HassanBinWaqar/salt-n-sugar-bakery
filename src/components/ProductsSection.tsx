import Image from 'next/image'

const products = [
  {
    id: 1,
    name: 'Strawberry Dream Cake',
    price: 'Rp 350.000',
    image: '/products/cake1.svg',
    description: 'Kue cokelat lembut dengan krim strawberry segar'
  },
  {
    id: 2,
    name: 'Chocolate Fantasy',
    price: 'Rp 400.000',
    image: '/products/cake2.svg',
    description: 'Kue cokelat premium dengan ganache Belgium'
  },
  {
    id: 3,
    name: 'Vanilla Delight',
    price: 'Rp 320.000',
    image: '/products/cake3.svg',
    description: 'Kue vanilla klasik dengan buttercream lembut'
  },
  {
    id: 4,
    name: 'Red Velvet Romance',
    price: 'Rp 380.000',
    image: '/products/cake4.svg',
    description: 'Kue red velvet dengan cream cheese frosting'
  },
]

export default function ProductsSection() {
  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-[#FF6B6B]">Signature</span> Cakes
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Setiap kue dibuat dengan cinta dan bahan-bahan berkualitas premium
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-64 bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#FF6B6B]">{product.price}</span>
                  <button className="bg-gray-900 hover:bg-[#FF6B6B] text-white px-4 py-2 rounded-full text-sm transition-colors">
                    Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
