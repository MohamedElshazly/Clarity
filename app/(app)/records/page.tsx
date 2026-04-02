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
import { subDays, isAfter } from "date-fns";
import { RecordsSkeleton } from "@/components/skeletons/records-skeleton";

export default function RecordsPage() {
	const { data: records, isLoading } = useUserRecords();
	const [selectedEmotion, setSelectedEmotion] = useState<string>("all");
	const [selectedDistortion, setSelectedDistortion] = useState<string>("all");
	const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");

	// Filter records based on selected filters
	const filteredRecords = useMemo(() => {
		if (!records) return [];

		let filtered = [...records];

		// Filter by emotion
		if (selectedEmotion !== "all") {
			filtered = filtered.filter((record) =>
				record.emotions.some((e) => e.id === selectedEmotion)
			);
		}

		// Filter by distortion
		if (selectedDistortion !== "all") {
			filtered = filtered.filter((record) =>
				record.distortion_slugs.includes(selectedDistortion)
			);
		}

		// Filter by timeframe
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

	// Show loading skeleton during data fetch
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
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
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
							className="border-0"
							style={{
								backgroundColor: "var(--surface-container-high)",
								color: "var(--on-surface)",
							}}
						>
							<SelectValue placeholder="All Emotions" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Emotions</SelectItem>
							{emotions.map((emotion) => (
								<SelectItem key={emotion.id} value={emotion.id}>
									{emotion.label}
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
							className="border-0"
							style={{
								backgroundColor: "var(--surface-container-high)",
								color: "var(--on-surface)",
							}}
						>
							<SelectValue placeholder="All Distortions" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Distortions</SelectItem>
							{distortions.map((distortion) => (
								<SelectItem key={distortion.slug} value={distortion.slug}>
									{distortion.name}
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
							className="border-0"
							style={{
								backgroundColor: "var(--surface-container-high)",
								color: "var(--on-surface)",
							}}
						>
							<SelectValue placeholder="All Time" />
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

			{/* Timeline list */}
			{filteredRecords.length === 0 ? (
				<div
					className="p-12 rounded-lg text-center"
					style={{
						backgroundColor: "var(--surface-container-high)",
					}}
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

					{/* Record cards */}
					<div className="space-y-8">
						{filteredRecords.map((record) => (
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
			)}
		</main>
	);
}
