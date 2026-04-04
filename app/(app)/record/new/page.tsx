"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/hooks/use-user";
import {
	useCreateDraft,
	useUpdateDraft,
	useSubmitRecord,
	useGetActiveDraft,
	useDiscardDraft,
} from "@/hooks/use-records";
import {
	formSchema,
	recordFormDefaultValues,
	validateCurrentStep,
	transformFormToRecord,
} from "@/lib/utils/record-helpers";
import type { RecordFormValues } from "@/lib/utils/record-helpers";
import { Progress } from "@/components/ui/progress";
import { Step1Situation } from "@/components/record/step-1-situation";
import { Step2Emotions } from "@/components/record/step-2-emotions";
import { Step3AutomaticThoughts } from "@/components/record/step-3-automatic-thoughts";
import { Step4EvidenceFor } from "@/components/record/step-4-evidence-for";
import { Step5EvidenceAgainst } from "@/components/record/step-5-evidence-against";
import { Step6BalancedThought } from "@/components/record/step-6-balanced-thought";
import { Step7Outcome } from "@/components/record/step-7-outcome";
import { FormNavigation } from "@/components/record/form-navigation";
import { ResumeBanner } from "@/components/record/resume-banner";

export default function NewRecordPage() {
	const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
	const [draftId, setDraftId] = useState<string | null>(null);
	const [isAutoSaving, setIsAutoSaving] = useState(false);
	const [resumeState, setResumeState] = useState<
		"checking" | "found" | "dismissed" | null
	>(null);

	const { data: user } = useUser();
	const router = useRouter();

	// Initialize react-hook-form
	const form = useForm<RecordFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: recordFormDefaultValues,
		mode: "onChange", // Validate on change for better UX
	});

	const createDraft = useCreateDraft();
	const updateDraft = useUpdateDraft();
	const submitRecord = useSubmitRecord();
	const { data: activeDraft, isPending: isDraftLoading } = useGetActiveDraft();
	const discardDraft = useDiscardDraft();

	// Watch form values for auto-save (more efficient than form.watch())
	const formValues = useWatch({ control: form.control }) as Partial<RecordFormValues>;

	// Resume draft effect
	useEffect(() => {
		if (isDraftLoading) return;
		if (activeDraft) {
			setResumeState("found");
		} else {
			setResumeState("dismissed");
		}
	}, [isDraftLoading, activeDraft]);

	// Handle resume
	const handleResume = () => {
		if (!activeDraft) return;

		// Restore draftId
		setDraftId(activeDraft.id);

		// Restore currentStep from metadata
		const savedStep = (activeDraft.metadata as any)?.currentStep;
		if (savedStep && savedStep >= 1 && savedStep <= 7) {
			setCurrentStep(savedStep);
		}

		// Restore form values from the draft row
		const emotions = (activeDraft.emotions as any[]) ?? [];
		form.reset({
			situation: activeDraft.situation ?? "",
			selectedEmotions: emotions.map((e) => ({ id: e.id, label: e.label })),
			emotionIntensities: Object.fromEntries(
				emotions.map((e) => [e.id, e.intensity_before ?? 50])
			),
			automaticThought: activeDraft.automatic_thought ?? "",
			distortionSlugs: activeDraft.distortion_slugs ?? [],
			evidenceFor: activeDraft.evidence_for ?? "",
			evidenceAgainst: activeDraft.evidence_against ?? "",
			balancedThought: activeDraft.balanced_thought ?? "",
			confidenceLevel: activeDraft.confidence_level ?? 0,
			outcomeIntensities: Object.fromEntries(
				emotions.map((e) => [e.id, e.intensity_after ?? 50])
			),
			reflection: activeDraft.reflection ?? "",
		});

		setResumeState("dismissed");
	};

	// Handle discard
	const handleDiscard = async () => {
		if (activeDraft?.id) {
			await discardDraft.mutateAsync(activeDraft.id);
		}
		setDraftId(null);
		form.reset(recordFormDefaultValues);
		setCurrentStep(1);
		setResumeState("dismissed");
	};

	// Auto-save logic
	useEffect(() => {
		// Start saving as soon as user has typed a few characters in situation
		if (!formValues?.situation || formValues.situation.trim().length < 3)
			return;
		if (!user?.id) return;

		// Debounce 2 seconds
		const timeoutId = setTimeout(async () => {
			setIsAutoSaving(true);

			try {
				const recordData = transformFormToRecord(formValues as RecordFormValues, currentStep);

				if (draftId) {
					// Update existing draft
					await updateDraft.mutateAsync({
						id: draftId,
						data: recordData,
					});
				} else {
					// Create new draft
					const draft = await createDraft.mutateAsync({
						userId: user.id,
						data: recordData,
					});
					setDraftId(draft.id);
				}
			} catch (error) {
				console.error("Auto-save failed:", error);
			} finally {
				setIsAutoSaving(false);
			}
		}, 2000);

		return () => clearTimeout(timeoutId);
	}, [
		currentStep,
		formValues?.situation,
		formValues?.automaticThought,
		formValues?.distortionSlugs,
		formValues?.evidenceFor,
		formValues?.evidenceAgainst,
		formValues?.balancedThought,
		formValues?.confidenceLevel,
		draftId,
		user?.id,
	]);

	// Submit handler
	const handleSubmit = form.handleSubmit(async (data: RecordFormValues) => {
		if (!user?.id) return;

		try {
			// Generate title from first 6 words of situation
			const words = data.situation.trim().split(/\s+/).slice(0, 6);
			const title = words.join(" ") + "...";

			const recordData = {
				...transformFormToRecord(data),
				title,
			};

			await submitRecord.mutateAsync({
				userId: user.id,
				recordId: draftId,
				data: recordData as any, // Type assertion needed due to title being added
			});

			// Redirect to records page
			router.push("/records");
		} catch (error) {
			console.error("Submit failed:", error);
			// TODO: Show error toast
		}
	});

	// Navigation helpers
	const canGoNext = validateCurrentStep(currentStep, formValues);
	const handleNext = () => {
		if (canGoNext)
			setCurrentStep((prev) => Math.min(7, prev + 1) as typeof currentStep);
	};
	const handleBack = () => {
		setCurrentStep((prev) => Math.max(1, prev - 1) as typeof currentStep);
	};

	// Render step component based on currentStep (O(1) lookup)
	const stepProps = { form, formValues };
	const steps = [
		<Step1Situation {...stepProps} />,
		<Step2Emotions {...stepProps} />,
		<Step3AutomaticThoughts {...stepProps} />,
		<Step4EvidenceFor {...stepProps} />,
		<Step5EvidenceAgainst {...stepProps} />,
		<Step6BalancedThought {...stepProps} />,
		<Step7Outcome {...stepProps} />,
	];

	return (
		<main className="max-w-3xl mx-auto px-6 py-12">
			{/* Resume banner or loading state */}
			{(resumeState === "checking" || resumeState === null) && (
				<div
					style={{
						backgroundColor: "var(--surface-container-high)",
						height: "52px",
						borderRadius: "8px",
						marginBottom: "2rem",
					}}
					className="animate-pulse"
				/>
			)}
			{resumeState === "found" && activeDraft && (
				<ResumeBanner
					draft={activeDraft}
					onResume={handleResume}
					onDiscard={handleDiscard}
					isDiscarding={discardDraft.isPending}
				/>
			)}

			<Progress
				value={(currentStep / 7) * 100}
				className="mb-8"
				style={{
					backgroundColor: "var(--surface-container-highest)",
				}}
			/>

			<div className="mb-4 flex justify-between items-center">
				<span
					className="text-xs uppercase tracking-wide"
					style={{ color: "var(--tertiary)" }}
				>
					Step {currentStep} of 7
				</span>
				{isAutoSaving && (
					<span className="text-xs italic" style={{ color: "var(--tertiary)" }}>
						Saving draft...
					</span>
				)}
			</div>

			{steps[currentStep - 1]}

			<FormNavigation
				currentStep={currentStep}
				canGoNext={canGoNext}
				onNext={handleNext}
				onBack={handleBack}
				onSubmit={handleSubmit}
				isSubmitting={submitRecord.isPending}
			/>
		</main>
	);
}
