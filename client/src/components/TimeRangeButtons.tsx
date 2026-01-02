import type { ButtonProps } from "../types/time_buttons";

export default function TimeRangeButtons(props: ButtonProps) {
    const value = props.value;
    const onChange = props.onChange;

    return (
        <div className="flex gap-4">
            <button
                onClick={() => onChange("long")}
                className={
                    value === "long"
                        ? "text-black text-md font-semibold px-5 py-1 bg-[#1DB954] rounded-full transition-all duration-200"
                        : "text-white text-md font-semibold px-5 py-1 bg-[#535353] rounded-full opacity-70 hover:opacity-100 cursor-pointer"
                }
            >
                Last 12 months
            </button>
            <button
                onClick={() => onChange("medium")}
                className={
                    value === "medium"
                        ? "text-black text-md font-semibold px-5 py-1 bg-[#1DB954] rounded-full transition-all duration-200"
                        : "text-white text-md font-semibold px-5 py-1 bg-[#535353] rounded-full opacity-70 hover:opacity-100 cursor-pointer"
                }
            >
                Last 6 months
            </button>
            <button
                onClick={() => onChange("short")}
                className={
                    value === "short"
                        ? "text-black text-md font-semibold px-5 py-1 bg-[#1DB954] rounded-full transition-all duration-200"
                        : "text-white text-md font-semibold px-5 py-1 bg-[#535353] rounded-full opacity-70 hover:opacity-100 cursor-pointer"
                }
            >
                Last 4 weeks
            </button>
        </div>
    )
}