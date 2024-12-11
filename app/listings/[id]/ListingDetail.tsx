'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, isPast } from 'date-fns';
import Cookies from 'js-cookie';
import { Clock, DollarSign } from 'lucide-react';
import { LISTINGS_API_URL, NOROFF_API_KEY } from '@/app/lib/constants';
import ImageCarousel from '@/components/ImageCarousel';

interface Media {
  url: string;
  alt: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  media: Media[];
  endsAt: string;
  bids: Bid[];
  tags: string[];
}

interface Bid {
  id: string;
  amount: number;
  bidder: {
    name: string;
    email: string;
    bio: string;
    avatar: {
      url: string;
      alt: string;
    };
    banner: {
      url: string;
      alt: string;
    };
  };
  created: string;
}

export default function ListingDetail({
  listingPromise,
}: {
  listingPromise: Promise<{ data: Listing }>;
}) {
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const listing = use(listingPromise).data;
  const isExpired = isPast(new Date(listing.endsAt));

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${LISTINGS_API_URL}/${listing.id}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Noroff-API-Key': NOROFF_API_KEY,
        },
        body: JSON.stringify({ amount: Number(bidAmount) }),
      });

      if (!response.ok) {
        throw new Error('Failed to place bid');
      }

      router.refresh();
      setBidAmount('');
    } catch (error) {
      console.log(error);
      setError('Failed to place bid. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <ImageCarousel images={listing.media} />
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {listing.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{listing.description}</p>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center text-gray-500">
              <Clock size={20} className="mr-2" />
              <span>
                {isExpired ? 'Ended' : 'Ends'}:{' '}
                {format(new Date(listing.endsAt), 'PPpp')}
              </span>
            </div>
            <div className="flex items-center text-gray-500">
              <DollarSign size={20} className="mr-2" />
              <span>
                Current Highest Bid: $
                {listing.bids.length > 0
                  ? Math.max(...listing.bids.map((bid) => bid.amount))
                  : 'No bids yet'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {listing.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Current Bids
          </h2>
          {listing.bids.length > 0 ? (
            <ul className="space-y-4">
              {listing.bids.map((bid) => (
                <li
                  key={bid.id}
                  className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={bid.bidder.avatar.url}
                      alt={bid.bidder.avatar.alt || bid.bidder.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{bid.bidder.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(bid.created), 'PPp')}
                      </p>
                    </div>
                  </div>
                  <p className="text-green-600 font-bold text-xl">
                    ${bid.amount}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No bids yet. Be the first to bid!</p>
          )}
        </div>

        {!isExpired && (
          <div className="p-8 bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Place Your Bid
            </h2>
            <form onSubmit={handleBid} className="space-y-4">
              <div>
                <label
                  htmlFor="bidAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bid Amount ($)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="bidAmount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid"
                    required
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Place Bid
              </button>
            </form>
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
