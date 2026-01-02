import type { Range } from "../types/time_range";

export type ButtonProps = {
    value: Range;
    onChange: (val: Range) => void;
}