import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { formatDuration } from "../utils/formatNumber";
import type { UserPlaylistsSummary, PlaylistTrackItem, PlaylistAllTracks } from "../types/playlist";


const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "http://127.0.0.1:3000";

export default function SinglePlaylist() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const [playlists, setPlaylists] = useState<UserPlaylistsSummary | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<PlaylistTrackItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(true);

  const navigate = useNavigate();

  async function getUserPlaylists() {
    try {
      setLoadingPlaylists(true);
      const response = await fetch(`${BACKEND_URL}/profile/playlist`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch user playlists ${response.status}`);
      }

      const data: UserPlaylistsSummary = await response.json();
      setPlaylists(data);
    } catch (e) {
      console.log(e);
      setError("Unable to get user playlist")
    } finally {
      setLoadingPlaylists(false);
    }
  }

  async function getPlaylistTracks(playlistId: string) {
    try {
      setLoadingTracks(true);
      setError(null);

      const response = await fetch(`${BACKEND_URL}/playlist/tracks?id=${encodeURIComponent(playlistId)}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist tracks ${response.status}`);
      }

      const data: PlaylistAllTracks = await response.json();
      setPlaylistTracks(data.items ?? []);
    } catch (e) {
      console.log(e);
      setError("Unable to get playlist tracks")
    } finally {
      setLoadingTracks(false);
    }
  }

  useEffect(() => {
    if (!playlistId) {
      setError("Playlist id is missing.")
      setLoadingPlaylists(false);
      setLoadingTracks(false);
      return;
    }
    getUserPlaylists();
    getPlaylistTracks(playlistId);
  }, [playlistId]);

  const selectedPlaylist = playlists?.find((p) => p.playlist_id === playlistId)

  if (loadingPlaylists || loadingTracks) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="h-20 w-20 animate-spin rounded-full border-10 border-[#1DB954] border-t-[#212121]" />
      </div>
    )
  };
  if (error) return <div className="text-red-500">{error}</div>
  if (!playlists) return null;
  if (!selectedPlaylist) return null;

  return (
    <div className="mx-40 my-25">
      <div className="grid grid-cols-[210px_1fr] gap-35">
        {/* Playlist Info */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[320px] h-80 rounded-3xl overflow-hidden">
            {selectedPlaylist.playlist_image ? (
                <img src={selectedPlaylist.playlist_image} alt="not image found" className="h-full w-full object-cover" />
              ) : (
                <div>N/A</div>
              )}
          </div>
          <div className="mt-8 text-white font-bold text-2xl leading-snug max-w-90">
              {selectedPlaylist.playlist_name}
          </div>
          <div className="mt-2 text-[#b3b3b3] font-semibold text-sm">
              by {selectedPlaylist.owner_name}
          </div>
          <div className="mt-6 text-[#1db954] font-bold text-sm tracking-wide">
              {selectedPlaylist.total_tracks} TRACKS
          </div>
        </div>
  
        {/* Top Tracks */}
        <div className="flex flex-col gap-5">
          {playlistTracks?.map((t: PlaylistTrackItem) => (
            <div className="flex justify-between items-center">
              <div className="flex flew-row items-center gap-5">
                {t.album_image ? (
                  <img src={t.album_image} alt="not image found" className="w-12 h-12 object-cover cursor-pointer" />
                ) : (
                  <div>N/A</div>
                )}
                <div className="min-w-0">
                  <div className="text-white truncate cursor-pointer hover:underline">{t.track_name}</div>
                  <div className="flex items-center gap-1 text-[#b3b3b3] text-xs min-w-0">
                    <div className="truncate">{t.artist_name}</div>
                    <GoDotFill size={7}/>
                    <div className="truncate">{t.track_album}</div>
                  </div>
                </div>
              </div>
              <div className="text-[#b3b3b3] font-semibold text-xs">
                {formatDuration(t.track_duration)}
              </div>
            </div>
          ))}
        </div>
      </div>  
    </div>
  )
}