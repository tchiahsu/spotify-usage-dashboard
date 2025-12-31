export type PlaylistDetail = {
  playlist_id: string;
  playlist_name: string;
  playlist_description: string | null;
  is_public: boolean | null;
  playlist_image: string | null;
  playlist_owner: string;
  playlist_num_track: number;
}

export type PlaylistTrackItem = {
  track_id: string;
  track_name: string;
  track_album: string;
  artist_name: string;
  album_image: string | null;
  track_duration: number;
}

export type PlaylistAllTracks = {
  total: number;
  limit: number;
  offset: number;
  items: PlaylistTrackItem[];
}

export type UserPlaylistItem = {
  playlist_id: string;
  playlist_name: string;
  playlist_description: string | null;
  playlist_image: string | null;
  owner_name: string;
  total_tracks: number;
  is_public: boolean | null;
};

export type UserPlaylistsSummary = UserPlaylistItem[];