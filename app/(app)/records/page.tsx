"use client";

import { useMemo, useState } from "react";
import { useUserRecords } from "@/hooks/use-records";
import { RecordCard } from "@/components/record/record-card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { emotions } from "@/lib/data/emotions";
import { distortions } from "@/lib/data/distortions";
import type { ThoughtRecord } from "@/lib/types/database";
import { subDays, isAfter, startOfDay } from "date-fns";
import { RecordsSkeleton } from "@/components/skeletons/records-skeleton";
import { startCase } from "lodash";

export default function RecordsPage() {
	const { data: records, isPending: isLoading } = useUserRecords();
	const [selectedEmotion, setSelectedEmotion] = useState<string>("all");
	const [selectedDistortion, setSelectedDistortion] = useState<string>("all");
	const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");

	const hasActiveFilters =
		selectedEmotion !== "all" ||
		selectedDistortion !== "all" ||
		selectedTimeframe !== "all";

	// Filter records based on selected filters
	const filteredRecords = useMemo(() => {
		if (!records) return [];

		let filtered = [...records];

		if (selectedEmotion !== "all") {
			filtered = filtered.filter((record) =>
				record.emotions.some((e) => e.id === selectedEmotion)
			);
		}

		if (selectedDistortion !== "all") {
			filtered = filtered.filter((record) =>
				record.distortion_slugs.includes(selectedDistortion)
			);
		}

		if (selectedTimeframe !== "all") {
			const now = new Date();
			let cutoffDate: Date;

			switch (selectedTimeframe) {
				case "7":
					cutoffDate = subDays(now, 7);
					break;
				case "30":
					cutoffDate = subDays(now, 30);
					break;
				case "90":
					cutoffDate = subDays(now, 90);
					break;
				default:
					return filtered;
			}

			filtered = filtered.filter((record) =>
				isAfter(new Date(record.created_at), cutoffDate)
			);
		}

		return filtered;
	}, [records, selectedEmotion, selectedDistortion, selectedTimeframe]);

	// Group filtered records into time buckets
	const groupedRecords = useMemo(() => {
		if (filteredRecords.length === 0) return [];

		const now = new Date();
		const todayStart = startOfDay(now);
		const weekStart = startOfDay(subDays(now, 7));
		const monthStart = startOfDay(subDays(now, 30));

		const todayRecs = filteredRecords.filter((r) =>
			isAfter(new Date(r.created_at), todayStart)
		);
		const weekRecs = filteredRecords.filter(
			(r) =>
				!isAfter(new Date(r.created_at), todayStart) &&
				isAfter(new Date(r.created_at), weekStart)
		);
		const monthRecs = filteredRecords.filter(
			(r) =>
				!isAfter(new Date(r.created_at), weekStart) &&
				isAfter(new Date(r.created_at), monthStart)
		);
		const olderRecs = filteredRecords.filter(
			(r) => !isAfter(new Date(r.created_at), monthStart)
		);

		const groups: { label: string; records: ThoughtRecord[] }[] = [];
		if (todayRecs.length > 0) groups.push({ label: "Today", records: todayRecs });
		if (weekRecs.length > 0) groups.push({ label: "This Week", records: weekRecs });
		if (monthRecs.length > 0) groups.push({ label: "This Month", records: monthRecs });
		if (olderRecs.length > 0) groups.push({ label: "Older", records: olderRecs });

		return groups;
	}, [filteredRecords]);

	if (isLoading) return <RecordsSkeleton />;

	return (
		<main className="max-w-5xl mx-auto px-6 py-12">
			{/* Page header */}
			<div className="mb-12">
				<h1
					className="font-serif text-5xl lg:text-6xl mb-4"
					style={{ color: "var(--on-surface)" }}
				>
					My Records
				</h1>
				<p
					className="text-base max-w-lg"
					style={{ color: "var(--tertiary)" }}
				>
					A chronological landscape of your reflections, tracing the path from
					complexity to clarity.
				</p>
			</div>

			{/* Filter bar */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				{/* Emotions filter */}
				<div>
					<label
						className="text-xs uppercase tracking-wide mb-2 block"
						style={{ color: "var(--tertiary)" }}
					>
						Filter Emotions
					</label>
					<Select
						value={selectedEmotion}
						onValueChange={(value) => setSelectedEmotion(value || "all")}
					>
						<SelectTrigger
							className="w-full border-0"
							style={{ color: "var(--on-surface)" }}
						>
							<SelectValue placeholder="All Emotions">
								{selectedEmotion === "all"
									? "All Emotions"
									: startCase(emotions.find((e) => e.id === selectedEmotion)?.label || "")}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Emotions</SelectItem>
							{emotions.map((emotion) => (
								<SelectItem key={emotion.id} value={emotion.id}>
									{startCase(emotion.label)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Distortions filter */}
				<div>
					<label
						className="text-xs uppercase tracking-wide mb-2 block"
						style={{ color: "var(--tertiary)" }}
					>
						Cognitive Patterns
					</label>
					<Select
						value={selectedDistortion}
						onValueChange={(value) => setSelectedDistortion(value || "all")}
					>
						<SelectTrigger
							className="w-full border-0"
							style={{ color: "var(--on-surface)" }}
						>
							<SelectValue placeholder="All Distortions">
								{selectedDistortion === "all"
									? "All Distortions"
									: startCase(distortions.find((d) => d.slug === selectedDistortion)?.name || "")}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Distortions</SelectItem>
							{distortions.map((distortion) => (
								<SelectItem key={distortion.slug} value={distortion.slug}>
									{startCase(distortion.name)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Timeframe filter */}
				<div>
					<label
						className="text-xs uppercase tracking-wide mb-2 block"
						style={{ color: "var(--tertiary)" }}
					>
						Timeframe
					</label>
					<Select
						value={selectedTimeframe}
						onValueChange={(value) => setSelectedTimeframe(value || "all")}
					>
						<SelectTrigger
							className="w-full border-0"
							style={{ color: "var(--on-surface)" }}
						>
							<SelectValue placeholder="All Time">
								{selectedTimeframe === "all" && "All Time"}
								{selectedTimeframe === "7" && "Last 7 Days"}
								{selectedTimeframe === "30" && "Last 30 Days"}
								{selectedTimeframe === "90" && "Last 90 Days"}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Time</SelectItem>
							<SelectItem value="7">Last 7 Days</SelectItem>
							<SelectItem value="30">Last 30 Days</SelectItem>
							<SelectItem value="90">Last 90 Days</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Results count + clear filters */}
			{records && records.length > 0 && (
				<div className="flex items-center justify-between mb-8">
					<span className="text-sm" style={{ color: "var(--tertiary)" }}>
						Showing {filteredRecords.length} of {records.length}{" "}
						{records.length === 1 ? "record" : "records"}
					</span>
					{hasActiveFilters && (
						<button
							onClick={() => {
								setSelectedEmotion("all");
								setSelectedDistortion("all");
								setSelectedTimeframe("all");
							}}
							className="text-xs uppercase tracking-wide underline-offset-2 hover:underline transition-all"
							style={{ color: "var(--tertiary)" }}
						>
							Clear filters
						</button>
					)}
				</div>
			)}

			{/* Timeline list */}
			{filteredRecords.length === 0 ? (
				<div
					className="p-12 rounded-lg text-center"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<p
						className="font-serif italic text-lg"
						style={{ color: "var(--tertiary)" }}
					>
						{records && records.length > 0
							? "No records match the selected filters."
							: "Your reflections will appear here. Begin your first session whenever you're ready."}
					</p>
				</div>
			) : (
				<div className="relative">
					{/* Timeline vertical line */}
					<div
						className="absolute left-0 top-0 bottom-0 w-px"
						style={{
							backgroundColor: "var(--surface-container-highest)",
							marginLeft: "0.5rem",
						}}
					/>

					{/* Grouped record cards */}
					<div className="space-y-10">
						{groupedRecords.map((group) => (
							<div key={group.label}>
								{/* Group label */}
								<div className="relative pl-8 mb-5">
									<span
										className="text-xs uppercase tracking-widest font-medium"
										style={{ color: "var(--tertiary)" }}
									>
										{group.label}
									</span>
								</div>

								{/* Cards within group */}
								<div className="space-y-6">
									{group.records.map((record) => (
										<div key={record.id} className="relative pl-8">
											{/* Timeline dot */}
											<div
												className="absolute left-0 top-8 w-4 h-4 rounded-full"
												style={{
													backgroundColor: "var(--surface-container-highest)",
												}}
											/>
											<RecordCard record={record} />
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</main>
	);
}
