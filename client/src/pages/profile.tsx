import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { formatNumber, formatDuration } from "../utils/formatNumber";

import type { ProfileSummary } from "../types/profile";
import type { TopTrackSummary, TrackSummary } from "../types/track";
import type { UserPlaylistsSummary } from "../types/playlist";
import type { ArtistSummary, TopArtistSummary } from "../types/artist";
import ArtistPopup from "../components/ArtistPopup";
import TrackPopup from "../components/TrackPopup";

const BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN ?? "https://spotifylisten.vercel.app/api";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [topArtists, setTopArtists] = useState<TopArtistSummary | null>(null);
  const [topTracks, setTopTracks] = useState<TopTrackSummary | null>(null);
  const [playlists, setPlaylists] = useState<UserPlaylistsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedArist, setSelectedArtist] = useState<ArtistSummary | null>(null);
  const [openPopupTrack, setOpenPopupTrack] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackSummary | null>(null);

  const navigate = useNavigate();

  async function getProfileInfo() {
    try {
      const response = await fetch(`${BACKEND_URL}/profile/summary`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch profile (${response.status})`);
      }

      const data: ProfileSummary = await response.json();
      setProfile(data);
    } catch (e) {
      console.error(e);
      setError("Unable to load profile");
    } finally {
      setLoading(false);
    }
  }

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
    getProfileInfo();
    getUserPlaylists();
    getTopArtists();
    getTopTracks();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="h-15 w-15 animate-spin rounded-full border-5 border-[#1DB954] border-t-[#212121]" />
      </div>
    )
  };
  if (error) return <div className="text-red-500">{error}</div>
  if (!profile) return null;

  return (
    <div className="flex flex-col gap-10 xl:gap-15 mx-10 my-10 sm:mx-20 xl:mx-40 xl:my-25 justify-baseline">
      {/* Profile Information */}
      <div className="bg-[#212121] flex flex-col md:flex-row items-center gap-10 w-full">
        {/* Profile Image */}
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl}
            alt="Profile"
            className="h-42 w-42 rounded-full object-cover"
          />
        ) : (
          <div className="flex justify-center items-center">
            N/A
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Profile Name */}
          <div className="text-white text-5xl tracking-wider font-bold">{profile.displayName}</div>

          {/* Profile Stats */}
          <div className="flex flex-row gap-10">
            {/* Follower Count */}
            <div className="flex flex-row gap-2">
              <div className="text-[#1DB954] font-bold">{profile.followers}</div>
              <div className="text-[#535353] font-bold">Followers</div>
            </div>

            {/* Playlist Count */}
            <div className="flex flex-row gap-2">
              <div className="text-[#1DB954] font-bold">{playlists?.length ?? 0}</div>
              <div className="text-[#535353] font-bold">Playlists</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Top Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-20 w-full">
        {/* Top Artists */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="text-white font-bold text-xl">All Time Top Artists</div>
            <a href="/top-artists" className="flex sm:hidden lg:flex text-[#B3B3B3] text-xs font-bold hover:underline cursor-pointer">Show all</a>
          </div>
          {topArtists?.slice(0, 10).map((a) => (
            <div className="flex flew-row items-center gap-5">
              {a.artist_images ? (
                <img 
                  src={a.artist_images} 
                  alt="not image found" 
                  className="w-12 h-12 object-cover rounded-full cursor-pointer hover:scale-110 transition-all duration-200" 
                  onClick={() => openArtistPopup(a.artist_id)}    
                />
                  
              ) : (
                <div>N/A</div>
              )}

              <div>
                <div 
                  className="text-white text-md tracking-wide cursor-pointer hover:underline"
                  onClick={() => openArtistPopup(a.artist_id)}
                >
                    {a.artist_name}
                </div>
                <div className="flex flex-row text-[8pt] gap-2">
                  <div className="text-[#1DB954] font-semibold">{formatNumber(a.artist_follower_total)}</div>
                  <div className="text-[#535353] font-semibold">Followers</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Tracks */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="text-white font-bold text-xl">All Time Top Tracks</div>
            <a href="/top-tracks" className="flex sm:hidden lg:flex text-[#B3B3B3] text-xs font-bold hover:underline cursor-pointer">Show all</a>
          </div>
          {topTracks?.slice(0, 10).map((t) => (
            <div className="flex justify-between items-center">
              <div className="flex flew-1 min-w-0 items-center gap-5">
                {t.album_image ? (
                  <img 
                    src={t.album_image} 
                    alt="not image found" 
                    className="w-12 h-12 object-cover cursor-pointer hover:scale-110 transition-all duration-200" 
                    onClick={() => openTrackPopup(t.track_id)}    
                  />
                ) : (
                  <div>N/A</div>
                )}

                <div className="flex min-w-0 flex-col gap-1">
                  <div 
                    className="min-w-0 truncate text-white text-md tracking-wide cursor-pointer hover:underline"
                    onClick={() => openTrackPopup(t.track_id)}  
                  >
                    {t.track_name}
                  </div>
                  <div className="flex min-w-0 items-center gap-1 text-white text-xs">
                    <div
                      className="truncate cursor-pointer hover:underline"
                      onClick={() => {if (t.artist_id) openArtistPopup(t.artist_id)}}
                    >
                      {t.artist_name}
                    </div>
                    <GoDotFill size={7} className="shrink-0" />
                    <div className="min-w-0 truncate opacity-90">{t.album_name}</div>
                  </div>
                </div>
              </div>
              <div className="shrink-0 w-12 text-right tabular-nums text-[#b3b3b3] font-semibold text-xs">
                {formatDuration(t.track_duration)}
              </div>
            </div>
          ))}
        </div>
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