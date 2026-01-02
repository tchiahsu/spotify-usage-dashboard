import { IoCloseOutline } from "react-icons/io5";
import type { TrackPopupProps } from "../types/track_popup";
import { formatDuration, releaseYear } from "../utils/formatNumber";

export default function TrackPopup({open, track, onClose}: TrackPopupProps){
    if (!open) return null;
    if (!track) return null; 

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#212121]/80 p-6">
            <div className="relative w-full max-w-3xl rounded-[28px] bg-[#121212] px-10 py-12">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-5 top-5 text-[#b3b3b3] cursor-pointer hover:text-white"
                >
                    <IoCloseOutline size={28} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-[245px_1fr] items-center">
                    <img
                        src={track.album_image ?? undefined}
                        alt="not image found" 
                        className="h-52 w-52 rounded-2xl object-cover"
                    />
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <div className="text-white text-2xl font-extrabold">
                            {track.track_name.toLocaleUpperCase()}
                        </div>
                        <div className="text-[#b3b3b3] text-xl font-bold">
                            {track.artist_names}
                        </div>
                        <div className="text-[#b3b3b3] text-sm font-semibold">
                            {track.album_name}
                        </div>
                        <button
                            className="inline-flex w-fit px-4 py-2 mt-4 rounded-3xl bg-[#1DB954] text-white text-sm font-semibold hover:scale-105 active:scale-100"
                            onClick={() => { window.open(`https://open.spotify.com/track/${track.track_id}`)}}
                        >
                            Play on Spotify
                        </button>
                    </div>
                </div>
                <div className="mt-12 mb-2 grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full">
                    <div>
                        <div className="text-[#1db954] text-xl font-semibold">
                            {releaseYear(track.track_date)}
                        </div>
                        <div className="text-[#b3b3b3] text-xs tracking-widest mt-1">
                            RELEASE DATE
                        </div>
                    </div>
                    <div>
                        <div className="text-[#1db954] text-xl font-semibold">
                            {formatDuration(track.track_duration)}
                        </div>
                        <div className="text-[#b3b3b3] text-xs tracking-widest mt-1">
                            DURATION
                        </div>
                    </div>
                    <div>
                        <div className="text-[#1db954] text-xl font-semibold">
                            {track.track_popularity}
                        </div>
                        <div className="text-[#b3b3b3] text-xs tracking-widest mt-1">
                            POPULARITY
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

