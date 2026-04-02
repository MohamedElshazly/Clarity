"use client";

import type { ThoughtRecord } from "@/lib/types/database";
import { DistortionBadges } from "./distortion-badge";
import { BeforeAfterEmotions } from "./emotion-display";
import { format } from "date-fns";

interface RecordViewProps {
	record: ThoughtRecord;
	onDelete: () => void;
}

export function RecordView({ record, onDelete }: RecordViewProps) {
	const date = new Date(record.created_at);
	const formattedDate = format(date, "MMMM dd, yyyy • h:mm a");

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<div className="flex justify-between items-start mb-4">
					<span
						className="text-xs uppercase tracking-wide"
						style={{ color: "var(--tertiary)" }}
					>
						{formattedDate}
					</span>
					<DistortionBadges slugs={record.distortion_slugs} linkToLibrary />
				</div>

				<h1
					className="font-serif text-4xl lg:text-5xl"
					style={{ color: "var(--on-surface)" }}
				>
					{record.title ||
						record.situation.trim().split(/\s+/).slice(0, 6).join(" ") + "..."}
				</h1>
			</div>

			{/* Situation */}
			<section>
				<h2
					className="text-xs uppercase tracking-wide mb-3"
					style={{ color: "var(--tertiary)" }}
				>
					Situation
				</h2>
				<p className="text-base leading-relaxed" style={{ color: "var(--on-surface)" }}>
					{record.situation}
				</p>
			</section>

			{/* Initial Emotions */}
			<section>
				<h2
					className="text-xs uppercase tracking-wide mb-3"
					style={{ color: "var(--tertiary)" }}
				>
					Initial Emotions
				</h2>
				<div className="space-y-2">
					{record.emotions.map((emotion) => (
						<div key={emotion.id} className="flex justify-between items-center">
							<span style={{ color: "var(--on-surface)" }}>{emotion.label}</span>
							<span style={{ color: "var(--tertiary)" }}>
								{emotion.intensity_before}%
							</span>
						</div>
					))}
				</div>
			</section>

			{/* Automatic Thought */}
			<section>
				<h2
					className="text-xs uppercase tracking-wide mb-3"
					style={{ color: "var(--tertiary)" }}
				>
					Automatic Thought
				</h2>
				<p className="text-base leading-relaxed font-serif italic" style={{ color: "var(--on-surface)" }}>
					"{record.automatic_thought}"
				</p>
			</section>

			{/* Evidence For */}
			{record.evidence_for && (
				<section>
					<h2
						className="text-xs uppercase tracking-wide mb-3"
						style={{ color: "var(--tertiary)" }}
					>
						Evidence Supporting the Thought
					</h2>
					<p className="text-base leading-relaxed" style={{ color: "var(--on-surface)" }}>
						{record.evidence_for}
					</p>
				</section>
			)}

			{/* Evidence Against */}
			{record.evidence_against && (
				<section>
					<h2
						className="text-xs uppercase tracking-wide mb-3"
						style={{ color: "var(--tertiary)" }}
					>
						Evidence Against the Thought
					</h2>
					<p className="text-base leading-relaxed" style={{ color: "var(--on-surface)" }}>
						{record.evidence_against}
					</p>
				</section>
			)}

			{/* Balanced Thought */}
			{record.balanced_thought && (
				<section>
					<h2
						className="text-xs uppercase tracking-wide mb-3"
						style={{ color: "var(--tertiary)" }}
					>
						Balanced Thought
					</h2>
					<div className="space-y-2">
						<p className="text-base leading-relaxed font-serif" style={{ color: "var(--on-surface)" }}>
							{record.balanced_thought}
						</p>
						{record.confidence_level !== null && (
							<div className="flex items-center gap-2">
								<span
									className="text-xs uppercase tracking-wide"
									style={{ color: "var(--tertiary)" }}
								>
									Confidence:
								</span>
								<span style={{ color: "var(--primary)" }}>
									{record.confidence_level}%
								</span>
							</div>
						)}
					</div>
				</section>
			)}

			{/* Outcome Emotions */}
			{record.emotions.some((e) => e.intensity_after !== null) && (
				<section>
					<h2
						className="text-xs uppercase tracking-wide mb-3"
						style={{ color: "var(--tertiary)" }}
					>
						Outcome Emotions
					</h2>
					<div className="space-y-4">
						<BeforeAfterEmotions emotions={record.emotions} />
						<div className="space-y-2 pt-4">
							{record.emotions.map((emotion) => (
								<div key={emotion.id} className="flex justify-between items-center">
									<span style={{ color: "var(--on-surface)" }}>{emotion.label}</span>
									<div className="flex gap-4">
										<span style={{ color: "var(--tertiary)" }}>
											Before: {emotion.intensity_before}%
										</span>
										{emotion.intensity_after !== null && (
											<span style={{ color: "var(--on-surface)" }}>
												After: {emotion.intensity_after}%
											</span>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Reflection */}
			{record.reflection && (
				<section>
					<h2
						className="text-xs uppercase tracking-wide mb-3"
						style={{ color: "var(--tertiary)" }}
					>
						Reflection
					</h2>
					<p className="text-base leading-relaxed italic" style={{ color: "var(--on-surface)" }}>
						{record.reflection}
					</p>
				</section>
			)}

			{/* Delete button */}
			<div className="pt-8 border-t" style={{ borderColor: "var(--surface-container-highest)" }}>
				<button
					onClick={onDelete}
					className="px-6 py-3 rounded-full text-sm uppercase tracking-wide transition-opacity hover:opacity-80"
					style={{
						backgroundColor: "var(--surface-container-highest)",
						color: "var(--tertiary)",
					}}
				>
					Delete Reflection
				</button>
			</div>
		</div>
	);
}
