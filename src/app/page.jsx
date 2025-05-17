import HeroSection from '@/components/home/HeroSection';
import ProductCard from '@/components/products/ProductCard';

const dummyProducts = {
  fruits: [
    {
      id: 1,
      name: 'APPLE',
      price: 150,
      imageUrl: '/images/products/fruits/apple.jpg',
    },
    {
      id: 2,
      name: 'BANANA',
      price: 80,
      imageUrl: '/images/products/fruits/banana.jpg',
    },
    {
      id: 3,
      name: 'ORANGE',
      price: 120,
      imageUrl: '/images/products/fruits/orange.jpg',
    },
  ],
  vegetables: [
    {
      id: 4,
      name: 'CARROT',
      price: 60,
      imageUrl: '/images/products/vegetables/carrot.jpg',
    },
    {
      id: 5,
      name: 'TOMATO',
      price: 90,
      imageUrl: '/images/products/vegetables/tomato.jpg',
    },
    {
      id: 6,
      name: 'BROCCOLI',
      price: 130,
      imageUrl: '/images/products/vegetables/broccoli.jpg',
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      
      {/* Fruits Section */}
      <section className="py-8 md:py-12 bg-white px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Fruits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {dummyProducts.fruits.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Vegetables Section */}
      <section className="py-8 md:py-12 bg-yellow-300 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Vegetables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {dummyProducts.vegetables.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 