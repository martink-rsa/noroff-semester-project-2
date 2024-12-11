import { Suspense } from 'react';
import { cookies } from 'next/headers';
import DashboardContent from './DashboardContent';
import {
  getListingsByProfileNameUrl,
  getProfileForSingleUserUrl,
  NOROFF_API_KEY,
} from '../lib/constants';
import { TLoginUser } from '../lib/types';

async function getProfileData(token: string, name: string) {
  const profileResponse = await fetch(getProfileForSingleUserUrl(name), {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': NOROFF_API_KEY,
    },
  });

  if (!profileResponse.ok) {
    throw new Error('Failed to fetch profile data');
  }

  return profileResponse.json();
}

async function getListingsData(token: string, name: string) {
  const listingsResponse = await fetch(getListingsByProfileNameUrl(name), {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': NOROFF_API_KEY,
    },
  });

  if (!listingsResponse.ok) {
    throw new Error('Failed to fetch listings data');
  }

  return listingsResponse.json();
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userCookie = cookieStore.get('user')?.value;

  if (!token || !userCookie) {
    throw new Error('Not authenticated');
  }

  const user = JSON.parse(userCookie) as TLoginUser;
  const [profileData, listingsData] = await Promise.all([
    getProfileData(token, user.name),
    getListingsData(token, user.name),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent user={profileData.data} listings={listingsData.data} />
    </Suspense>
  );
}
