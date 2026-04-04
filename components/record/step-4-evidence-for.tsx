"use client";

import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Info, Brain, Sparkles, HelpCircle } from "lucide-react";
import type { RecordFormValues } from "@/lib/utils/record-helpers";
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

export function Step4EvidenceFor({ form, formValues }: StepProps) {
	const { register, formState } = form;

	return (
		<div className="space-y-6">
			<div>
				<div className="flex items-start justify-between gap-2 mb-3">
					<h1
						className="font-serif text-4xl lg:text-5xl"
						style={{ color: "var(--on-surface)" }}
					>
						Evidence <span className="font-normal">FOR.</span>
					</h1>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger className="mt-2 shrink-0">
								<HelpCircle size={16} style={{ color: "var(--tertiary)" }} />
							</TooltipTrigger>
							<TooltipContent side="bottom" className="max-w-72 space-y-2">
								<p>List objective facts that seem to support your automatic thought. Be honest — this isn't about validating the thought, it's about seeing what your mind seized on.</p>
								<p className="opacity-70">Clinical: examining supporting evidence trains you to distinguish facts from interpretations, and prepares the ground for balanced evaluation.</p>
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
						What facts or evidence support this thought?
					</h3>
					<p className="text-sm italic" style={{ color: "var(--tertiary)" }}>
						Stick to facts, not feelings.
					</p>
				</div>

				<Textarea
					{...register("evidenceFor")}
					placeholder="Record objective observations here..."
					className="min-h-50 text-base"
					style={{
						backgroundColor: "var(--surface-container)",
						color: "var(--on-surface)",
						borderColor: "transparent",
					}}
				/>

				{formState.errors.evidenceFor && (
					<p className="text-sm" style={{ color: "var(--error, #ff5449)" }}>
						{formState.errors.evidenceFor.message}
					</p>
				)}

				<div className="flex items-center gap-2">
					<Info
						size={16}
						style={{ color: "var(--tertiary)", marginTop: 2 }}
					/>
					<p className="text-xs" style={{ color: "var(--tertiary)" }}>
						Try to stick to things you could point to or observe — rather than
						how they made you feel.
					</p>
				</div>
			</div>

			{/* Info Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div
					className="clarity-card p-4"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<div className="flex items-center gap-2 mb-2">
						<Brain size={18} style={{ color: "var(--ms-primary)" }} />
						<h4
							className="text-sm font-semibold"
							style={{ color: "var(--ms-primary)" }}
						>
							Cognitive Clarity
						</h4>
					</div>
					<p className="text-xs leading-relaxed" style={{ color: "var(--tertiary)" }}>
						CBT helps restore balance between emotional and logical thinking by
						engaging the prefrontal cortex.
					</p>
				</div>

				<div
					className="clarity-card p-4"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<Sparkles
						size={18}
						style={{ color: "var(--tertiary)", marginBottom: 8 }}
					/>
					<p
						className="text-xs italic leading-relaxed"
						style={{ color: "var(--tertiary)" }}
					>
						"Experience is not what happens to you; it's what you do with what
						happens to you."
					</p>
					<p
						className="text-xs mt-2 uppercase tracking-wide"
						style={{ color: "var(--tertiary)" }}
					>
						— Aldous Huxley
					</p>
				</div>
			</div>
		</div>
	);
}
