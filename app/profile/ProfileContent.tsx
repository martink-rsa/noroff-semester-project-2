'use client';

import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import EditModal from './EditModal';
import { TProfile } from '../lib/types';
import { NOROFF_API_KEY, getProfileForSingleUserUrl } from '../lib/constants';
import Cookies from 'js-cookie';

interface ProfileContentProps {
  profilePromise: Promise<{ data: TProfile }>;
}

export default function ProfileContent({
  profilePromise,
}: ProfileContentProps) {
  const [profile, setProfile] = useState<TProfile | undefined>(undefined);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profilePromise.then((data) => setProfile(data.data));
  }, [profilePromise]);

  const updateProfile = async (updateData: Partial<TProfile>) => {
    if (!profile) return;

    const token = Cookies.get('token');
    if (!token) {
      setError('You must be logged in to update your profile');
      return;
    }

    try {
      const response = await fetch(getProfileForSingleUserUrl(profile.name), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Noroff-API-Key': NOROFF_API_KEY,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile.data);
      setError(null);
    } catch (err) {
      setError('An error occurred while updating your profile');
      console.error(err);
    }
  };

  const handleBannerUpdate = async (data: Record<string, string>) => {
    await updateProfile({ banner: { url: data.url, alt: data.alt } });
    setIsEditingBanner(false);
  };

  const handleAvatarUpdate = async (data: Record<string, string>) => {
    await updateProfile({ avatar: { url: data.url, alt: data.alt } });
    setIsEditingAvatar(false);
  };

  const handleBioUpdate = async (data: Record<string, string>) => {
    await updateProfile({ bio: data.bio });
    setIsEditingBio(false);
  };

  if (profile === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative">
        <div
          className="h-64 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.banner.url})` }}
        >
          <div
            className="absolute bottom-2 right-2 p-2 bg-white rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => setIsEditingBanner(true)}
          >
            <Edit className="h-6 w-6 text-gray-600" />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <img
              src={profile.avatar.url}
              alt={profile.avatar.alt}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <div
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => setIsEditingAvatar(true)}
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-2">
            {profile.name}
          </h1>
          <p className="text-gray-600 text-center mb-4">{profile.email}</p>
          <div className="relative mb-6">
            <p className="text-gray-800 text-center">{profile.bio}</p>
            <div
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => setIsEditingBio(true)}
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.credits}</p>
              <p className="text-gray-600">Credits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile._count.listings}</p>
              <p className="text-gray-600">Listings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile._count.wins}</p>
              <p className="text-gray-600">Wins</p>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {isEditingBanner && (
        <EditModal
          title="Edit Banner"
          fields={[
            {
              name: 'url',
              label: 'Image URL',
              type: 'text',
              initialValue: profile.banner.url,
            },
            {
              name: 'alt',
              label: 'Alt Text',
              type: 'text',
              initialValue: profile.banner.alt,
            },
          ]}
          onSave={handleBannerUpdate}
          onCancel={() => setIsEditingBanner(false)}
        />
      )}
      {isEditingAvatar && (
        <EditModal
          title="Edit Avatar"
          fields={[
            {
              name: 'url',
              label: 'Image URL',
              type: 'text',
              initialValue: profile.avatar.url,
            },
            {
              name: 'alt',
              label: 'Alt Text',
              type: 'text',
              initialValue: profile.avatar.alt,
            },
          ]}
          onSave={handleAvatarUpdate}
          onCancel={() => setIsEditingAvatar(false)}
        />
      )}
      {isEditingBio && (
        <EditModal
          title="Edit Bio"
          fields={[
            {
              name: 'bio',
              label: 'Bio',
              type: 'textarea',
              initialValue: profile.bio,
            },
          ]}
          onSave={handleBioUpdate}
          onCancel={() => setIsEditingBio(false)}
        />
      )}
    </div>
  );
}
