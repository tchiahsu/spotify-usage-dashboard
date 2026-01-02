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
                        ? "text-white text-lg font-semibold underline"
                        : "text-white text-lg font-semibold opacity-70 hover:opacity-100 cursor-pointer"
                }
            >
                1 Year
            </button>
            <button
                onClick={() => onChange("medium")}
                className={
                    value === "medium"
                        ? "text-white text-lg font-semibold underline"
                        : "text-white text-lg font-semibold opacity-70 hover:opacity-100 cursor-pointer"
                }
            >
                6 Months
            </button>
            <button
                onClick={() => onChange("short")}
                className={
                    value === "short"
                        ? "text-white text-lg font-semibold underline"
                        : "text-white text-lg font-semibold opacity-70 hover:opacity-100 cursor-pointer"
                }
            >
                1 Month
            </button>
        </div>
    )
}