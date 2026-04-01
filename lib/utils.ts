import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Get time-based greeting
 */
export function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
}

/**
 * Format date as "MONDAY, OCTOBER 23RD"
 */
export function formatDateHeader(date: Date): string {
	const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
	const monthName = date.toLocaleDateString("en-US", { month: "long" });
	const day = date.getDate();
	const suffix = getOrdinalSuffix(day);

	return `${dayName.toUpperCase()}, ${monthName.toUpperCase()} ${day}${suffix.toUpperCase()}`;
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(n: number): string {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Format short date for record cards (e.g., "OCT 22")
 */
export function formatShortDate(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	const month = d.toLocaleDateString("en-US", { month: "short" });
	const day = d.getDate();
	return `${month.toUpperCase()} ${day}`;
}

/**
 * Format time (e.g., "2:30 PM")
 */
export function formatTime(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
	});
}

/**
 * Truncate text to a specified number of lines using CSS
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "...";
}
