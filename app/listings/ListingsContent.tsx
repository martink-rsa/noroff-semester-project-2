'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, isPast } from 'date-fns';
import { Search, Clock, Lock, X, Tag } from 'lucide-react';

interface Media {
  url: string;
  alt: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  tags: string[];
  media: Media[];
  created: string;
  updated: string;
  endsAt: string;
  _count: {
    bids: number;
  };
}

interface ListingsContentProps {
  listingsPromise: Promise<{ data: Listing[] }>;
  onFilterChange: (filters: {
    active: boolean;
    tag: string;
  }) => Promise<{ data: Listing[] }>;
}

export default function ListingsContent({
  listingsPromise,
  onFilterChange,
}: ListingsContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listingsPromise.then((data) => {
      setListings(data.data);
      setIsLoading(false);
    });
  }, [listingsPromise]);

  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true);
      const data = await onFilterChange({ active: activeOnly, tag: tagFilter });
      setListings(data.data);
      setIsLoading(false);
    };

    applyFilters();
  }, [activeOnly, tagFilter, onFilterChange]);

  const handleTagClear = () => {
    setTagFilter('');
  };

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Auction Listings
        </h1>
        <div className="mb-8 flex flex-col items-center space-y-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search listings..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Active only</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                placeholder="Filter by tag"
                className="p-2 pl-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <Tag
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              {tagFilter && (
                <button
                  onClick={handleTagClear}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading listings...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((listing) => {
                const isExpired = isPast(new Date(listing.endsAt));
                return (
                  <Link
                    href={`/listings/${listing.id}`}
                    key={listing.id}
                    className="block h-full"
                  >
                    <div
                      className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full ${
                        isExpired ? 'opacity-75' : ''
                      }`}
                    >
                      <div className="relative">
                        {listing.media[0] && (
                          <img
                            src={listing.media[0].url}
                            alt={listing.media[0].alt || listing.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          {listing._count.bids}
                        </div>
                        {isExpired && (
                          <div className="absolute top-2 left-2 bg-gray-800 text-white py-1 px-3 rounded-full text-sm font-semibold flex items-center">
                            <Lock size={14} className="mr-1" />
                            Closed
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-1">
                          {listing.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                          {listing.description}
                        </p>
                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock size={16} className="mr-1" />
                              <span>
                                {isExpired ? 'Ended' : 'Ends'}:{' '}
                                {format(new Date(listing.endsAt), 'PPp')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {listing.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {filteredListings.length === 0 && (
              <div className="text-center text-gray-600 mt-8 bg-white p-8 rounded-lg shadow">
                <p className="text-xl font-semibold mb-2">No listings found</p>
                <p>
                  Try adjusting your search or check back later for new items.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
