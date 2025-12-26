export type trackDetails = {
  id: string;
  name: string;
  popularity: number;
  duration_ms: number;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    release_date: string;
    total_tracks: number;
    images: Array<{ url: string }>;
  };
};