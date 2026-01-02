import type { ArtistSummary } from "./artist";

export type ArtistPopupProps = {
    open: boolean;
    artist: ArtistSummary | null;
    onClose: () => void;
};