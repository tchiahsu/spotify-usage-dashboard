import type { SpotifyImage } from "../utils/types.js";

export type UserPlaylists = {
  items: Array<{
    id: string;
    name: string;
    description: string | null;
    public: boolean | null;
    images: SpotifyImage[];
    owner: {
      id: string;
      display_name: string;
    };
    tracks: {
      total: number;
    };
  }>;
  total: number;
  limit?: number;
  offset?: number;
  next?: string | null;
  previous?: string | null;
};

export type PlaylistDetails = {
  id: string;
  name: string;
  description: string | null;
  public: boolean | null;
  images: SpotifyImage[];
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
      duration_ms: number;
      album: {
        id: string;
        name: string;
        images?: SpotifyImage[];
      };
      artists: Array<{
        id: string;
        name: string;
      }>;
    } | null;
  }>;
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous?: string | null;
};