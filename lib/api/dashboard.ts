import { createClient } from "@/lib/supabase/client";
import type { ThoughtRecord } from "@/lib/types/database";

/**
 * Get the most recent thought records for a user
 */
export async function getRecentRecords(
	userId: string,
	limit = 3,
): Promise<ThoughtRecord[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("thought_records")
		.select("*")
		.eq("user_id", userId)
		.eq("is_draft", false)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) throw error;
	return data ?? [];
}

/**
 * Get the count of thought records created this week
 */
export async function getRecordsThisWeek(userId: string): Promise<number> {
	const supabase = createClient();
	const startOfWeek = new Date();
	startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
	startOfWeek.setHours(0, 0, 0, 0);

	const { count, error } = await supabase
		.from("thought_records")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("is_draft", false)
		.gte("created_at", startOfWeek.toISOString());

	if (error) throw error;
	return count ?? 0;
}

/**
 * Calculate the current streak of consecutive days with at least one record
 */
export async function getCurrentStreak(userId: string): Promise<number> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("thought_records")
		.select("created_at")
		.eq("user_id", userId)
		.eq("is_draft", false)
		.order("created_at", { ascending: false });

	if (error) throw error;
	if (!data || data.length === 0) return 0;

	// Extract unique days
	const datesSet = new Set(
		data.map((record) => {
			const date = new Date(record.created_at);
			return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
		}),
	);

	const uniqueDates = Array.from(datesSet)
		.map((dateStr) => new Date(dateStr))
		.sort((a, b) => b.getTime() - a.getTime()); // Most recent first

	if (uniqueDates.length === 0) return 0;

	// Check if today or yesterday has a record
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const mostRecentDate = uniqueDates[0];
	mostRecentDate.setHours(0, 0, 0, 0);

	if (
		mostRecentDate.getTime() !== today.getTime() &&
		mostRecentDate.getTime() !== yesterday.getTime()
	) {
		return 0; // Streak is broken if last record was before yesterday
	}

	// Count consecutive days
	let streak = 1;
	for (let i = 1; i < uniqueDates.length; i++) {
		const current = new Date(uniqueDates[i]);
		current.setHours(0, 0, 0, 0);
		const previous = new Date(uniqueDates[i - 1]);
		previous.setHours(0, 0, 0, 0);

		const daysDiff = Math.round(
			(previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24),
		);

		if (daysDiff === 1) {
			streak++;
		} else {
			break;
		}
	}

	return streak;
}

/**
 * Get the most common distortion slug
 */
export async function getMostCommonDistortion(
	userId: string,
): Promise<string | null> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("thought_records")
		.select("distortion_slug")
		.eq("user_id", userId)
		.eq("is_draft", false)
		.not("distortion_slug", "is", null);

	if (error) throw error;
	if (!data || data.length === 0) return null;

	// Count frequency of each distortion
	const frequency: Record<string, number> = {};
	for (const record of data) {
		if (record.distortion_slug) {
			frequency[record.distortion_slug] =
				(frequency[record.distortion_slug] ?? 0) + 1;
		}
	}

	// Find the most common
	let maxCount = 0;
	let mostCommon: string | null = null;
	for (const [slug, count] of Object.entries(frequency)) {
		if (count > maxCount) {
			maxCount = count;
			mostCommon = slug;
		}
	}

	return mostCommon;
}

/**
 * Get dashboard stats for a user
 */
export async function getDashboardStats(userId: string) {
	const [recentRecords, recordsThisWeek, currentStreak, mostCommonDistSlug] =
		await Promise.all([
			getRecentRecords(userId, 3),
			getRecordsThisWeek(userId),
			getCurrentStreak(userId),
			getMostCommonDistortion(userId),
		]);

	return {
		recentRecords,
		recordsThisWeek,
		currentStreak,
		mostCommonDistSlug,
	};
}
