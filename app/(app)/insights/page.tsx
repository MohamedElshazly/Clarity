"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetInsightsData } from "@/hooks/use-insights";
import { quotes } from "@/lib/data/quotes";
import type { Period } from "@/lib/api/insights";

export default function InsightsPage() {
	const [period, setPeriod] = useState<Period>("monthly");
	const { data: insights, isLoading } = useGetInsightsData(period);

	// Get a different quote than the dashboard (offset by 1)
	const insightsQuote = quotes[1 % quotes.length];

	if (isLoading) {
		return (
			<main className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
				<Loader2
					className="animate-spin"
					size={32}
					style={{ color: "var(--ms-primary)" }}
				/>
			</main>
		);
	}

	if (!insights) return null;

	const { distortionFrequency, moodShift, streakData, recordsByDay, currentMonth, currentYear } = insights;
	const topDistortions = distortionFrequency.slice(0, 5);

	return (
		<main className="max-w-6xl mx-auto">
			{/* Header with period selector */}
			<section className="mb-12">
				<h1
					className="font-serif text-[clamp(2.5rem,5vw,3.25rem)] leading-[1.1] mb-6"
					style={{ color: "var(--on-surface)" }}
				>
					Your Mind at a Glance.
				</h1>

				<Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
					<TabsList
						className="bg-transparent border-0 p-0 gap-2"
						style={{ height: "auto" }}
					>
						<TabsTrigger
							value="weekly"
							className="clarity-tab-trigger"
							data-state={period === "weekly" ? "active" : "inactive"}
						>
							Weekly
						</TabsTrigger>
						<TabsTrigger
							value="monthly"
							className="clarity-tab-trigger"
							data-state={period === "monthly" ? "active" : "inactive"}
						>
							Monthly
						</TabsTrigger>
						<TabsTrigger
							value="all"
							className="clarity-tab-trigger"
							data-state={period === "all" ? "active" : "inactive"}
						>
							All Time
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</section>

			{/* Two-column layout */}
			<section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
				{/* Left column - Cognitive Patterns (60% = 3/5) */}
				<div
					className="lg:col-span-3 clarity-card p-8"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<div className="flex items-start justify-between mb-6">
						<div>
							<h2
								className="font-serif text-2xl mb-2"
								style={{ color: "var(--on-surface)" }}
							>
								Cognitive Patterns
							</h2>
							<p className="text-sm" style={{ color: "var(--tertiary)" }}>
								Common thought distortions identified this{" "}
								{period === "weekly" ? "week" : period === "monthly" ? "month" : "time"}.
							</p>
						</div>
						<Search size={20} style={{ color: "var(--tertiary)", opacity: 0.5 }} />
					</div>

					{topDistortions.length === 0 ? (
						<p
							className="text-center py-12 font-serif italic"
							style={{ color: "var(--tertiary)" }}
						>
							No patterns identified yet. Keep recording your thoughts.
						</p>
					) : (
						<div className="space-y-6">
							{topDistortions.map((distortion, index) => (
								<CognitivePatternBar
									key={distortion.slug}
									name={distortion.name}
									percentage={distortion.percentage}
									count={distortion.count}
									index={index}
								/>
							))}
						</div>
					)}
				</div>

				{/* Right column - The Shift (40% = 2/5) */}
				<div
					className="lg:col-span-2 clarity-card p-8"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<h2
						className="font-serif text-2xl mb-2"
						style={{ color: "var(--on-surface)" }}
					>
						The Shift
					</h2>
					<p className="text-sm mb-8" style={{ color: "var(--tertiary)" }}>
						Average emotional relief after journaling.
					</p>

					{moodShift.avgBefore === 0 && moodShift.avgAfter === 0 ? (
						<p
							className="text-center py-12 font-serif italic"
							style={{ color: "var(--tertiary)" }}
						>
							Complete more records to see your progress.
						</p>
					) : (
						<>
							<div className="flex items-end justify-center gap-8 mb-8">
								<MoodBar
									label="BEFORE"
									value={moodShift.avgBefore}
									variant="before"
								/>
								<MoodBar
									label="AFTER"
									value={moodShift.avgAfter}
									variant="after"
								/>
							</div>

							<div
								className="p-4 rounded-lg"
								style={{ backgroundColor: "var(--surface-container)" }}
							>
								<p className="text-sm leading-relaxed" style={{ color: "var(--on-surface)" }}>
									On average, your anxiety levels dropped by{" "}
									<span
										className="font-bold"
										style={{ color: "var(--ms-primary)" }}
									>
										{moodShift.percentageImprovement}%
									</span>{" "}
									following a 10-minute session.
								</p>
							</div>
						</>
					)}
				</div>
			</section>

			{/* Consistency Garden */}
			<section
				className="clarity-card p-8 mb-16"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<div className="flex items-start justify-between mb-8 flex-wrap gap-4">
					<div>
						<h2
							className="font-serif text-2xl mb-2"
							style={{ color: "var(--on-surface)" }}
						>
							Consistency Garden
						</h2>
						<p className="text-sm" style={{ color: "var(--tertiary)" }}>
							Your recording frequency throughout{" "}
							{new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
								month: "long",
							})}
							.
						</p>
					</div>

					<div className="flex gap-8">
						<div>
							<p
								className="text-[10px] font-medium tracking-widest mb-1"
								style={{ color: "var(--tertiary)" }}
							>
								CURRENT STREAK
							</p>
							<p
								className="text-2xl font-bold"
								style={{ color: "var(--ms-primary)" }}
							>
								{streakData.currentStreak} {streakData.currentStreak === 1 ? "Day" : "Days"}
							</p>
						</div>
						<div>
							<p
								className="text-[10px] font-medium tracking-widest mb-1"
								style={{ color: "var(--tertiary)" }}
							>
								TOTAL ENTRIES
							</p>
							<p
								className="text-2xl font-bold"
								style={{ color: "var(--on-surface)" }}
							>
								{streakData.totalEntries}
							</p>
						</div>
					</div>
				</div>

				<ConsistencyCalendar
					recordsByDay={recordsByDay}
					month={currentMonth}
					year={currentYear}
				/>
			</section>

			{/* Grounding Quote */}
			<section className="text-center py-16 mb-12">
				<div
					className="text-[4rem] leading-none mb-4 opacity-20"
					style={{ color: "var(--ms-primary)" }}
				>
					"
				</div>
				<blockquote
					className="font-serif italic text-[clamp(1.5rem,3vw,1.75rem)] leading-relaxed max-w-2xl mx-auto mb-6"
					style={{ color: "var(--on-surface)" }}
				>
					{insightsQuote.text}
				</blockquote>
				<p
					className="text-xs mb-2"
					style={{ color: "var(--tertiary)" }}
				>
					— {insightsQuote.attribution}
				</p>
				<p
					className="text-[10px] font-medium tracking-widest"
					style={{ color: "var(--tertiary)" }}
				>
					A GENTLE REMINDER
				</p>
			</section>
		</main>
	);
}

// ─── Cognitive Pattern Bar Component ─────────────────────────────────────────

function CognitivePatternBar({
	name,
	percentage,
	count,
	index,
}: {
	name: string;
	percentage: number;
	count: number;
	index: number;
}) {
	return (
		<div
			className="cognitive-pattern-bar"
			style={{
				animation: `fadeIn 0.4s ease-out ${index * 0.1}s both`,
			}}
		>
			<div className="flex items-center justify-between mb-2">
				<p className="text-sm font-medium" style={{ color: "var(--on-surface)" }}>
					{name}
				</p>
				<p className="text-sm font-bold" style={{ color: "var(--ms-primary)" }}>
					{percentage}%
				</p>
			</div>
			<div
				className="w-full h-1.5 rounded-full overflow-hidden"
				style={{ backgroundColor: "var(--surface-container-highest)" }}
			>
				<div
					className="h-full rounded-full transition-all duration-1000 ease-out"
					style={{
						backgroundColor: "var(--primary-container)",
						width: `${percentage}%`,
						animation: `expandWidth 0.8s ease-out ${index * 0.1 + 0.2}s both`,
					}}
				/>
			</div>
			<p
				className="text-xs mt-1"
				style={{ color: "var(--tertiary)" }}
			>
				{count} {count === 1 ? "occurrence" : "occurrences"}
			</p>
		</div>
	);
}

// ─── Mood Bar Component ───────────────────────────────────────────────────────

function MoodBar({
	label,
	value,
	variant,
}: {
	label: string;
	value: number;
	variant: "before" | "after";
}) {
	const heightPercentage = (value / 10) * 100;

	return (
		<div className="flex flex-col items-center gap-3">
			<div className="relative" style={{ height: "200px", width: "60px" }}>
				<div
					className="absolute bottom-0 w-full rounded-lg transition-all duration-1000 ease-out"
					style={{
						backgroundColor:
							variant === "after"
								? "var(--primary-container)"
								: "var(--surface-container-highest)",
						height: `${heightPercentage}%`,
						animation: "expandHeight 1s ease-out 0.3s both",
					}}
				/>
			</div>
			<div className="text-center">
				<p
					className="text-[10px] font-medium tracking-widest mb-1"
					style={{ color: "var(--tertiary)" }}
				>
					{label}
				</p>
				<p
					className="text-xl font-bold"
					style={{
						color:
							variant === "after"
								? "var(--ms-primary)"
								: "var(--on-surface)",
					}}
				>
					{value.toFixed(1)}
				</p>
			</div>
		</div>
	);
}

// ─── Consistency Calendar Component ──────────────────────────────────────────

function ConsistencyCalendar({
	recordsByDay,
	month,
	year,
}: {
	recordsByDay: Record<string, number>;
	month: number;
	year: number;
}) {
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const daysInMonth = lastDay.getDate();
	const startDay = firstDay.getDay(); // 0 = Sunday

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const days = [];
	for (let i = 0; i < startDay; i++) {
		days.push(<div key={`empty-${i}`} />);
	}

	for (let day = 1; day <= daysInMonth; day++) {
		const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		const hasEntry = recordsByDay[dateKey] > 0;
		const isToday =
			today.getTime() === new Date(year, month, day).getTime();

		days.push(
			<div
				key={day}
				className="consistency-day"
				style={{
					backgroundColor: hasEntry
						? "var(--primary-container)"
						: "var(--surface-container)",
					border: isToday ? "2px solid var(--ms-primary)" : "none",
					boxShadow: hasEntry
						? "0 0 12px 2px rgba(255, 180, 164, 0.15)"
						: "none",
				}}
			>
				<span
					className="text-sm font-medium"
					style={{
						color: hasEntry
							? "var(--on-primary-container)"
							: "var(--tertiary)",
					}}
				>
					{day}
				</span>
			</div>
		);
	}

	return (
		<div>
			{/* Day labels */}
			<div className="grid grid-cols-7 gap-2 mb-3">
				{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
					<div
						key={day}
						className="text-center text-[10px] font-medium tracking-wider"
						style={{ color: "var(--tertiary)" }}
					>
						{day}
					</div>
				))}
			</div>

			{/* Calendar grid */}
			<div className="grid grid-cols-7 gap-2">{days}</div>
		</div>
	);
}
