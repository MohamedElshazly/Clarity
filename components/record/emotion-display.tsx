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
	// Show primary emotion (first one) for before/after comparison
	const primaryEmotion = emotions[0];

	if (!primaryEmotion) return null;

	return (
		<div className="flex items-center gap-6">
			<EmotionDisplay emotion={primaryEmotion} type="before" />
			<span style={{ color: "var(--tertiary)" }}>→</span>
			<EmotionDisplay emotion={primaryEmotion} type="after" />
		</div>
	);
}
