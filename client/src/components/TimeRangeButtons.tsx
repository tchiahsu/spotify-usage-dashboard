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
                        ? "text-black text-xs font-semibold px-5 py-2 bg-[#1DB954] rounded-full transition-all duration-200"
                        : "text-white text-xs font-semibold px-5 py-2 bg-[#535353] rounded-full opacity-70 hover:opacity-100 cursor-pointer"
                }
            >
                <div className="hidden md:block">Last 12 months</div>
                <div className="block md:hidden">12 months</div>
            </button>
            <button
                onClick={() => onChange("medium")}
                className={
                    value === "medium"
                        ? "text-black text-xs font-semibold px-5 py-2 bg-[#1DB954] rounded-full transition-all duration-200"
                        : "text-white text-xs font-semibold px-5 py-2 bg-[#535353] rounded-full opacity-70 hover:opacity-100 cursor-pointer"
                }
            >
                <div className="hidden md:block">Last 6 months</div>
                <div className="block md:hidden">6 months</div>
            </button>
            <button
                onClick={() => onChange("short")}
                className={
                    value === "short"
                        ? "text-black text-xs font-semibold px-5 py-2 bg-[#1DB954] rounded-full transition-all duration-200"
                        : "text-white text-xs font-semibold px-5 py-2 bg-[#535353] rounded-full opacity-70 hover:opacity-100 cursor-pointer"
                }
            >
                <div className="hidden md:block">Last 4 weeks</div>
                <div className="block md:hidden">4 weeks</div>
            </button>
        </div>
    )
}