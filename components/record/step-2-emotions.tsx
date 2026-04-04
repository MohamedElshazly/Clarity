"use client";

import { UseFormReturn } from "react-hook-form";
import { EmotionSelector } from "./emotion-selector";
import type { RecordFormValues } from "@/lib/utils/record-helpers";
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

export function Step2Emotions({ form, formValues }: StepProps) {
	return (
		<div className="space-y-6">
			<div>
				<div className="flex items-start justify-between gap-2 mb-3">
					<h1
						className="font-serif text-4xl lg:text-5xl"
						style={{ color: "var(--on-surface)" }}
					>
						Initial Feelings
					</h1>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger className="mt-2 shrink-0">
								<HelpCircle size={16} style={{ color: "var(--tertiary)" }} />
							</TooltipTrigger>
							<TooltipContent side="bottom" className="max-w-72 space-y-2">
								<p>Name every feeling this situation stirred up and rate how strong each one was.</p>
								<p className="opacity-70">Clinical: captures the Consequences (C) in the ABC model — baseline emotion ratings used to measure distress and track change after restructuring.</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<p className="text-base italic" style={{ color: "var(--tertiary)" }}>
					How did this make you feel? Select all that apply and rate the
					intensity of each emotion.
				</p>
			</div>

			<EmotionSelector form={form} formValues={formValues} />
		</div>
	);
}
