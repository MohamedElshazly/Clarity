"use client";

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
						{value}/100
					</span>
				)}
			</div>

			<Slider
				id={sliderId}
				value={[value]}
				onValueChange={(val) => {
					const newValue = Array.isArray(val) ? val[0] : val;
					onChange(newValue);
				}}
				min={0}
				max={100}
				step={1}
				className="w-full"
				aria-label={`${label}: ${value} out of 100`}
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
