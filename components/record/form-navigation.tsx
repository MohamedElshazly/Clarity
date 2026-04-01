"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

interface FormNavigationProps {
	currentStep: number;
	canGoNext: boolean;
	onNext: () => void;
	onBack: () => void;
	onSubmit: () => void;
	isSubmitting?: boolean;
}

export function FormNavigation({
	currentStep,
	canGoNext,
	onNext,
	onBack,
	onSubmit,
	isSubmitting = false,
}: FormNavigationProps) {
	const isLastStep = currentStep === 7;

	return (
		<div
			className="flex items-center justify-between mt-12 pt-6 border-t"
			style={{ borderColor: "var(--outline-variant)" }}
		>
			<Button
				type="button"
				variant="ghost"
				onClick={onBack}
				disabled={currentStep === 1}
				className="flex items-center gap-2 hover:cursor-pointer"
			>
				<ArrowLeft size={16} />
				Back
			</Button>

			{isLastStep ? (
				<Button
					type="button"
					onClick={onSubmit}
					disabled={isSubmitting}
					className="clarity-btn-primary flex items-center gap-2 px-6 py-3 rounded-full hover:cursor-pointer"
					style={{
						backgroundColor: "var(--primary-container)",
						color: "var(--on-primary-container)",
					}}
				>
					{isSubmitting ? (
						<>
							<Loader2 size={16} className="animate-spin" />
							Submitting...
						</>
					) : (
						<>
							Complete Record
							<Check size={16} />
						</>
					)}
				</Button>
			) : (
				<Button
					type="button"
					onClick={onNext}
					disabled={!canGoNext}
					className="flex items-center gap-2 px-6 py-3 rounded-full hover:cursor-pointer"
					style={{
						backgroundColor: canGoNext
							? "var(--primary-container)"
							: "var(--surface-container-high)",
						color: canGoNext
							? "var(--on-primary-container)"
							: "var(--tertiary)",
					}}
				>
					Next
					<ArrowRight size={16} />
				</Button>
			)}
		</div>
	);
}
