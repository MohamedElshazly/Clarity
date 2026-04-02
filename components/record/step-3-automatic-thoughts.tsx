"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LibrarySheet } from "@/components/library/library-sheet";
import { distortions, getDistortionBySlug } from "@/lib/data/distortions";
import { BookOpen, X } from "lucide-react";
import type { RecordFormValues } from "@/lib/utils/record-helpers";
import { startCase } from "lodash";

interface StepProps {
	form: UseFormReturn<RecordFormValues>;
	formValues: Partial<RecordFormValues>;
}

export function Step3AutomaticThoughts({ form, formValues }: StepProps) {
	const [isLibraryOpen, setIsLibraryOpen] = useState(false);
	const { register, formState } = form;

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
		<div className="space-y-6">
			<div>
				<h1
					className="font-serif text-4xl lg:text-5xl mb-3"
					style={{ color: "var(--on-surface)" }}
				>
					What went through your mind?
				</h1>
				<p className="text-base" style={{ color: "var(--tertiary)" }}>
					Write down the automatic thoughts that came up in this situation.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Left Column: Textarea */}
				<div className="space-y-2">
					<label
						htmlFor="automatic-thought-input"
						className="text-sm font-medium uppercase tracking-wide"
						style={{ color: "var(--tertiary)" }}
					>
						The Internal Narrative
					</label>
					<Textarea
						{...register("automaticThought")}
						id="automatic-thought-input"
						placeholder="I felt like everyone was watching me fail..."
						className="min-h-62.5 text-base"
						style={{
							backgroundColor: "var(--surface-container-high)",
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

				{/* Right Column: Distortion Selection */}
				<div className="space-y-4">
					<div>
						<label
							className="text-sm font-medium uppercase tracking-wide mb-2 block"
							style={{ color: "var(--tertiary)" }}
						>
							Cognitive Distortions
						</label>
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
								className="h-8 flex items-center px-4 rounded-lg border border-input text-sm opacity-50"
								style={{
									backgroundColor: "var(--surface-container-high)",
									color: "var(--on-surface)",
								}}
							>
								All patterns selected
							</div>
						)}
					</div>

					<Button
						type="button"
						variant="outline"
						onClick={() => setIsLibraryOpen(true)}
						className="w-full"
						style={{ backgroundColor: "var(--surface-container-high)" }}
					>
						<BookOpen size={16} className="mr-2" />
						Not sure? Browse the library →
					</Button>

					{/* Selected Distortions */}
					{selectedDistortionSlugs.length > 0 && (
						<div className="space-y-3">
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
												style={{ color: "var(--ms-primary)" }}
											>
												{startCase(distortion.name)}
											</h4>
											<button
												type="button"
												onClick={() => handleRemoveDistortion(slug)}
												className="p-1 rounded hover:bg-(--surface-container) transition-colors cursor-pointer"
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
