"use client";

import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { MoodSlider } from "./mood-slider";
import type { RecordFormValues } from "@/lib/utils/record-helpers";
import { MicButton } from "@/components/shared/mic-button";
import { HelpCircle } from "lucide-react";
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

export function Step6BalancedThought({ form, formValues }: StepProps) {
	const { register, formState } = form;

	return (
		<div className="space-y-6">
			<div>
				<div className="flex items-start justify-between gap-2">
					<h1
						className="font-serif text-3xl lg:text-4xl leading-snug"
						style={{ color: "var(--on-surface)" }}
					>
						Given all the evidence, what's a{" "}
						<span className="italic" style={{ color: "var(--ms-primary)" }}>
							more realistic
						</span>{" "}
						and helpful way to see this situation?
					</h1>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger className="mt-2 shrink-0">
								<HelpCircle size={16} style={{ color: "var(--tertiary)" }} />
							</TooltipTrigger>
							<TooltipContent side="bottom" className="max-w-72 space-y-2">
								<p>Synthesize the evidence into a new thought that's both realistic and compassionate. This isn't forced positivity — it's a fair conclusion.</p>
								<p className="opacity-70">Clinical: the restructured cognition (new B in ABC) — a rational response that integrates evidence and softens cognitive distortions, reducing emotional distress.</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
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
				<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
					<MicButton
						fieldValue={form.getValues("balancedThought") ?? ""}
						onTranscript={(text) => form.setValue("balancedThought", text)}
					/>
				</div>

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
