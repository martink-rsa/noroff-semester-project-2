'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LISTINGS_API_URL, NOROFF_API_KEY } from '../lib/constants';
import { PlusIcon, XIcon } from 'lucide-react';
import Cookies from 'js-cookie';

interface ImageInput {
  url: string;
  alt: string;
}

export default function CreateListing() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<ImageInput[]>([{ url: '', alt: '' }]);
  const [endsAt, setEndsAt] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleAddImage = () => {
    if (images.length < 5) {
      setImages([...images, { url: '', alt: '' }]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = (
    index: number,
    field: 'url' | 'alt',
    value: string,
  ) => {
    const newImages = [...images];
    newImages[index][field] = value;
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const validImages = images.filter((img) => img.url && img.alt);

    try {
      const response = await fetch(LISTINGS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Noroff-API-Key': NOROFF_API_KEY,
        },
        body: JSON.stringify({
          title,
          description,
          media: validImages,
          endsAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setError('Failed to create listing. Please try again.');
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Create New Listing
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter listing title"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter listing description"
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (Max 5)
              </label>
              {images.map((image, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="url"
                    value={image.url}
                    onChange={(e) =>
                      handleImageChange(index, 'url', e.target.value)
                    }
                    placeholder="Image URL"
                    required
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(e) =>
                      handleImageChange(index, 'alt', e.target.value)
                    }
                    placeholder="Alt text"
                    required
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Add Image
                </button>
              )}
            </div>
            <div>
              <label
                htmlFor="endsAt"
                className="block text-sm font-medium text-gray-700"
              >
                Auction End Date
              </label>
              <input
                id="endsAt"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-between pt-5">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Listing
              </button>
            </div>
          </form>
        </div>
      </div>
      {error && (
        <div className="mt-4 max-w-2xl mx-auto text-center text-red-600 bg-red-100 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
