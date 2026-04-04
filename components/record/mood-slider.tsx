"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface MoodSliderProps {
	label: string;
	value: number;
	onChange: (value: number) => void;
	showValue?: boolean;
	leftLabel?: string;
	rightLabel?: string;
}

export function MoodSlider({
	label,
	value,
	onChange,
	showValue = true,
	leftLabel = "Low",
	rightLabel = "High",
}: MoodSliderProps) {
	const sliderId = `slider-${label.toLowerCase().replace(/\s+/g, "-")}`;
	const [localValue, setLocalValue] = useState(value);

	// Sync local state when the external value changes (e.g. draft resume, step navigation)
	// but only when not actively dragging — use a ref to track that
	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<label
					htmlFor={sliderId}
					className="text-sm font-medium"
					style={{ color: "var(--on-surface)" }}
				>
					{label}
				</label>
				{showValue && (
					<span
						className="text-sm font-mono"
						style={{ color: "var(--ms-primary)" }}
						aria-live="polite"
					>
						{localValue}/100
					</span>
				)}
			</div>

			<Slider
				id={sliderId}
				value={[localValue]}
				onValueChange={(val) => {
					// Update display immediately during drag without touching the form
					setLocalValue(Array.isArray(val) ? val[0] : val);
				}}
				onValueCommit={(val) => {
					// Commit to form only when the user releases the pointer
					const committed = Array.isArray(val) ? val[0] : val;
					setLocalValue(committed);
					onChange(committed);
				}}
				min={0}
				max={100}
				step={1}
				className="w-full"
				aria-label={`${label}: ${localValue} out of 100`}
			/>

			<div
				className="flex justify-between text-xs"
				style={{ color: "var(--tertiary)" }}
			>
				<span>{leftLabel}</span>
				<span>{rightLabel}</span>
			</div>
		</div>
	);
}
