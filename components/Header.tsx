import Link from 'next/link';
import { ShoppingBasketIcon as Auction } from 'lucide-react';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Auction className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">AuctionHouse</span>
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
