export type TLoginResponseMeta = unknown;

export type TLoginResponse = {
  data: TLoginUser & { accessToken: string };
  meta: TLoginResponseMeta;
};

export type TLoginUser = {
  name: string;
  email: string;
  bio: string | null;
  avatar: {
    url: string;
    alt: string;
  };
  banner: {
    url: string;
    alt: string;
  };
};

export type TProfileResponse = {
  data: TProfile;
  meta: unknown;
};

export type TProfile = {
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
  credits: number;
  _count: {
    listings: number;
    wins: number;
  };
};
