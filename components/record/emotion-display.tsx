"use client";

import type { EmotionEntry } from "@/lib/types/database";
import { getEmotionById } from "@/lib/data/emotions";

interface EmotionDisplayProps {
	emotion: EmotionEntry;
	type: "before" | "after";
}

export function EmotionDisplay({ emotion, type }: EmotionDisplayProps) {
	const emotionData = getEmotionById(emotion.id);
	const intensity =
		type === "before" ? emotion.intensity_before : emotion.intensity_after;

	if (!emotionData || !intensity) return null;

	return (
		<div className="space-y-1">
			<span
				className="text-xs uppercase tracking-wide"
				style={{ color: "var(--tertiary)" }}
			>
				{type === "before" ? "Before" : "After Reflection"}
			</span>
			<div className="flex items-baseline gap-2">
				<span
					className="font-serif text-lg"
					style={{
						color: type === "before" ? "var(--primary)" : "var(--on-surface)",
					}}
				>
					{emotionData.label}
				</span>
				<span className="text-sm" style={{ color: "var(--tertiary)" }}>
					{intensity}%
				</span>
			</div>
		</div>
	);
}

interface BeforeAfterEmotionsProps {
	emotions: EmotionEntry[];
}

export function BeforeAfterEmotions({ emotions }: BeforeAfterEmotionsProps) {
	const primaryEmotion = emotions[0];

	if (!primaryEmotion) return null;

	const delta =
		primaryEmotion.intensity_after != null
			? primaryEmotion.intensity_before - primaryEmotion.intensity_after
			: 0;
	const improved = delta > 0;
	const changed = delta !== 0 && primaryEmotion.intensity_after != null;

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
			<EmotionDisplay emotion={primaryEmotion} type="before" />
			<span className="hidden sm:block" style={{ color: "var(--tertiary)" }}>
				→
			</span>
			<EmotionDisplay emotion={primaryEmotion} type="after" />
			{changed && (
				<span
					className="self-start sm:self-auto text-xs px-2 py-0.5 rounded-full sm:ml-2"
					style={{
						backgroundColor: improved
							? "var(--secondary-container)"
							: "var(--primary-container)",
						color: improved
							? "var(--on-secondary-container)"
							: "var(--on-primary-container)",
					}}
				>
					{improved ? `↓ ${delta}%` : `↑ ${Math.abs(delta)}%`}
				</span>
			)}
		</div>
	);
}
