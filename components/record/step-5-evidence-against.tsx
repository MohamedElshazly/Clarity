"use client";

import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
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
			</div>

			{/* Main Evidence Card */}
			<div
				className="clarity-card p-6 space-y-4"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<div>
					<h3
						className="text-lg font-medium mb-2"
						style={{ color: "var(--on-surface)" }}
					>
						What facts challenge this thought?
					</h3>
					<p className="text-sm italic" style={{ color: "var(--tertiary)" }}>
						What would you say to a close friend thinking this way?
					</p>
				</div>

				<Textarea
					{...register("evidenceAgainst")}
					placeholder="Write your counter-evidence here..."
					className="min-h-50 text-base"
					style={{
						backgroundColor: "var(--surface-container)",
						color: "var(--on-surface)",
						borderColor: "transparent",
					}}
				/>

				{formState.errors.evidenceAgainst && (
					<p className="text-sm" style={{ color: "var(--error, #ff5449)" }}>
						{formState.errors.evidenceAgainst.message}
					</p>
				)}

				<div className="flex items-center gap-2">
					<Info
						size={16}
						style={{ color: "var(--tertiary)", marginTop: 2 }}
					/>
					<p className="text-xs" style={{ color: "var(--tertiary)" }}>
						Focus on objective facts and alternative perspectives, not just
						positive thinking or wishful statements.
					</p>
				</div>
			</div>
		</div>
	);
}
