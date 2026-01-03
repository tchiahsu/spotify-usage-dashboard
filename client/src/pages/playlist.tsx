import { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";

import type { UserPlaylistItem, UserPlaylistsSummary } from "../types/playlist";

const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "http://127.0.0.1:3000";

export default function Playlist() {
  const [playlists, setPlaylists] = useState<UserPlaylistsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function getUserPlaylists() {
      try {
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
        setLoading(false);
      }
    }
  

  useEffect(() => {
    getUserPlaylists();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="h-15 w-15 animate-spin rounded-full border-5 border-[#1DB954] border-t-[#212121]" />
      </div>
    )
  };
  if (error) return <div className="text-red-500">{error}</div>
  if (!playlists) return null;

  return (
    <div className="flex flex-col gap-15 mx-10 my-10 md:mx-20 md:my-25 justify-baseline">
      {/* Page Title */}
      <div className="flex flex-col gap-3">
        <div className="font-bold text-white text-4xl md:text-5xl tracking-wide">Your Personal Playlists</div>
        <div className="text-[#535353] font-semibold text-md: md:text-lg">All your moods, perfectly queued.</div>
      </div>

      {/* Playlist Information */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {playlists?.map((p: UserPlaylistItem) => (
          <div className="flex flex-col gap-1">
            <Link to={`/playlists/${p.playlist_id}`} className="flex flex-col gap-2">
              <div className="h-50 w-full rounded-xl overflow-hidden">
                {p.playlist_image ? (
                  <img src={p.playlist_image} alt="not image found" className="h-full w-full object-cover cursor-pointer hover:scale-110 transition-all duration-200" />
                ) : (
                  <div>N/A</div>
                )}
              </div>

              <div className="flex flex-col items-center text-center min-w-0">
                <div className="w-full text-white font-semibold truncate cursor-pointer hover:underline">
                  {p.playlist_name}
                </div>
              </div>
            </Link>
            <div className="flex items-center justify-center gap-2 mb-2 text-[#535353] text-[11px] font-semibold leading-none">
                <div>
                  {p.total_tracks} TRACKS
                </div>
                <GoDotFill size={7}/>
                <div>
                  {p.is_public ? "PUBLIC" : "PRIVATE"}
                </div>
            </div>              
          </div>
        ))}
      </div>
    </div>
  )
}