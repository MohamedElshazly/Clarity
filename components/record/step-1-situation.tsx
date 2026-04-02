"use client";

import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import type { RecordFormValues } from "@/lib/utils/record-helpers";

interface StepProps {
	form: UseFormReturn<RecordFormValues>;
	formValues: Partial<RecordFormValues>;
}

export function Step1Situation({ form, formValues }: StepProps) {
	const { register, formState } = form;

	return (
		<div className="space-y-6">
			<div>
				<h1
					className="font-serif text-4xl lg:text-5xl mb-3"
					style={{ color: "var(--on-surface)" }}
				>
					What happened?
				</h1>
				<p className="text-base" style={{ color: "var(--tertiary)" }}>
					Describe the situation briefly — where you were, what was going on.
				</p>
			</div>

			<div>
				<label htmlFor="situation-input" className="sr-only">
					Describe the situation
				</label>
				<Textarea
					{...register("situation")}
					id="situation-input"
					placeholder="I was in the coffee shop when..."
					className="min-h-75 text-base"
					style={{
						backgroundColor: "var(--surface-container-high)",
						color: "var(--on-surface)",
						borderColor: "transparent",
					}}
					aria-invalid={!!formState.errors.situation}
					aria-describedby={
						formState.errors.situation ? "situation-error" : undefined
					}
				/>
			</div>

			{formState.errors.situation && (
				<p
					id="situation-error"
					className="text-sm"
					style={{ color: "var(--error, #ff5449)" }}
					role="alert"
				>
					{formState.errors.situation.message}
				</p>
			)}

			<div className="flex items-start gap-2">
				<Info size={16} style={{ color: "var(--tertiary)", marginTop: 2 }} />
				<p className="text-sm italic" style={{ color: "var(--tertiary)" }}>
					Don't overthink. Just flow. Be specific about when and where this
					happened.
				</p>
			</div>
		</div>
	);
}
