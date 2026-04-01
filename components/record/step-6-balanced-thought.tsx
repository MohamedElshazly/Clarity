"use client";

import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { MoodSlider } from "./mood-slider";
import type { RecordFormValues } from "@/lib/utils/record-helpers";

interface StepProps {
	form: UseFormReturn<RecordFormValues>;
	formValues: Partial<RecordFormValues>;
}

export function Step6BalancedThought({ form, formValues }: StepProps) {
	const { register, formState } = form;

	return (
		<div className="space-y-6">
			<div>
				<h1
					className="font-serif text-3xl lg:text-4xl mb-3 leading-snug"
					style={{ color: "var(--on-surface)" }}
				>
					Given all the evidence, what's a{" "}
					<span className="italic" style={{ color: "var(--ms-primary)" }}>
						more realistic
					</span>{" "}
					and helpful way to see this situation?
				</h1>
			</div>

			{/* Card 1: Balanced Perspective */}
			<div
				className="clarity-card p-6 space-y-3"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<div className="flex justify-between items-center">
					<label
						className="text-sm font-medium uppercase tracking-wide"
						style={{ color: "var(--tertiary)" }}
					>
						Your Balanced Perspective
					</label>
					<span
						className="text-xs font-mono"
						style={{ color: "var(--tertiary)" }}
					>
						Character count: {formValues.balancedThought?.length || 0}
					</span>
				</div>

				<Textarea
					{...register("balancedThought")}
					placeholder="Start writing your reflection here..."
					className="min-h-50 text-base"
					style={{
						backgroundColor: "var(--surface-container)",
						color: "var(--on-surface)",
						borderColor: "transparent",
					}}
				/>

				{formState.errors.balancedThought && (
					<p className="text-sm" style={{ color: "var(--error, #ff5449)" }}>
						{formState.errors.balancedThought.message}
					</p>
				)}
			</div>

			{/* Card 2: Confidence Level */}
			<div
				className="clarity-card p-6 space-y-4"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<div className="flex justify-between items-center">
					<label
						className="text-sm font-medium uppercase tracking-wide"
						style={{ color: "var(--tertiary)" }}
					>
						Confidence Level
					</label>
					<span
						className="text-sm font-mono"
						style={{ color: "var(--ms-primary)" }}
					>
						{formValues.confidenceLevel || 0}%
					</span>
				</div>

				<p className="text-sm" style={{ color: "var(--tertiary)" }}>
					How strongly do you believe this new thought?
				</p>

				<MoodSlider
					label=""
					value={formValues.confidenceLevel || 0}
					onChange={(value) => form.setValue("confidenceLevel", value)}
					showValue={false}
					leftLabel="UNCERTAIN"
					rightLabel="ABSOLUTE CERTAINTY"
				/>
			</div>
		</div>
	);
}
