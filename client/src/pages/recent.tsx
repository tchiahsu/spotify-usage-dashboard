import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "../utils/formatNumber";

import type { RecentTrackSummary } from "../types/track";
import type { ArtistSummary} from "../types/artist";
import type { TrackSummary } from "../types/track";
import ArtistPopup from "../components/ArtistPopup";
import TrackPopup from "../components/TrackPopup";

const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "http://127.0.0.1:3000";

export default function Recent() {
  const [recentTracks, setRecentTracks] = useState<RecentTrackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedArist, setSelectedArtist] = useState<ArtistSummary | null>(null);
  const [openPopupTrack, setOpenPopupTrack] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackSummary | null>(null);

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
    getRecentTracks();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="h-15 w-15 animate-spin rounded-full border-5 border-[#1DB954] border-t-[#212121]" />
      </div>
    )
  };
  if (error) return <div className="flex justify-center items-center font-bold text-red-500">{error}</div>
  if (!recentTracks) return null;

  return (
    <div className="flex flex-col gap-15 mx-10 my-10 sm:mx-20 md:my-25 justify-baseline">
      {/* Page Title */}
      <div className="flex flex-col gap-3 w-full">
        <div className="font-bold text-white text-4xl md:text-5xl tracking-wide">Recently Played</div>
        <div className="text-[#535353] font-semibold text-md md:text-lg">What you have been listening to as of late...</div>
      </div>

      {/* Track Information */}
      <div className="flex flex-col gap-5">
        {recentTracks?.map((t) => (
          <div className="flex justify-between md:grid md:grid-cols-[2fr_1fr_1fr] gap-2 items-center">
            <div className="flex flew-1 min-w-0 items-center gap-5">
              {t.album_image ? (
                <img 
                  src={t.album_image} 
                  alt="not image found" 
                  className="w-16 h-16 shrink-0 object-cover rounded-md cursor-pointer hover:scale-110 transition-all duration-200"
                  onClick={() => openTrackPopup(t.track_id)}
                />
              ) : (
                <div>N/A</div>
              )}
              <div className="flex min-w-0 flex-col gap-2">
                <div 
                  className="min-w-0 truncate text-white text-md font-semibold tracking-wide overflow-clip cursor-pointer hover:underline"
                  onClick={() => openTrackPopup(t.track_id)}
                >
                  {t.track_name}
                </div>
                <div 
                  className="min-w-0 truncate text-xs items-center text-white gap-1 cursor-pointer hover:underline"
                  onClick={() => {if (t.artist_id) openArtistPopup(t.artist_id)}}
                >
                  {t.artist_name}
                </div>
              </div>
            </div>
            <div className="hidden min-w-0 truncate md:flex flex-1 text-[#b3b3b3]">{t.album_name}</div>
            <div className="flex items-center justify-self-end shrink-0 w-12 text-white font-semibold text-sm">
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