"use client";

import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Info, HelpCircle } from "lucide-react";
import type { RecordFormValues } from "@/lib/utils/record-helpers";
import { MicButton } from "@/components/shared/mic-button";
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

export function Step1Situation({ form, formValues }: StepProps) {
	const { register, formState } = form;

	return (
		<div className="space-y-6">
			<div>
				<div className="flex items-start justify-between gap-2 mb-3">
					<h1
						className="font-serif text-4xl lg:text-5xl"
						style={{ color: "var(--on-surface)" }}
					>
						What happened?
					</h1>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger className="mt-2 shrink-0">
								<HelpCircle size={16} style={{ color: "var(--tertiary)" }} />
							</TooltipTrigger>
							<TooltipContent side="bottom" className="max-w-72 space-y-2">
								<p>Describe the time, place, and what actually happened — facts only, no feelings yet.</p>
								<p className="opacity-70">Clinical: the Activating Event (A) in CBT's ABC model — the observable trigger that initiates the cognitive-emotional sequence.</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
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
				<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
					<MicButton
						fieldValue={form.getValues("situation") ?? ""}
						onTranscript={(text) => form.setValue("situation", text)}
					/>
				</div>
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
