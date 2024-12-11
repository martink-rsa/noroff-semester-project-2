const BASE_API_URL = 'https://v2.api.noroff.dev';

export const NOROFF_API_KEY = 'd63fa99f-d816-4e3b-a831-1934455635c7';

export const CREATE_API_KEY_URL = `${BASE_API_URL}/auth/create-api-key`;

export const REGISTER_API_URL = `${BASE_API_URL}/auth/register`;
export const LOGIN_API_URL = `${BASE_API_URL}/auth/login`;

export const LISTINGS_API_URL = `${BASE_API_URL}/auction/listings`;

export const getListingUrl = (listingId: string) =>
  `${LISTINGS_API_URL}/${listingId}`;

export const getBidOnListingsUrl = (listingId: string) =>
  `${BASE_API_URL}/auctions/listings/${listingId}/bids`;

export const getListingsByProfileNameUrl = (profileName: string) =>
  `${BASE_API_URL}/auction/profiles/${profileName}/listings`;

export const getProfileForSingleUserUrl = (profileName: string) =>
  `${BASE_API_URL}/auction/profiles/${profileName}`;
