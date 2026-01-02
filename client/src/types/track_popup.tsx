import type { TrackSummary } from "./track";

export type TrackPopupProps = {
    open: boolean;
    track: TrackSummary | null;
    onClose: () => void;
};