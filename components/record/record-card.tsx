"use client";

import Link from "next/link";
import type { ThoughtRecord } from "@/lib/types/database";
import { BeforeAfterEmotions } from "./emotion-display";
import { DistortionBadges } from "./distortion-badge";
import { format } from "date-fns";

interface RecordCardProps {
	record: ThoughtRecord;
}

export function RecordCard({ record }: RecordCardProps) {
	// Format date: "OCTOBER 24, 2023 • 9:45 AM"
	const date = new Date(record.created_at);
	const formattedDate = format(date, "MMMM dd, yyyy • h:mm a").toUpperCase();

	// Generate title from situation if no title exists
	const displayTitle =
		record.title ||
		record.situation.trim().split(/\s+/).slice(0, 6).join(" ") + "...";

	return (
		<Link
			href={`/records/${record.id}`}
			className="block p-8 rounded-lg transition-colors"
			style={{
				backgroundColor: "var(--surface-container-high)",
			}}
		>
			{/* Top row: date and distortion badges */}
			<div className="flex justify-between items-start mb-4">
				<span
					className="text-xs uppercase tracking-wide"
					style={{ color: "var(--tertiary)" }}
				>
					{formattedDate}
				</span>
				<DistortionBadges slugs={record.distortion_slugs} linkToLibrary />
			</div>

			{/* Title */}
			<h3
				className="font-serif text-2xl mb-4"
				style={{ color: "var(--on-surface)" }}
			>
				{displayTitle}
			</h3>

			{/* Situation quote */}
			<blockquote
				className="mb-6 pl-4 italic font-serif opacity-90"
				style={{
					borderLeft: "2px solid var(--surface-container-highest)",
					color: "var(--on-surface)",
				}}
			>
				<p className="line-clamp-3">{record.situation}</p>
			</blockquote>

			{/* Before/After emotions */}
			{record.emotions && record.emotions.length > 0 && (
				<div className="pt-6" style={{ borderTop: "1px solid transparent" }}>
					<BeforeAfterEmotions emotions={record.emotions} />
				</div>
			)}
		</Link>
	);
}
