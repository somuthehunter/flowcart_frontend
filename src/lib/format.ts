import { format as dateFnsFormat } from "date-fns";

export function formatDate(
    date: Date | string | number,
    format: string = "MM/dd/yyyy"
): string {
    if (!date) return "";

    const dateObject =
        typeof date === "string" || typeof date === "number"
            ? new Date(date)
            : date;

    if (isNaN(dateObject.getTime())) return "";

    return dateFnsFormat(dateObject, format);
}

export function formatDateTime(
    date: Date | string | number,
    format: string = "MM/dd/yyyy HH:mm"
): string {
    if (!date) return "";

    const dateObject =
        typeof date === "string" || typeof date === "number"
            ? new Date(date)
            : date;

    if (isNaN(dateObject.getTime())) return "";

    return dateFnsFormat(dateObject, format);
}
export function formatTime(date: Date | string | number): string {
    if (!date) return "";

    const dateObject =
        typeof date === "string" || typeof date === "number"
            ? new Date(date)
            : date;

    if (isNaN(dateObject.getTime())) return "";

    return dateFnsFormat(dateObject, "HH:mm");
}

/**
 * Converts all alphabetical characters to uppercase while preserving
 * digits, separators, and the original character order.
 *
 * @param code - String to be formatted (e.g., export code)
 * @returns Uppercased string, or an empty string when the input is missing
 *
 * @example
 * toUppercaseAlpha("exp-001") // "EXP-001"
 * toUppercaseAlpha("ExP-abc-12") // "EXP-ABC-12"
 * toUppercaseAlpha(undefined) // ""
 */
export function toUppercaseAlpha(code?: string | null): string {
    if (!code) return "";

    return code.toUpperCase();
}

type DurationFormatStyle = "digital" | "short" | "long" | "narrow";

interface FormatDurationOptions {
    /**
     * Format style:
     * - "digital": 01:30:45 or 1:30:45
     * - "short": 1h 30m 45s
     * - "long": 1 hour 30 minutes 45 seconds
     * - "narrow": 1h30m45s (no spaces)
     * @default "digital"
     */
    style?: DurationFormatStyle;
    /**
     * Show leading zeros in digital format (01:30:45 vs 1:30:45)
     * @default true
     */
    padded?: boolean;
    /**
     * Include zero values (e.g., "0h 30m" vs "30m")
     * @default false
     */
    showZero?: boolean;
    /**
     * Maximum unit to display (will convert to this unit if duration exceeds it)
     * @default "hours"
     */
    maxUnit?: "seconds" | "minutes" | "hours" | "days";
    /**
     * Minimum number of units to show in digital format
     * @default 2 (shows MM:SS even if hours is 0)
     */
    minUnits?: number;
}

/**
 * Formats a duration in seconds to a human-readable string
 * @param seconds - Duration in seconds (can be decimal)
 * @param options - Formatting options
 * @returns Formatted duration string
 *
 * @example
 * formatDuration(3665) // "01:01:05"
 * formatDuration(3665, { style: "short" }) // "1h 1m 5s"
 * formatDuration(3665, { style: "long" }) // "1 hour 1 minute 5 seconds"
 * formatDuration(90, { style: "digital", minUnits: 3 }) // "00:01:30"
 * formatDuration(45, { style: "short", showZero: true }) // "0h 0m 45s"
 */
export function formatDuration(
    seconds: number,
    options: FormatDurationOptions = {}
): string {
    if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
        return "";
    }

    const {
        style = "digital",
        padded = true,
        showZero = false,
        maxUnit = "hours",
        minUnits = 2,
    } = options;

    // Calculate units
    let remaining = Math.floor(seconds);
    const days = Math.floor(remaining / 86400);
    remaining %= 86400;
    const hrs = Math.floor(remaining / 3600);
    remaining %= 3600;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;

    // Adjust based on maxUnit
    let adjustedDays = days;
    let adjustedHrs = hrs;
    let adjustedMins = mins;
    let adjustedSecs = secs;

    if (maxUnit === "hours" && days > 0) {
        adjustedHrs += days * 24;
        adjustedDays = 0;
    } else if (maxUnit === "minutes") {
        adjustedMins += days * 24 * 60 + hrs * 60;
        adjustedDays = 0;
        adjustedHrs = 0;
    } else if (maxUnit === "seconds") {
        adjustedSecs = Math.floor(seconds);
        adjustedDays = 0;
        adjustedHrs = 0;
        adjustedMins = 0;
    }

    if (style === "digital") {
        const parts: string[] = [];
        const pad = (n: number) =>
            padded ? n.toString().padStart(2, "0") : n.toString();

        if (adjustedDays > 0 || (showZero && maxUnit === "days")) {
            parts.push(pad(adjustedDays));
        }
        if (
            adjustedHrs > 0 ||
            parts.length > 0 ||
            (showZero && maxUnit !== "seconds")
        ) {
            parts.push(pad(adjustedHrs));
        }
        if (adjustedMins > 0 || parts.length > 0 || minUnits >= 2) {
            parts.push(pad(adjustedMins));
        }
        if (parts.length > 0 || minUnits >= 1) {
            parts.push(pad(adjustedSecs));
        }

        // Ensure minimum units
        while (parts.length < minUnits) {
            parts.unshift(pad(0));
        }

        return parts.join(":");
    }

    // For text-based formats
    const units: Array<{ value: number; singular: string; short: string }> = [];

    if (maxUnit === "days") {
        units.push({ value: adjustedDays, singular: "day", short: "d" });
    }
    if (maxUnit !== "seconds" && maxUnit !== "minutes") {
        units.push({ value: adjustedHrs, singular: "hour", short: "h" });
    }
    if (maxUnit !== "seconds") {
        units.push({ value: adjustedMins, singular: "minute", short: "m" });
    }
    units.push({ value: adjustedSecs, singular: "second", short: "s" });

    const parts = units
        .filter((unit) => showZero || unit.value > 0)
        .map((unit) => {
            if (style === "short") {
                return `${unit.value}${unit.short}`;
            } else if (style === "narrow") {
                return `${unit.value}${unit.short}`;
            } else if (style === "long") {
                const label =
                    unit.value === 1 ? unit.singular : `${unit.singular}s`;
                return `${unit.value} ${label}`;
            }
            return "";
        });

    if (parts.length === 0) {
        return style === "long" ? "0 seconds" : "0s";
    }

    return style === "narrow" ? parts.join("") : parts.join(" ");
}

/**
 * Converts a duration string in HH:MM:SS format to seconds
 * @param duration - Duration string in format "HH:MM:SS", "MM:SS", or "SS"
 * @returns Duration in seconds, or 0 if invalid
 *
 * @example
 * parseDurationString("00:30:00") // 1800
 * parseDurationString("01:30:45") // 5445
 * parseDurationString("05:30") // 330
 */
export function parseDurationString(duration: string): number {
    if (!duration || typeof duration !== "string") return 0;

    const parts = duration.split(":").map((p) => parseInt(p));
    if (parts.some(isNaN)) return 0;

    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
        return parts[0];
    }

    return 0;
}

/**
 * Formats a duration string from backend (HH:MM:SS) to any desired format
 * Wrapper function that combines parseDurationString and formatDuration
 * @param duration - Duration string in format "HH:MM:SS", "MM:SS", or "SS"
 * @param options - Formatting options (same as formatDuration)
 * @returns Formatted duration string, or "-" if invalid
 *
 * @example
 * formatDurationString("00:30:00") // "00:30:00"
 * formatDurationString("00:30:00", { style: "short" }) // "30m"
 * formatDurationString("01:30:45", { style: "long" }) // "1 hour 30 minutes 45 seconds"
 * formatDurationString("00:30:00", { padded: false }) // "30:00"
 * formatDurationString(null) // "-"
 * formatDurationString("") // "-"
 */
export function formatDurationString(
    duration: string | null | undefined,
    options: FormatDurationOptions = {}
): string {
    if (!duration) return "-";

    const seconds = parseDurationString(duration);
    if (seconds === 0 && duration !== "00:00:00" && duration !== "0") {
        return "-"; // Invalid format
    }

    return formatDuration(seconds, options);
}
