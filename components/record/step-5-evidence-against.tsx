"use client";

import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import type { RecordFormValues } from "@/lib/utils/record-helpers";

interface StepProps {
	form: UseFormReturn<RecordFormValues>;
	formValues: Partial<RecordFormValues>;
}

export function Step5EvidenceAgainst({ form, formValues }: StepProps) {
	const { register, formState } = form;

	return (
		<div className="space-y-6">
			<div>
				<h1
					className="font-serif text-4xl lg:text-5xl mb-3"
					style={{ color: "var(--on-surface)" }}
				>
					Evidence <span className="font-normal">AGAINST.</span>
				</h1>
				<p className="text-base" style={{ color: "var(--tertiary)" }}>
					What facts challenge this thought? What would you say to a close
					friend thinking this way?
				</p>
			</div>

			<Textarea
				{...register("evidenceAgainst")}
				placeholder="Write your counter-evidence here..."
				className="min-h-75 text-base"
				style={{
					backgroundColor: "transparent",
					color: "var(--on-surface)",
					borderColor: "transparent",
					borderBottom: "1px solid var(--outline-variant)",
					borderRadius: 0,
				}}
			/>

			{formState.errors.evidenceAgainst && (
				<p className="text-sm" style={{ color: "var(--error, #ff5449)" }}>
					{formState.errors.evidenceAgainst.message}
				</p>
			)}
		</div>
	);
}
