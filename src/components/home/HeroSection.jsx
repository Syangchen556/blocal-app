import Image from 'next/image';

const HeroSection = () => {
  return (
    <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
      <Image
        src="/images/vegetables-hero.jpg"
        alt="Fresh vegetables"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-40">
        <div className="container mx-auto h-full flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 text-center">
            Fresh Vegetables
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-center">
            Delivered to Your Doorstep
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center max-w-2xl">
            Explore our wide range of fresh vegetables and enjoy the convenience of online shopping.
          </p>
          <button className="mt-4 md:mt-8 bg-green-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg text-lg md:text-xl hover:bg-green-600 transition-colors">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 