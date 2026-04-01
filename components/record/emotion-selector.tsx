"use client";

import { UseFormReturn } from "react-hook-form";
import { emotions } from "@/lib/data/emotions";
import * as LucideIcons from "lucide-react";
import { MoodSlider } from "./mood-slider";
import type { RecordFormValues } from "@/lib/utils/record-helpers";

interface EmotionSelectorProps {
	form: UseFormReturn<RecordFormValues>;
	formValues: Partial<RecordFormValues>;
}

export function EmotionSelector({ form, formValues }: EmotionSelectorProps) {
	const selectedEmotions = formValues.selectedEmotions || [];
	const intensities = formValues.emotionIntensities || {};

	const handleEmotionToggle = (emotion: { id: string; label: string }) => {
		const current = selectedEmotions;
		const isSelected = current.some((e) => e.id === emotion.id);

		if (isSelected) {
			form.setValue(
				"selectedEmotions",
				current.filter((e) => e.id !== emotion.id)
			);
		} else {
			form.setValue("selectedEmotions", [...current, emotion]);
			// Set default intensity for newly selected emotion
			form.setValue(`emotionIntensities.${emotion.id}`, 50);
		}
	};

	const handleIntensityChange = (emotionId: string, intensity: number) => {
		form.setValue(`emotionIntensities.${emotionId}`, intensity);
	};

	return (
		<div className="space-y-8">
			{/* Emotion Grid - 2x4 layout */}
			<div className="grid grid-cols-2 gap-3">
				{emotions.map((emotion) => {
					const isSelected = selectedEmotions.some((e) => e.id === emotion.id);
					const IconComponent = (LucideIcons[
						emotion.icon as keyof typeof LucideIcons
					] || LucideIcons.Circle) as React.ComponentType<{
						size?: number;
						style?: React.CSSProperties;
					}>;

					return (
						<button
							key={emotion.id}
							type="button"
							onClick={() => handleEmotionToggle(emotion)}
							className="clarity-card p-4 flex items-center gap-3 transition-all cursor-pointer"
							style={{
								backgroundColor: isSelected
									? "var(--surface-container-highest)"
									: "var(--surface-container-high)",
								...(isSelected && {
									outline: "1px solid var(--ms-primary)",
									outlineOffset: "-1px",
								}),
							}}
						>
							<IconComponent
								size={20}
								style={{
									color: isSelected
										? "var(--ms-primary)"
										: "var(--tertiary)",
								}}
							/>
							<span
								className="text-sm font-medium"
								style={{
									color: isSelected
										? "var(--on-surface)"
										: "var(--on-surface)",
								}}
							>
								{emotion.label}
							</span>
						</button>
					);
				})}
			</div>

			{/* Intensity Sliders - Only show for selected emotions */}
			{selectedEmotions.length > 0 && (
				<div className="space-y-6 pt-4">
					<p
						className="text-sm font-medium"
						style={{ color: "var(--tertiary)" }}
					>
						Rate the intensity of each emotion (before reflection):
					</p>
					{selectedEmotions.map((emotion) => (
						<MoodSlider
							key={emotion.id}
							label={`${emotion.label} Intensity`}
							value={intensities[emotion.id] || 50}
							onChange={(value) => handleIntensityChange(emotion.id, value)}
							leftLabel="Subtle"
							rightLabel="Overwhelming"
						/>
					))}
				</div>
			)}
		</div>
	);
}
