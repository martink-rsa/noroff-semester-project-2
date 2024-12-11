'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function FloatingActionButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Link
      href="/create-listing"
      className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
    >
      <Plus className="h-6 w-6" />
    </Link>
  );
}
