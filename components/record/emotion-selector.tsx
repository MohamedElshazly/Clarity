"use client";

import { useState, useRef, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { emotions } from "@/lib/data/emotions";
import * as LucideIcons from "lucide-react";
import { MoodSlider } from "./mood-slider";
import type { RecordFormValues } from "@/lib/utils/record-helpers";

interface EmotionSelectorProps {
	form: UseFormReturn<RecordFormValues>;
	formValues: Partial<RecordFormValues>;
}

const PREDEFINED_IDS = new Set(emotions.map((e) => e.id));

export function EmotionSelector({ form, formValues }: EmotionSelectorProps) {
	const selectedEmotions = formValues.selectedEmotions || [];
	const intensities = formValues.emotionIntensities || {};

	const [customInput, setCustomInput] = useState("");
	const [showCustomInput, setShowCustomInput] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (showCustomInput) inputRef.current?.focus();
	}, [showCustomInput]);

	// Custom emotions are selectedEmotions not in the predefined list
	const customEmotions = selectedEmotions
		.filter((e) => !PREDEFINED_IDS.has(e.id))
		.map((e) => ({ id: e.id, label: e.label, icon: "Meh" as const }));

	const allEmotions = [...emotions, ...customEmotions];

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
			form.setValue(`emotionIntensities.${emotion.id}`, 50);
		}
	};

	const handleIntensityChange = (emotionId: string, intensity: number) => {
		form.setValue(`emotionIntensities.${emotionId}`, intensity);
	};

	const handleAddCustomEmotion = () => {
		const trimmed = customInput.trim();
		if (!trimmed) return;

		// Avoid duplicates (case-insensitive)
		const alreadyExists = selectedEmotions.some(
			(e) => e.label.toLowerCase() === trimmed.toLowerCase()
		);
		if (alreadyExists) {
			setCustomInput("");
			setShowCustomInput(false);
			return;
		}

		const id = `custom-${trimmed.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
		form.setValue("selectedEmotions", [
			...selectedEmotions,
			{ id, label: trimmed },
		]);
		form.setValue(`emotionIntensities.${id}`, 50);
		setCustomInput("");
		setShowCustomInput(false);
	};

	const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddCustomEmotion();
		} else if (e.key === "Escape") {
			setCustomInput("");
			setShowCustomInput(false);
		}
	};

	return (
		<div className="space-y-8">
			{/* Emotion Grid */}
			<div className="grid grid-cols-2 gap-3">
				{allEmotions.map((emotion) => {
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
							aria-pressed={isSelected}
							aria-label={`${emotion.label} emotion ${isSelected ? "selected" : "not selected"}`}
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
									color: isSelected ? "var(--ms-primary)" : "var(--tertiary)",
								}}
							/>
							<span
								className="text-sm font-medium"
								style={{ color: "var(--on-surface)" }}
							>
								{emotion.label}
							</span>
						</button>
					);
				})}

				{/* Add custom emotion cell */}
				{showCustomInput ? (
					<div
						className="clarity-card p-4 flex items-center gap-2 col-span-2"
						style={{ backgroundColor: "var(--surface-container-high)" }}
					>
						<LucideIcons.Meh
							size={20}
							style={{ color: "var(--tertiary)", flexShrink: 0 }}
						/>
						<input
							ref={inputRef}
							type="text"
							value={customInput}
							onChange={(e) => setCustomInput(e.target.value)}
							onKeyDown={handleCustomKeyDown}
							placeholder="Name your emotion..."
							maxLength={30}
							className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-(--tertiary)"
							style={{ color: "var(--on-surface)" }}
						/>
						<button
							type="button"
							onClick={handleAddCustomEmotion}
							disabled={!customInput.trim()}
							aria-label="Add emotion"
							style={{ color: "var(--ms-primary)" }}
							className="disabled:opacity-40"
						>
							<LucideIcons.Check size={18} />
						</button>
						<button
							type="button"
							onClick={() => {
								setCustomInput("");
								setShowCustomInput(false);
							}}
							aria-label="Cancel"
							style={{ color: "var(--tertiary)" }}
						>
							<LucideIcons.X size={18} />
						</button>
					</div>
				) : (
					<button
						type="button"
						onClick={() => setShowCustomInput(true)}
						className="clarity-card p-4 flex items-center gap-3 transition-all cursor-pointer"
						style={{
							backgroundColor: "var(--surface-container-high)",
							border: "1px dashed var(--outline-variant)",
						}}
					>
						<LucideIcons.Plus
							size={20}
							style={{ color: "var(--tertiary)" }}
						/>
						<span
							className="text-sm font-medium"
							style={{ color: "var(--tertiary)" }}
						>
							Add emotion
						</span>
					</button>
				)}
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
							value={intensities[emotion.id] ?? 50}
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
