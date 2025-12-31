import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { formatNumber, formatRank } from "../utils/formatNumber";

import type { TopArtist, TopArtistSummary } from "../types/artist";

const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "http://127.0.0.1:3000";

export default function Artists() {
  const [topArtists, setTopArtists] = useState<TopArtistSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function getTopArtists() {
      try {
        const response = await fetch(`${BACKEND_URL}/artist/50`, {
          method: "GET",
          credentials: "include",
        });
  
        if (response.status === 401) {
          navigate("/");
          return;
        }
  
        if (!response.ok) {
          throw new Error(`Failed to fetch top artists (${response.status})`);
        }
  
        const data: TopArtistSummary = await response.json();
        console.log("top artists: ", data)
        setTopArtists(data);
      } catch (e) {
        console.error(e);
        setError("Unable to load top artists");
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    getTopArtists();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="h-20 w-20 animate-spin rounded-full border-10 border-[#1DB954] border-t-[#212121]" />
      </div>
    )
  };
  if (error) return <div className="text-red-500">{error}</div>
  if (!topArtists) return null;

  return (
    <div className="flex flex-col gap-15 mx-30 my-25 justify-baseline">
      {/* Page Title */}
      <div className="flex flex-col gap-3">
        <div className="font-bold text-white text-5xl tracking-wide">Top Artists</div>
        <div className="text-[#535353] font-semibold text-lg">Here are your most-played voices!</div>
      </div>

      {/* Artist Information */}
      <div className="grid grid-cols-5 gap-3">
        {topArtists?.map((a: TopArtist, i: number) => (
          <div
            key={a.artist_name}
            className="rounded-2xl bg-[#535353] p-4 mt-3"
          >
            <div className="h-40 w-full rounded-xl overflow-hidden">
              {a.artist_images ? (
                <img src={a.artist_images} alt="not image found" className="h-full w-full object-cover cursor-pointer" />
              ) : (
                <div>N/A</div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="text-[#1db954] font-black text-4xl tracking-tight leading-none">
                {formatRank(i)}
              </div>
              <div className="flex flex-col min-w-0 gap-0.5">
                <div className="text-white text-md font-semibold truncate cursor-pointer hover:underline">
                  {a.artist_name}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-[#b3b3b3] text-[11px] leading-none font-bold">
                    {formatNumber(a.artist_follower_total)} followers
                  </div>            
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}