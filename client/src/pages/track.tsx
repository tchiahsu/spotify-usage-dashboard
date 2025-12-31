import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "../utils/formatNumber";

import type { TopTrackSummary } from "../types/track";

const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "http://localhost:3000";

export default function Track() {
  const [topTracks, setTopTracks] = useState<TopTrackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function getTopTracks() {
    try {
      const response = await fetch(`${BACKEND_URL}/track/50`, {
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

      const data: TopTrackSummary = await response.json();
      console.log("top tracks: ", data)
      setTopTracks(data);
    } catch (e) {
      console.error(e);
      setError("Unable to load top tracks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTopTracks();
  }, []);

  if (loading) return <div>Loading profile</div>;
  if (error) return <div className="text-red-500">{error}</div>
  if (!topTracks) return null;

  return (
    <div className="flex flex-col gap-15 mx-30 my-25 justify-baseline">
      {/* Page Title */}
      <div className="flex flex-col gap-3">
        <div className="font-bold text-white text-5xl tracking-wide">Top Tracks</div>
        <div className="text-[#535353] font-semibold text-lg">Your go to songs so far...</div>
      </div>

      {/* Track Information */}
      <div className="flex flex-col gap-5">
        {topTracks?.map((t) => (
          <div className="grid grid-cols-[2fr_1fr_1fr] items-center">
            <div className="flex flew-row items-center gap-5">
              {t.album_image ? (
                <img src={t.album_image} alt="not image found" className="w-20 h-20 object-cover rounded-md" />
              ) : (
                <div>N/A</div>
              )}
              <div className="flex flex-col gap-2">
                <div className="text-white text-lg font-semibold tracking-wide overflow-clip">{t.track_name}</div>
                <div className="text-sm items-center text-white gap-1">{t.artist_name}</div>
              </div>
            </div>
            <div className="flex flex-1 text-[#b3b3b3]">{t.album_name}</div>
            <div className="flex justify-end text-white font-semibold text-md">
              {formatDuration(t.track_duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}