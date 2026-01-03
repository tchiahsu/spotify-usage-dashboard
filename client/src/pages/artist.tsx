import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { formatNumber, formatRank } from "../utils/formatNumber";
import type { ArtistSummary, TopArtist, TopArtistSummary } from "../types/artist";
import type { Range } from "../types/time_range";
import ArtistPopup from "../components/ArtistPopup";
import TimeRangeButtons from "../components/TimeRangeButtons";

const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "https://spotifylisten.vercel.app/api";

export default function Artists() {
  const [topArtists, setTopArtists] = useState<TopArtistSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedArist, setSelectedArtist] = useState<ArtistSummary | null>(null);
  const [range, setRange] = useState<Range>("long");

  const navigate = useNavigate();

  async function getTopArtists(selectedRange: Range) {
      try {
        const response = await fetch(`${BACKEND_URL}/artist/50?range=${selectedRange}`, {
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
        setTopArtists(data);
      } catch (e) {
        console.error(e);
        setError("Unable to load top artists");
      } finally {
        setLoading(false);
      }
  }

  async function openArtistPopup(artistId: string) {
    try{
      const response = await fetch(`${BACKEND_URL}/artist/summary?id=${artistId}`, {
        method: "GET",
        credentials: "include",
      });

      if(!response.ok) {
        throw new Error("Failed to get artist info");
      }

      const data: ArtistSummary = await response.json();
      setSelectedArtist(data);
      setOpenPopup(true);
    } catch (e) {
      console.error("Error loading artist info:", e);
    }
  }

  useEffect(() => {
    getTopArtists(range);
  }, [range]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="h-15 w-15 animate-spin rounded-full border-5 border-[#1DB954] border-t-[#212121]" />
      </div>
    )
  };
  if (error) return <div className="text-red-500">{error}</div>
  if (!topArtists) return null;

  return (
    <div className="flex flex-col gap-15 mx-10 my-10 sm:mx-20 md:my-25 justify-baseline">
      <div className="flex items-start justify-between">
        {/* Page Title */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-row justify-between items-end">
            <div className="font-bold text-white text-4xl md:text-5xl tracking-wide">Top Artists</div>
            <div className="hidden lg:block"><TimeRangeButtons value={range} onChange={setRange} /></div>
          </div>
          <div className="text-[#535353] font-semibold text-md md:text-lg">Here are your most-played voices!</div>
          <div className="block lg:hidden"><TimeRangeButtons value={range} onChange={setRange} /></div>
        </div>
      </div>
      
      {/* Artist Information */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {topArtists?.map((a: TopArtist, i: number) => (
          <div
            key={a.artist_name}
            className="rounded-2xl bg-[#535353] p-3 md:p-4 mt-3"
          >
            <div className="h-40 w-full rounded-xl overflow-hidden">
              {a.artist_images ? (
                <img 
                  src={a.artist_images ?? undefined} 
                  alt="not image found" 
                  className="h-full w-full object-cover cursor-pointer hover:scale-110 transition-all duration-200" 
                  onClick={() => openArtistPopup(a.artist_id)}  
                />
              ) : (
                <div>N/A</div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="text-[#1db954] font-black text-3xl xl:text-4xl tracking-tight leading-none">
                {formatRank(i)}
              </div>
              <div className="flex flex-col min-w-0 gap-0.5">
                <div 
                  className="text-white text-md font-semibold truncate cursor-pointer hover:underline"
                  onClick={() => openArtistPopup(a.artist_id)}
                >
                  {a.artist_name}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-[#b3b3b3] text-[11px] truncate leading-none font-bold">
                    {formatNumber(a.artist_follower_total)} followers
                  </div>            
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ArtistPopup
        open={openPopup}
        artist={selectedArist}
        onClose={() => {
          setOpenPopup(false);
          setSelectedArtist(null);
        }}
      />
    </div>
  )
}