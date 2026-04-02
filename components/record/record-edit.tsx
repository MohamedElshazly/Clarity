"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ThoughtRecord } from "@/lib/types/database";
import { useUpdateRecord } from "@/hooks/use-records";
import {
	formSchema,
	recordFormDefaultValues,
	transformFormToRecord,
	type RecordFormValues,
} from "@/lib/utils/record-helpers";
import { Step1Situation } from "./step-1-situation";
import { Step2Emotions } from "./step-2-emotions";
import { Step3AutomaticThoughts } from "./step-3-automatic-thoughts";
import { Step4EvidenceFor } from "./step-4-evidence-for";
import { Step5EvidenceAgainst } from "./step-5-evidence-against";
import { Step6BalancedThought } from "./step-6-balanced-thought";
import { Step7Outcome } from "./step-7-outcome";
import { Button } from "@/components/ui/button";

interface RecordEditProps {
	record: ThoughtRecord;
	onSuccess?: () => void;
}

// Transform database record to form format
function transformRecordToForm(record: ThoughtRecord): RecordFormValues {
	// Convert emotions to form format
	const selectedEmotions = record.emotions.map((e) => ({
		id: e.id,
		label: e.label,
	}));

	const emotionIntensities: Record<string, number> = {};
	const outcomeIntensities: Record<string, number> = {};

	record.emotions.forEach((e) => {
		emotionIntensities[e.id] = e.intensity_before;
		if (e.intensity_after !== null && e.intensity_after !== undefined) {
			outcomeIntensities[e.id] = e.intensity_after;
		}
	});

	return {
		situation: record.situation || "",
		selectedEmotions,
		emotionIntensities,
		automaticThought: record.automatic_thought || "",
		distortionSlugs: record.distortion_slugs || [],
		evidenceFor: record.evidence_for || "",
		evidenceAgainst: record.evidence_against || "",
		balancedThought: record.balanced_thought || "",
		confidenceLevel: record.confidence_level || 0,
		outcomeIntensities,
		reflection: record.reflection || "",
	};
}

export function RecordEdit({ record, onSuccess }: RecordEditProps) {
	const router = useRouter();
	const updateRecord = useUpdateRecord();

	// Initialize react-hook-form with existing record data
	const form = useForm<RecordFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: recordFormDefaultValues,
		mode: "onChange",
	});

	// Load record data into form
	useEffect(() => {
		const formData = transformRecordToForm(record);
		form.reset(formData);
	}, [record, form]);

	// Watch form values for step components
	const formValues = form.watch();

	// Submit handler
	const handleSubmit = form.handleSubmit(async (data: RecordFormValues) => {
		try {
			// Generate title from first 6 words of situation if not already set
			const title =
				record.title ||
				data.situation.trim().split(/\s+/).slice(0, 6).join(" ") + "...";

			const recordData = {
				...transformFormToRecord(data),
				title,
			};

			await updateRecord.mutateAsync({
				id: record.id,
				data: recordData,
			});

			// Call onSuccess callback or refresh
			if (onSuccess) {
				onSuccess();
			} else {
				router.refresh();
			}
		} catch (error) {
			console.error("Update failed:", error);
		}
	});

	const stepProps = { form, formValues };

	return (
		<form onSubmit={handleSubmit} className="space-y-12">
			{/* All steps visible in single page */}
			<div
				className="p-6 rounded-lg space-y-6"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<h3
					className="text-xs uppercase tracking-wide"
					style={{ color: "var(--tertiary)" }}
				>
					Step 1: Situation
				</h3>
				<Step1Situation {...stepProps} />
			</div>

			<div
				className="p-6 rounded-lg space-y-6"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<h3
					className="text-xs uppercase tracking-wide"
					style={{ color: "var(--tertiary)" }}
				>
					Step 2: Emotions
				</h3>
				<Step2Emotions {...stepProps} />
			</div>

			<div
				className="p-6 rounded-lg space-y-6"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<h3
					className="text-xs uppercase tracking-wide"
					style={{ color: "var(--tertiary)" }}
				>
					Step 3: Automatic Thoughts
				</h3>
				<Step3AutomaticThoughts {...stepProps} />
			</div>

			<div
				className="p-6 rounded-lg space-y-6"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<h3
					className="text-xs uppercase tracking-wide"
					style={{ color: "var(--tertiary)" }}
				>
					Step 4: Evidence For
				</h3>
				<Step4EvidenceFor {...stepProps} />
			</div>

			<div
				className="p-6 rounded-lg space-y-6"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<h3
					className="text-xs uppercase tracking-wide"
					style={{ color: "var(--tertiary)" }}
				>
					Step 5: Evidence Against
				</h3>
				<Step5EvidenceAgainst {...stepProps} />
			</div>

			<div
				className="p-6 rounded-lg space-y-6"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<h3
					className="text-xs uppercase tracking-wide"
					style={{ color: "var(--tertiary)" }}
				>
					Step 6: Balanced Thought
				</h3>
				<Step6BalancedThought {...stepProps} />
			</div>

			<div
				className="p-6 rounded-lg space-y-6"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<h3
					className="text-xs uppercase tracking-wide"
					style={{ color: "var(--tertiary)" }}
				>
					Step 7: Outcome
				</h3>
				<Step7Outcome {...stepProps} />
			</div>

			{/* Save button */}
			<div className="flex gap-4">
				<Button
					type="submit"
					disabled={updateRecord.isPending}
					className="px-8 py-3 rounded-full text-sm uppercase tracking-wide"
					style={{
						backgroundColor: "var(--primary-container)",
						color: "var(--on-primary-container)",
					}}
				>
					{updateRecord.isPending ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</form>
	);
}
