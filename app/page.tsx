import Link from 'next/link';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gray-100">
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to AuctionHouse
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover unique items and great deals in our online auctions
          </p>
          <Link
            href="/listings"
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-100 transition-colors inline-flex items-center"
          >
            Browse Listings <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose AuctionHouse?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Star className="mx-auto mb-4 text-yellow-500" size={48} />
              <h3 className="text-xl font-semibold mb-2">Quality Items</h3>
              <p className="text-gray-600">
                Curated selection of high-quality items from trusted sellers
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Shield className="mx-auto mb-4 text-green-500" size={48} />
              <h3 className="text-xl font-semibold mb-2">Secure Bidding</h3>
              <p className="text-gray-600">
                Safe and secure bidding process with buyer protection
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Zap className="mx-auto mb-4 text-purple-500" size={48} />
              <h3 className="text-xl font-semibold mb-2">Fast Transactions</h3>
              <p className="text-gray-600">
                Quick and easy transactions with our streamlined process
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="text-xl mb-8">
            Join our community of buyers and sellers today!
          </p>
          <div className="space-x-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
