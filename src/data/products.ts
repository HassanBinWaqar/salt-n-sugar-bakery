export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  sizes: {
    size: string;
    price: number;
  }[];
  rating: number;
  reviews: number;
  popular: boolean;
}

export const products: Product[] = [
  {
    id: 'chocolate-fantasy',
    name: 'Chocolate Fantasy',
    description: 'Rich, decadent chocolate cake with layers of smooth chocolate ganache and chocolate shavings. Perfect for chocolate lovers!',
    price: 45.00,
    image: '/products/cake1.svg',
    category: 'Chocolate',
    ingredients: ['Dark Chocolate', 'Cocoa Powder', 'Fresh Cream', 'Butter', 'Premium Flour'],
    sizes: [
      { size: 'Small (6")', price: 35.00 },
      { size: 'Medium (8")', price: 45.00 },
      { size: 'Large (10")', price: 60.00 }
    ],
    rating: 4.9,
    reviews: 156,
    popular: true
  },
  {
    id: 'red-velvet-dream',
    name: 'Red Velvet Dream',
    description: 'Classic red velvet cake with cream cheese frosting. Moist, fluffy, and absolutely irresistible!',
    price: 42.00,
    image: '/products/cake2.svg',
    category: 'Red Velvet',
    ingredients: ['Red Velvet Batter', 'Cream Cheese', 'Buttermilk', 'Vanilla Extract', 'Fresh Butter'],
    sizes: [
      { size: 'Small (6")', price: 32.00 },
      { size: 'Medium (8")', price: 42.00 },
      { size: 'Large (10")', price: 55.00 }
    ],
    rating: 4.8,
    reviews: 203,
    popular: true
  },
  {
    id: 'vanilla-dream',
    name: 'Vanilla Dream',
    description: 'Light and fluffy vanilla sponge cake with buttercream frosting. A timeless classic that never disappoints!',
    price: 38.00,
    image: '/products/cake3.svg',
    category: 'Vanilla',
    ingredients: ['Premium Vanilla', 'Fresh Eggs', 'Buttercream', 'Milk', 'Sugar'],
    sizes: [
      { size: 'Small (6")', price: 28.00 },
      { size: 'Medium (8")', price: 38.00 },
      { size: 'Large (10")', price: 50.00 }
    ],
    rating: 4.7,
    reviews: 178,
    popular: true
  },
  {
    id: 'strawberry-delight',
    name: 'Strawberry Delight',
    description: 'Fresh strawberry cake with strawberry cream filling and topped with fresh strawberries. A fruity paradise!',
    price: 48.00,
    image: '/products/cake4.svg',
    category: 'Fruit',
    ingredients: ['Fresh Strawberries', 'Whipped Cream', 'Strawberry Puree', 'Vanilla Sponge', 'Sugar Glaze'],
    sizes: [
      { size: 'Small (6")', price: 38.00 },
      { size: 'Medium (8")', price: 48.00 },
      { size: 'Large (10")', price: 65.00 }
    ],
    rating: 4.9,
    reviews: 192,
    popular: true
  },
  {
    id: 'caramel-heaven',
    name: 'Caramel Heaven',
    description: 'Indulgent caramel cake with salted caramel drizzle and caramel buttercream. Pure bliss in every bite!',
    price: 50.00,
    image: '/gallery/cake1.svg',
    category: 'Caramel',
    ingredients: ['Caramel Sauce', 'Sea Salt', 'Butter', 'Brown Sugar', 'Premium Flour'],
    sizes: [
      { size: 'Small (6")', price: 40.00 },
      { size: 'Medium (8")', price: 50.00 },
      { size: 'Large (10")', price: 68.00 }
    ],
    rating: 4.8,
    reviews: 145,
    popular: false
  },
  {
    id: 'lemon-burst',
    name: 'Lemon Burst',
    description: 'Refreshing lemon cake with tangy lemon curd filling and lemon cream cheese frosting. Perfect for summer!',
    price: 44.00,
    image: '/gallery/cake2.svg',
    category: 'Citrus',
    ingredients: ['Fresh Lemon', 'Lemon Zest', 'Cream Cheese', 'Butter', 'Vanilla'],
    sizes: [
      { size: 'Small (6")', price: 34.00 },
      { size: 'Medium (8")', price: 44.00 },
      { size: 'Large (10")', price: 58.00 }
    ],
    rating: 4.7,
    reviews: 134,
    popular: false
  },
  {
    id: 'black-forest',
    name: 'Black Forest',
    description: 'Traditional Black Forest cake with chocolate sponge, cherry filling, and whipped cream. A German classic!',
    price: 52.00,
    image: '/gallery/cake3.svg',
    category: 'Chocolate',
    ingredients: ['Dark Chocolate', 'Black Cherries', 'Whipped Cream', 'Kirsch', 'Chocolate Shavings'],
    sizes: [
      { size: 'Small (6")', price: 42.00 },
      { size: 'Medium (8")', price: 52.00 },
      { size: 'Large (10")', price: 70.00 }
    ],
    rating: 4.9,
    reviews: 167,
    popular: true
  },
  {
    id: 'tiramisu-classic',
    name: 'Tiramisu Classic',
    description: 'Authentic Italian tiramisu with espresso-soaked ladyfingers and mascarpone cream. Coffee lover\'s dream!',
    price: 46.00,
    image: '/gallery/cake4.svg',
    category: 'Coffee',
    ingredients: ['Espresso', 'Mascarpone', 'Ladyfingers', 'Cocoa Powder', 'Marsala Wine'],
    sizes: [
      { size: 'Small (6")', price: 36.00 },
      { size: 'Medium (8")', price: 46.00 },
      { size: 'Large (10")', price: 62.00 }
    ],
    rating: 4.8,
    reviews: 189,
    popular: true
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getPopularProducts = (): Product[] => {
  return products.filter(product => product.popular);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
