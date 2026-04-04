"use client";

import { UseFormReturn } from "react-hook-form";
import { MoodSlider } from "./mood-slider";
import { calculateEmotionShift } from "@/lib/utils/record-helpers";
import { TrendingDown, TrendingUp, Lock, HelpCircle } from "lucide-react";
import type { RecordFormValues } from "@/lib/utils/record-helpers";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider,
} from "@/components/ui/tooltip";

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
				<div className="flex items-start justify-between gap-2 mb-3">
					<h1
						className="font-serif text-4xl lg:text-5xl"
						style={{ color: "var(--on-surface)" }}
					>
						How are you feeling{" "}
						<span className="font-normal italic">now</span>?
					</h1>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger className="mt-2 shrink-0">
								<HelpCircle size={16} style={{ color: "var(--tertiary)" }} />
							</TooltipTrigger>
							<TooltipContent side="bottom" className="max-w-72 space-y-2">
								<p>Re-rate each emotion to measure the impact of restructuring your thought. Even small improvements are meaningful.</p>
								<p className="opacity-70">Clinical: the outcome measures post-intervention emotional intensity — tracking change validates that cognitive restructuring reduces distress.</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
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
				className="clarity-card p-5 space-y-4"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				{/* Header */}
				<div className="flex items-center gap-3">
					<div
						className="p-2 rounded-lg"
						style={{ backgroundColor: "var(--surface-container-highest)" }}
					>
						{isPositiveShift ? (
							<TrendingUp size={18} style={{ color: "var(--ms-primary)" }} />
						) : (
							<TrendingDown size={18} style={{ color: "var(--tertiary)" }} />
						)}
					</div>
					<p className="text-sm font-medium" style={{ color: "var(--on-surface)" }}>
						Emotional shift
					</p>
				</div>

				{/* Per-emotion rows */}
				<div className="space-y-2">
					{selectedEmotions.map((emotion) => {
						const before = emotionIntensities[emotion.id] ?? 50;
						const after = outcomeIntensities[emotion.id] ?? before;
						const delta = after - before;
						const isImproved = delta < 0;
						return (
							<div key={emotion.id} className="flex items-center justify-between text-sm">
								<span style={{ color: "var(--on-surface)" }}>{emotion.label}</span>
								<span className="font-mono text-xs flex items-center gap-2">
									<span style={{ color: "var(--tertiary)" }}>
										{before} → {after}
									</span>
									{delta !== 0 && (
										<span
											style={{
												color: isImproved ? "var(--ms-primary)" : "var(--tertiary)",
											}}
										>
											{isImproved ? "▼" : "▲"} {Math.abs(delta)}
										</span>
									)}
								</span>
							</div>
						);
					})}
				</div>

				{/* Overall average row */}
				{selectedEmotions.length > 1 && (
					<>
						<div
							className="border-t pt-3"
							style={{ borderColor: "var(--surface-container-highest)" }}
						>
							<div className="flex items-center justify-between text-xs">
								<span style={{ color: "var(--tertiary)" }}>Average</span>
								<span className="font-mono flex items-center gap-2">
									<span style={{ color: "var(--tertiary)" }}>
										{shift.averageInitialIntensity} → {shift.averageOutcomeIntensity}
									</span>
									{shift.improvement !== 0 && (
										<span
											style={{
												color:
													shift.improvement > 0 ? "var(--ms-primary)" : "var(--tertiary)",
											}}
										>
											{shift.improvement > 0 ? "▼" : "▲"}{" "}
											{Math.abs(shift.improvement)} pts overall
										</span>
									)}
								</span>
							</div>
						</div>
					</>
				)}
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
