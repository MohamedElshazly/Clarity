"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LibrarySheet } from "@/components/library/library-sheet";
import { distortions, getDistortionBySlug } from "@/lib/data/distortions";
import { Sparkles, Loader2, X, HelpCircle } from "lucide-react";
import type { RecordFormValues } from "@/lib/utils/record-helpers";
import { startCase } from "lodash";
import { useClassifyDistortion } from "@/hooks/use-classify-distortion";
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

export function Step3AutomaticThoughts({ form, formValues }: StepProps) {
	const [isLibraryOpen, setIsLibraryOpen] = useState(false);
	const { register, formState } = form;

	const { slugs: suggestedSlugs, isLoading: isClassifying, error: classifyError, hasRun, classify, reset } =
		useClassifyDistortion();

	const thoughtValue = formValues.automaticThought ?? "";

	useEffect(() => {
		if (thoughtValue.trim().length < 20) {
			reset();
			return;
		}
		const timer = setTimeout(() => classify(thoughtValue), 1500);
		return () => clearTimeout(timer);
	}, [thoughtValue]);

	const selectedDistortionSlugs = formValues.distortionSlugs || [];
	const availableDistortions = distortions.filter(
		(d) => !selectedDistortionSlugs.includes(d.slug)
	);

	const handleAddDistortion = (slug: string | null) => {
		if (!slug || selectedDistortionSlugs.includes(slug)) return;
		form.setValue("distortionSlugs", [...selectedDistortionSlugs, slug]);
	};

	const handleRemoveDistortion = (slug: string) => {
		form.setValue(
			"distortionSlugs",
			selectedDistortionSlugs.filter((s) => s !== slug)
		);
	};

	return (
		<div className="space-y-8">
			{/* Heading */}
			<div>
				<div className="flex items-start justify-between gap-2 mb-4">
					<h1
						className="font-serif text-4xl sm:text-5xl lg:text-6xl"
						style={{ color: "var(--on-surface)" }}
					>
						What went through your mind?
					</h1>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger className="mt-2 shrink-0">
								<HelpCircle size={16} style={{ color: "var(--tertiary)" }} />
							</TooltipTrigger>
							<TooltipContent side="bottom" className="max-w-72 space-y-2">
								<p>Write the exact words or images that ran through your head. This is your instant reaction — the story you told yourself.</p>
								<p className="opacity-70">Clinical: automatic thoughts are the Beliefs (B) in the ABC model. Identifying cognitive distortions reveals the systematic thinking errors that link events to emotions.</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				<p className="text-base" style={{ color: "var(--tertiary)" }}>
					Write down the automatic thoughts that came up in this situation.
				</p>
			</div>

			{/* Textarea */}
			<div
				className="clarity-card p-6 space-y-4"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<label
					htmlFor="automatic-thought-input"
					className="text-xs font-medium uppercase tracking-widest block"
					style={{ color: "var(--tertiary)" }}
				>
					The Internal Narrative
				</label>
				<div className="relative">
					<Textarea
						{...register("automaticThought")}
						id="automatic-thought-input"
						placeholder="I felt like everyone was watching me fail..."
						className="min-h-48 text-base pb-8"
						style={{
							backgroundColor: "var(--surface-container)",
							color: "var(--on-surface)",
							borderColor: "transparent",
						}}
						aria-invalid={!!formState.errors.automaticThought}
						aria-describedby={
							formState.errors.automaticThought
								? "automatic-thought-error"
								: undefined
						}
					/>
					{thoughtValue.length > 0 && (
						<span
							className="absolute bottom-3 right-3 text-xs pointer-events-none select-none"
							style={{ color: "var(--tertiary)" }}
						>
							{thoughtValue.length} characters
						</span>
					)}
				</div>
				{formState.errors.automaticThought && (
					<p
						id="automatic-thought-error"
						className="text-sm"
						style={{ color: "var(--error, #ff5449)" }}
						role="alert"
					>
						{formState.errors.automaticThought.message}
					</p>
				)}
			</div>

			{/* AI Suggestion strip */}
			{isClassifying && (
				<div className="flex items-center gap-2">
					<Loader2 size={12} className="animate-spin" style={{ color: "var(--tertiary)" }} />
					<span style={{ fontSize: 11, color: "var(--tertiary)", fontStyle: "italic" }}>
						Analyzing your thought...
					</span>
				</div>
			)}
			{!isClassifying && hasRun && suggestedSlugs.length > 0 && (
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<Sparkles size={12} style={{ color: "var(--primary)" }} />
						<span
							style={{
								fontSize: 11,
								color: "var(--primary)",
								textTransform: "uppercase",
								letterSpacing: "0.08em",
							}}
						>
							AI Suggestion
						</span>
						<span style={{ fontSize: 11, color: "var(--tertiary)" }}>— tap to apply</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{suggestedSlugs.map((slug) => {
							const distortion = distortions.find((d) => d.slug === slug);
							if (!distortion) return null;
							const isSelected = selectedDistortionSlugs.includes(slug);
							return (
								<button
									key={slug}
									type="button"
									onClick={() => handleAddDistortion(slug)}
									style={{
										background: isSelected
											? "var(--primary-container)"
											: "var(--surface-container-highest)",
										color: isSelected
											? "var(--on-primary-container)"
											: "var(--on-surface)",
										border: isSelected
											? "none"
											: "1px solid rgba(255,180,164,0.15)",
										borderRadius: 999,
										padding: "0.35rem 1rem",
										fontSize: 13,
										cursor: "pointer",
										transition: "all 150ms ease",
									}}
								>
									{distortion.name}
								</button>
							);
						})}
					</div>
				</div>
			)}
			{!isClassifying && hasRun && suggestedSlugs.length === 0 && !classifyError && (
				<span style={{ fontSize: 11, color: "var(--tertiary)", display: "block" }}>
					No strong pattern detected — select manually below.
				</span>
			)}
			{classifyError && (
				<span style={{ fontSize: 11, color: "var(--tertiary)", display: "block" }}>
					{classifyError}
				</span>
			)}

			{/* Distortion selection */}
			<div className="space-y-3">
				<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
					<span
						className="text-xs font-medium uppercase tracking-widest"
						style={{ color: "var(--tertiary)" }}
					>
						Cognitive Distortion
					</span>
					<button
						type="button"
						onClick={() => setIsLibraryOpen(true)}
						className="text-xs hover:underline transition-colors"
						style={{ color: "var(--tertiary)" }}
					>
						Not sure? Browse the library ↗
					</button>
				</div>

				{availableDistortions.length > 0 ? (
					<Select value="" onValueChange={handleAddDistortion}>
						<SelectTrigger>
							<SelectValue placeholder="Add a thinking pattern..." />
						</SelectTrigger>
						<SelectContent>
							{availableDistortions.map((d) => (
								<SelectItem key={d.slug} value={d.slug}>
									{startCase(d.name)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					<div
						className="h-10 flex items-center px-4 rounded-lg text-sm opacity-50"
						style={{
							backgroundColor: "var(--surface-container-high)",
							color: "var(--on-surface)",
						}}
					>
						All patterns selected
					</div>
				)}

				{formState.errors.distortionSlugs && (
					<p
						className="text-sm"
						style={{ color: "var(--error, #ff5449)" }}
						role="alert"
					>
						{formState.errors.distortionSlugs.message}
					</p>
				)}

				{/* Selected distortion cards */}
				{selectedDistortionSlugs.length > 0 && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
						{selectedDistortionSlugs.map((slug) => {
							const distortion = getDistortionBySlug(slug);
							if (!distortion) return null;
							return (
								<div
									key={slug}
									className="clarity-card p-4"
									style={{ backgroundColor: "var(--surface-container-highest)" }}
								>
									<div className="flex items-start justify-between mb-2">
										<h4
											className="text-sm font-semibold"
											style={{ color: "var(--primary)" }}
										>
											{startCase(distortion.name)}
										</h4>
										<button
											type="button"
											onClick={() => handleRemoveDistortion(slug)}
											className="p-1 rounded hover:bg-(--surface-container) transition-colors cursor-pointer shrink-0"
											aria-label={`Remove ${distortion.name}`}
										>
											<X size={14} style={{ color: "var(--tertiary)" }} />
										</button>
									</div>
									<p
										className="text-xs leading-relaxed"
										style={{ color: "var(--tertiary)" }}
									>
										{distortion.definition}
									</p>
								</div>
							);
						})}
					</div>
				)}
			</div>

			<LibrarySheet
				open={isLibraryOpen}
				onClose={() => setIsLibraryOpen(false)}
				onSelectDistortion={(slug) => {
					handleAddDistortion(slug);
					setIsLibraryOpen(false);
				}}
			/>
		</div>
	);
}
