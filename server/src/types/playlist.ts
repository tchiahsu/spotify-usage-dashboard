export type UserPlaylists = {
  items: Array<{
    id: string;
    name: string;
    description: string | null;
    public: boolean | null;
    images: Array<{ url: string }>;
    owner: {
      id: string;
      display_name: string;
    };
    tracks: {
      total: number;
    };
  }>;
  total: number;
};

export type PlaylistDetails = {
  id: string;
  name: string;
  description: string | null;
  public: boolean | null;
  images: Array<{ url: string; }>;
  owner: {
    id: string;
    display_name: string;
  };
  tracks: {
    total: number;
  };
};

export type PlaylistTracks = {
  items: Array<{
    track: {
      id: string;
      name: string;
      album: {
        id: string;
        name: string;
      };
      artists: Array<{
        id: string;
        name: string;
      }>;
    };
  }>;
  total: number;
  limit: number;
  offset: number;
  next: string | null;
};