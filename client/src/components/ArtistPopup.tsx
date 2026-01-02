import { IoCloseOutline } from "react-icons/io5";
import type { ArtistPopupProps } from "../types/artist_popup";
import { formatNumber, oneGenre } from "../utils/formatNumber";

export default function ArtistPopup({open, artist, onClose}: ArtistPopupProps){
    if (!open) return null;
    if (!artist) return null; 

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#212121]/80 p-6">
            <div className="relative w-full max-w-2xl rounded-[28px] bg-[#121212] px-10 py-12">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-5 top-5 text-[#b3b3b3] cursor-pointer hover:text-white"
                >
                    <IoCloseOutline size={28} />
                </button>
                <div className="flex flex-col items-center gap-5">
                    <img
                        src={artist.artist_image ?? undefined}
                        alt="not image found" 
                        className="h-32 w-32 rounded-2xl object-cover"
                    />
                    <div className="text-white text-4xl font-extrabold text-center mt-3">
                        {artist.artist_name.toLocaleUpperCase()}
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full">
                        <div>
                            <div className="text-[#1db954] text-xl font-semibold">
                                {formatNumber(artist.artist_followers)}
                            </div>
                            <div className="text-[#b3b3b3] text-xs mt-1">
                                FOLLOWERS
                            </div>
                        </div>
                        <div>
                            <div className="text-[#1db954] text-xl font-semibold">
                                {oneGenre(artist.artist_genres)}
                            </div>
                            <div className="text-[#b3b3b3] text-xs mt-1">
                                GENRE
                            </div>
                        </div>
                        <div>
                            <div className="text-[#1db954] text-xl font-semibold">
                                {artist.artist_popularity}
                            </div>
                            <div className="text-[#b3b3b3] text-xs mt-1">
                                POPULARITY SCORE
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

