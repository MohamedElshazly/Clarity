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

export function Step5EvidenceAgainst({ form, formValues }: StepProps) {
	const { register, formState } = form;

	return (
		<div className="space-y-6">
			<div>
				<div className="flex items-start justify-between gap-2 mb-3">
					<h1
						className="font-serif text-4xl lg:text-5xl"
						style={{ color: "var(--on-surface)" }}
					>
						Evidence <span className="font-normal">AGAINST.</span>
					</h1>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger className="mt-2 shrink-0">
								<HelpCircle size={16} style={{ color: "var(--tertiary)" }} />
							</TooltipTrigger>
							<TooltipContent side="bottom" className="max-w-72 space-y-2">
								<p>Challenge your automatic thought with facts and alternative perspectives. What would you tell a friend who had this thought?</p>
								<p className="opacity-70">Clinical: cognitive restructuring core step — identifying disconfirming evidence weakens the automatic thought and opens space for a more balanced conclusion.</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
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
				<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
					<MicButton
						fieldValue={form.getValues("evidenceAgainst") ?? ""}
						onTranscript={(text) => form.setValue("evidenceAgainst", text)}
					/>
				</div>

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
