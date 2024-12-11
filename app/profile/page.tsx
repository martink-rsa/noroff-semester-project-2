import { Suspense } from 'react';
import { cookies } from 'next/headers';
import ProfileContent from './ProfileContent';
import { getProfileForSingleUserUrl, NOROFF_API_KEY } from '../lib/constants';

async function getProfileData(token: string, name: string) {
  const url = getProfileForSingleUserUrl(name);
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': NOROFF_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile data');
  }

  return response.json();
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userCookie = cookieStore.get('user')?.value;

  if (!token || !userCookie) {
    throw new Error('Not authenticated');
  }

  const user = JSON.parse(userCookie);
  const profileData = getProfileData(token, user.name);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent profilePromise={profileData} />
    </Suspense>
  );
}
