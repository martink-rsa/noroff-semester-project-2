'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, LogOut, Plus, UserCircle } from 'lucide-react';

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="flex items-center space-x-4">
      <Link
        href="/listings"
        className="text-gray-600 hover:text-blue-600 transition-colors"
      >
        Listings
      </Link>
      {isLoggedIn ? (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <User className="h-6 w-6" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link
                href="/create-listing"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Plus className="inline-block mr-2 h-4 w-4" />
                Create a listing
              </Link>
              <hr className="my-1" />
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <UserCircle className="inline-block mr-2 h-4 w-4" />
                View profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="inline-block mr-2 h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link
            href="/login"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            LOGIN
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            REGISTER
          </Link>
        </>
      )}
    </nav>
  );
}
