'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { TProfile } from '../lib/types';
import { format } from 'date-fns';

interface Listing {
  id: string;
  title: string;
  endsAt: string;
}

interface DashboardContentProps {
  user: TProfile;
  listings: Listing[];
}

export default function DashboardContent({
  user,
  listings,
}: DashboardContentProps) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
              Welcome, {user.name}!
            </h1>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <p className="text-xl mb-4 sm:mb-0 bg-green-100 text-green-800 py-2 px-4 rounded-full">
                Your current credit:{' '}
                <span className="font-bold">{user.credits}</span>
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/create-listing"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  Create Listing
                </Link>
                <Link
                  href="/listings"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  View All Listings
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  Logout
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">
                Your Listings
              </h2>
              {listings.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <li
                      key={listing.id}
                      className="bg-white border rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <Link
                        href={`/listings/${listing.id}`}
                        className="block p-6"
                      >
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">
                          {listing.title}
                        </h3>
                        <p className="text-gray-600">
                          Ends at: {format(new Date(listing.endsAt), 'PPp')}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div
                  className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded"
                  role="alert"
                >
                  <p className="font-bold">No Listings</p>
                  <p>
                    You haven&apos;t created any listings yet. Click on
                    &quot;Create Listing&quot; to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
