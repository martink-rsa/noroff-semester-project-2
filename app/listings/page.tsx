'use client';

import { useState, useCallback } from 'react';
import ListingsContent from './ListingsContent';

export default function ListingsPage() {
  const [activeOnly, setActiveOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState('');

  const fetchListings = useCallback(async (active: boolean, tag: string) => {
    let url = 'https://v2.api.noroff.dev/auction/listings';
    const queryParams = new URLSearchParams();

    if (active) {
      queryParams.append('_active', 'true');
    }
    if (tag) {
      queryParams.append('_tag', tag);
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }
    return response.json();
  }, []);

  const onFilterChange = useCallback(
    async ({ active, tag }: { active: boolean; tag: string }) => {
      setActiveOnly(active);
      setTagFilter(tag);
      return fetchListings(active, tag);
    },
    [fetchListings],
  );

  return (
    <ListingsContent
      listingsPromise={fetchListings(activeOnly, tagFilter)}
      onFilterChange={onFilterChange}
    />
  );
}
