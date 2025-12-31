import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "../utils/formatNumber";

import type { RecentTrackSummary } from "../types/track";

const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "http://localhost:3000";

export default function Recent() {
  const [recentTracks, setRecentTracks] = useState<RecentTrackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function getRecentTracks() {
    try {
      const response = await fetch(`${BACKEND_URL}/profile/recent/50`, {
        method: "GET",
        credentials: "include",
      })

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch top tracks (${response.status})`);
      }

      const data: RecentTrackSummary = await response.json();
      setRecentTracks(data);
    } catch (e) {
      console.error(e);
      setError("Unable to load recent tracks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRecentTracks();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="h-20 w-20 animate-spin rounded-full border-10 border-[#1DB954] border-t-[#212121]" />
      </div>
    )
  };
  if (error) return <div className="flex justify-center items-center font-bold text-red-500">{error}</div>
  if (!recentTracks) return null;

  return (
    <div className="flex flex-col gap-15 mx-30 my-25 justify-baseline">
      {/* Page Title */}
      <div className="flex flex-col gap-3">
        <div className="font-bold text-white text-5xl tracking-wide">Recently Played</div>
        <div className="text-[#535353] font-semibold text-lg">What you have been listening to as of late...</div>
      </div>

      {/* Track Information */}
      <div className="flex flex-col gap-5">
        {recentTracks?.map((t) => (
          <div className="grid grid-cols-[2fr_1fr_1fr] items-center">
            <div className="flex flew-row items-center gap-5">
              {t.album_image ? (
                <img src={t.album_image} alt="not image found" className="w-16 h-16 object-cover rounded-md cursor-pointer" />
              ) : (
                <div>N/A</div>
              )}
              <div className="flex flex-col gap-2">
                <div className="text-white text-md font-semibold tracking-wide overflow-clip cursor-pointer hover:underline">{t.track_name}</div>
                <div className="text-xs items-center text-white gap-1">{t.artist_name}</div>
              </div>
            </div>
            <div className="flex flex-1 text-[#b3b3b3]">{t.album_name}</div>
            <div className="flex justify-end text-white font-semibold text-sm">
              {formatDuration(t.track_duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}