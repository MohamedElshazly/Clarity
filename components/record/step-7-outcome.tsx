"use client";

import { UseFormReturn } from "react-hook-form";
import { MoodSlider } from "./mood-slider";
import { calculateEmotionShift } from "@/lib/utils/record-helpers";
import { TrendingDown, TrendingUp, Lock } from "lucide-react";
import type { RecordFormValues } from "@/lib/utils/record-helpers";
import { Textarea } from "@/components/ui/textarea";

interface StepProps {
	form: UseFormReturn<RecordFormValues>;
	formValues: Partial<RecordFormValues>;
}

export function Step7Outcome({ form, formValues }: StepProps) {
	const { register } = form;
	const shift = calculateEmotionShift(formValues);
	const isPositiveShift = shift.improvement > 0;
	const selectedEmotions = formValues.selectedEmotions || [];
	const outcomeIntensities = formValues.outcomeIntensities || {};
	const emotionIntensities = formValues.emotionIntensities || {};

	const handleIntensityChange = (emotionId: string, intensity: number) => {
		const updated = {
			...outcomeIntensities,
			[emotionId]: intensity,
		};
		form.setValue("outcomeIntensities", updated, { shouldDirty: true });
	};

	return (
		<div className="space-y-8">
			<div>
				<h1
					className="font-serif text-4xl lg:text-5xl mb-3"
					style={{ color: "var(--on-surface)" }}
				>
					How are you feeling{" "}
					<span className="font-normal italic">now</span>?
				</h1>
				<p className="text-base" style={{ color: "var(--tertiary)" }}>
					After working through this record, rate your current state.
				</p>
			</div>

			{/* Dynamic Outcome Sliders - One for each selected emotion */}
			<div className="space-y-6">
				{selectedEmotions.map((emotion) => (
					<MoodSlider
						key={emotion.id}
						label={emotion.label}
						value={outcomeIntensities[emotion.id] ?? emotionIntensities[emotion.id] ?? 50}
						onChange={(value) => handleIntensityChange(emotion.id, value)}
						leftLabel="Subtle"
						rightLabel="Overwhelming"
					/>
				))}
			</div>

			{/* Shift Summary Card */}
			<div
				className="clarity-card p-6 flex items-center gap-4"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<div
					className="p-3 rounded-lg"
					style={{ backgroundColor: "var(--surface-container-highest)" }}
				>
					{isPositiveShift ? (
						<TrendingUp size={24} style={{ color: "var(--ms-primary)" }} />
					) : (
						<TrendingDown size={24} style={{ color: "var(--tertiary)" }} />
					)}
				</div>
				<div className="flex-1">
					<p className="text-sm font-medium mb-1" style={{ color: "var(--on-surface)" }}>
						{isPositiveShift
							? `Your emotional intensity decreased by ${Math.abs(shift.improvement)} points`
							: shift.improvement < 0
								? `Your emotional intensity increased by ${Math.abs(shift.improvement)} points`
								: `No change in emotional intensity`}
					</p>
					<p className="text-xs" style={{ color: "var(--tertiary)" }}>
						Initial intensity: {shift.averageInitialIntensity} → Current:{" "}
						{shift.averageOutcomeIntensity}
					</p>
				</div>
			</div>

			{/* Reflection Textarea (Optional) */}
			<div className="space-y-3">
				<label
					className="text-sm font-medium uppercase tracking-wide"
					style={{ color: "var(--tertiary)" }}
				>
					Final Reflection (Optional)
				</label>
				<Textarea
					{...register("reflection")}
					placeholder="What did you learn from this exercise? How might you handle a similar situation differently?"
					className="min-h-37.5 text-base"
					style={{
						backgroundColor: "var(--surface-container-high)",
						color: "var(--on-surface)",
						borderColor: "transparent",
					}}
				/>
			</div>

			{/* Privacy Note */}
			<div className="flex items-center gap-2">
				<Lock size={14} style={{ color: "var(--tertiary)" }} />
				<p className="text-xs italic" style={{ color: "var(--tertiary)" }}>
					This record will be saved to your private history.
				</p>
			</div>
		</div>
	);
}
