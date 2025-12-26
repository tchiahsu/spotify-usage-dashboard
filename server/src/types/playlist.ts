export type userPlaylists = {
  items: Array<{
    id: string;
    name: string;
    description: string | null;
    images: Array<{ url: string }>;
    owner: {
      id: string;
      display_name: string;
    };
    tracks: {
      total: number;
    };
  }>;
  limit: number;
  offset: number;
  total: number;
};

export type playlistDetails = {
  id: string;
  name: string;
  description: string | null;
  images: Array<{ url: string }>;
  owner: {
    id: string;
    display_name: string;
  };
  tracks: {
    total: number;
  };
};

export type playlistTracks = {
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
  limit: number;
  offset: number;
  total: number;
};