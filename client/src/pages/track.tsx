import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "../utils/formatNumber";
import type { TopTrackSummary, TrackSummary } from "../types/track";
import type { ArtistSummary} from "../types/artist";
import type { Range } from "../types/time_range";
import ArtistPopup from "../components/ArtistPopup";
import TrackPopup from "../components/TrackPopup";
import TimeRangeButtons from "../components/TimeRangeButtons";

const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "http://127.0.0.1:3000";

export default function Track() {
  const [topTracks, setTopTracks] = useState<TopTrackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedArist, setSelectedArtist] = useState<ArtistSummary | null>(null);
  const [openPopupTrack, setOpenPopupTrack] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackSummary | null>(null);
  const [range, setRange] = useState<Range>("long");
  
  const navigate = useNavigate();

  async function getTopTracks(selectedRange: Range) {
    try {
      const response = await fetch(`${BACKEND_URL}/track/50?range=${selectedRange}`, {
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
      setTopTracks(data);
    } catch (e) {
      console.error(e);
      setError("Unable to load top tracks");
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

  async function openTrackPopup(trackId: string) {
    try{
      const response = await fetch(`${BACKEND_URL}/track/summary?id=${trackId}`, {
        method: "GET",
        credentials: "include",
      });

      if(!response.ok) {
        throw new Error("Failed to get track info");
      }

      const data: TrackSummary = await response.json();
      setSelectedTrack(data);
      setOpenPopupTrack(true);
    } catch (e) {
      console.error("Error loading track info:", e);
    } 
  }

  useEffect(() => {
    getTopTracks(range);
  }, [range]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="h-20 w-20 animate-spin rounded-full border-10 border-[#1DB954] border-t-[#212121]" />
      </div>
    )
  };
  if (error) return <div className="text-red-500">{error}</div>
  if (!topTracks) return null;

  return (
    <div className="flex flex-col gap-15 mx-30 my-25 justify-baseline">
      <div className="flex items-start justify-between">
        {/* Page Title */}
        <div className="flex flex-col gap-3">
          <div className="font-bold text-white text-5xl tracking-wide">Top Tracks</div>
          <div className="text-[#535353] font-semibold text-lg">Here are your most-played voices!</div>
        </div>
        <TimeRangeButtons value={range} onChange={setRange}/>
      </div>

      {/* Track Information */}
      <div className="flex flex-col gap-5">
        {topTracks?.map((t) => (
          <div className="grid grid-cols-[2fr_1fr_1fr] items-center">
            <div className="flex flew-row items-center gap-5">
              {t.album_image ? (
                <img 
                  src={t.album_image} 
                  alt="not image found" 
                  className="w-16 h-16 object-cover rounded-md cursor-pointer hover:scale-110 transition-all duration-200"
                  onClick={() => openTrackPopup(t.track_id)} 
                />
              ) : (
                <div>N/A</div>
              )}
              <div className="flex flex-col gap-2">
                <div 
                  className="text-white text-md font-semibold tracking-wide overflow-clip cursor-pointer hover:underline"
                  onClick={() => openTrackPopup(t.track_id)}
                >
                  {t.track_name}
                </div>
                <div 
                  className="text-xs items-center text-white gap-1 cursor-pointer hover:underline"
                  onClick={() => {if (t.artist_id) openArtistPopup(t.artist_id)}}
                >
                  {t.artist_name}
                </div>
              </div>
            </div>
            <div className="flex flex-1 text-[#b3b3b3]">{t.album_name}</div>
            <div className="flex justify-end text-white font-semibold text-sm">
              {formatDuration(t.track_duration)}
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
      <TrackPopup
        open={openPopupTrack}
        track={selectedTrack}
        onClose={() => {
          setOpenPopupTrack(false);
          setSelectedTrack(null);
        }}
      />
    </div>
  )
}