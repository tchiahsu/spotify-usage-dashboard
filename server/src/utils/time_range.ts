export  function getTimeRange(time: unknown): "long_term" | "medium_term" | "short_term" {
    if (time === "long") return "long_term";
    if (time === "medium") return "medium_term";
    if (time === "short") return "short_term";
    return "long_term";
}