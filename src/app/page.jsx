import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import HomeContent from '@/components/home/HomeContent';
import Providers from '@/components/providers';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen">
      <Providers>
        <HomeContent />
      </Providers>
    </main>
  );
} 