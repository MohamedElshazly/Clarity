import { createClient } from "@/lib/supabase/client";
import type { ThoughtRecord, OutcomeRatings } from "@/lib/types/database";
import { distortions } from "@/lib/data/distortions";

export type Period = "weekly" | "monthly" | "all";

export type DistortionFrequency = {
	slug: string;
	name: string;
	count: number;
	percentage: number;
};

export type MoodShift = {
	avgBefore: number;
	avgAfter: number;
	percentageImprovement: number;
};

export type RecordsByDay = Record<string, number>;

export type StreakData = {
	currentStreak: number;
	totalEntries: number;
};

/**
 * Get distortion frequency for a given period
 */
export async function getDistortionFrequency(
	userId: string,
	period: Period,
): Promise<DistortionFrequency[]> {
	const supabase = createClient();
	const dateFilter = getDateFilter(period);

	const query = supabase
		.from("thought_records")
		.select("distortion_slug")
		.eq("user_id", userId)
		.eq("is_draft", false)
		.not("distortion_slug", "is", null);

	if (dateFilter) {
		query.gte("created_at", dateFilter.toISOString());
	}

	const { data, error } = await query;

	if (error) throw error;
	if (!data || data.length === 0) return [];

	// Count frequency of each distortion
	const frequency: Record<string, number> = {};
	let total = 0;

	for (const record of data) {
		if (record.distortion_slug) {
			frequency[record.distortion_slug] =
				(frequency[record.distortion_slug] ?? 0) + 1;
			total++;
		}
	}

	// Convert to array with percentages, sorted by count
	const result: DistortionFrequency[] = [];
	for (const [slug, count] of Object.entries(frequency)) {
		const distortion = distortions.find((d) => d.slug === slug);
		if (distortion) {
			result.push({
				slug,
				name: distortion.name,
				count,
				percentage: Math.round((count / total) * 100),
			});
		}
	}

	return result.sort((a, b) => b.count - a.count);
}

/**
 * Get average mood shift (before/after) for a given period
 */
export async function getMoodShiftAverage(
	userId: string,
	period: Period,
): Promise<MoodShift> {
	const supabase = createClient();
	const dateFilter = getDateFilter(period);

	const query = supabase
		.from("thought_records")
		.select("emotions, outcome_ratings")
		.eq("user_id", userId)
		.eq("is_draft", false)
		.not("emotions", "is", null);

	if (dateFilter) {
		query.gte("created_at", dateFilter.toISOString());
	}

	const { data, error } = await query;

	if (error) throw error;
	if (!data || data.length === 0) {
		return { avgBefore: 0, avgAfter: 0, percentageImprovement: 0 };
	}

	// Calculate average emotional intensity before and after
	let totalBefore = 0;
	let totalAfter = 0;
	let countBefore = 0;
	let countAfter = 0;

	for (const record of data) {
		if (record.emotions && Array.isArray(record.emotions)) {
			const emotions = record.emotions as Array<{
				id: string;
				label: string;
				intensity_before: number;
				intensity_after?: number | null;
			}>;

			for (const emotion of emotions) {
				if (typeof emotion.intensity_before === "number") {
					// Convert 0-100 to 0-10 scale
					totalBefore += emotion.intensity_before / 10;
					countBefore++;
				}
			}

			// Use outcome_ratings anxiety as "after" if available
			if (record.outcome_ratings) {
				const ratings = record.outcome_ratings as OutcomeRatings;
				if (typeof ratings.anxiety === "number") {
					totalAfter += ratings.anxiety / 10;
					countAfter++;
				}
			}
		}
	}

	if (countBefore === 0 || countAfter === 0) {
		return { avgBefore: 0, avgAfter: 0, percentageImprovement: 0 };
	}

	const avgBefore = totalBefore / countBefore;
	const avgAfter = totalAfter / countAfter;
	const percentageImprovement = Math.round(
		((avgBefore - avgAfter) / avgBefore) * 100,
	);

	return {
		avgBefore: Math.round(avgBefore * 10) / 10,
		avgAfter: Math.round(avgAfter * 10) / 10,
		percentageImprovement: Math.max(0, percentageImprovement),
	};
}

/**
 * Get records count by day for a given month
 */
export async function getRecordsByDay(
	userId: string,
	month: number,
	year: number,
): Promise<RecordsByDay> {
	const supabase = createClient();

	// Get start and end of month
	const startDate = new Date(year, month, 1);
	const endDate = new Date(year, month + 1, 0, 23, 59, 59);

	const { data, error } = await supabase
		.from("thought_records")
		.select("created_at")
		.eq("user_id", userId)
		.eq("is_draft", false)
		.gte("created_at", startDate.toISOString())
		.lte("created_at", endDate.toISOString());

	if (error) throw error;
	if (!data || data.length === 0) return {};

	// Count records per day
	const recordsByDay: RecordsByDay = {};
	for (const record of data) {
		const date = new Date(record.created_at);
		const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		recordsByDay[dateKey] = (recordsByDay[dateKey] ?? 0) + 1;
	}

	return recordsByDay;
}

/**
 * Get streak data for a user
 */
export async function getStreakData(userId: string): Promise<StreakData> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("thought_records")
		.select("created_at")
		.eq("user_id", userId)
		.eq("is_draft", false)
		.order("created_at", { ascending: false });

	if (error) throw error;
	if (!data || data.length === 0) {
		return { currentStreak: 0, totalEntries: 0 };
	}

	// Extract unique days
	const datesSet = new Set(
		data.map((record) => {
			const date = new Date(record.created_at);
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		}),
	);

	const uniqueDates = Array.from(datesSet)
		.map((dateStr) => new Date(dateStr))
		.sort((a, b) => b.getTime() - a.getTime()); // Most recent first

	if (uniqueDates.length === 0) {
		return { currentStreak: 0, totalEntries: data.length };
	}

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
		return { currentStreak: 0, totalEntries: data.length };
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

	return {
		currentStreak: streak,
		totalEntries: data.length,
	};
}

/**
 * Get all insights data for a given period
 */
export async function getInsightsData(userId: string, period: Period) {
	const currentDate = new Date();
	const [distortionFreq, moodShift, streakData, recordsByDay] =
		await Promise.all([
			getDistortionFrequency(userId, period),
			getMoodShiftAverage(userId, period),
			getStreakData(userId),
			getRecordsByDay(userId, currentDate.getMonth(), currentDate.getFullYear()),
		]);

	return {
		distortionFrequency: distortionFreq,
		moodShift,
		streakData,
		recordsByDay,
		currentMonth: currentDate.getMonth(),
		currentYear: currentDate.getFullYear(),
	};
}

/**
 * Helper function to get date filter for period
 */
function getDateFilter(period: Period): Date | null {
	const now = new Date();

	switch (period) {
		case "weekly": {
			const weekAgo = new Date(now);
			weekAgo.setDate(weekAgo.getDate() - 7);
			return weekAgo;
		}
		case "monthly": {
			const monthAgo = new Date(now);
			monthAgo.setMonth(monthAgo.getMonth() - 1);
			return monthAgo;
		}
		case "all":
			return null;
		default:
			return null;
	}
}
