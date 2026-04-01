"use client";

import { UseFormReturn } from "react-hook-form";
import { EmotionSelector } from "./emotion-selector";
import type { RecordFormValues } from "@/lib/utils/record-helpers";

interface StepProps {
	form: UseFormReturn<RecordFormValues>;
	formValues: Partial<RecordFormValues>;
}

export function Step2Emotions({ form, formValues }: StepProps) {
	return (
		<div className="space-y-6">
			<div>
				<h1
					className="font-serif text-4xl lg:text-5xl mb-3"
					style={{ color: "var(--on-surface)" }}
				>
					Initial Feelings
				</h1>
				<p className="text-base italic" style={{ color: "var(--tertiary)" }}>
					How did this make you feel? Select all that apply and rate the
					intensity of each emotion.
				</p>
			</div>

			<EmotionSelector form={form} formValues={formValues} />
		</div>
	);
}
