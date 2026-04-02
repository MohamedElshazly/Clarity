"use client";

import { getDistortionBySlug } from "@/lib/data/distortions";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { formatShortDate, formatTime } from "@/lib/utils";
import { useGetRecordsByDistortion } from "@/hooks/use-dashboard";
import { DistortionDetailSkeleton } from "@/components/skeletons/distortion-detail-skeleton";

export default function DistortionPage() {
	const params = useParams();
	const slug = params.slug as string;
	const distortion = getDistortionBySlug(slug);

	const { data: relatedRecords, isLoading } = useGetRecordsByDistortion(slug);

	if (!distortion) notFound();

	// Show skeleton during loading
	if (isLoading) return <DistortionDetailSkeleton />;

	// Dynamically get the icon component
	const IconComponent = (
		LucideIcons[distortion.icon as keyof typeof LucideIcons] ||
		LucideIcons.HelpCircle
	) as React.ComponentType<{ size?: number; style?: React.CSSProperties }>;

	// Format category for display
	const categoryLabel = distortion.category
		.split("-")
		.join(" ")
		.toUpperCase();

	return (
		<main className="max-w-4xl mx-auto">
			{/* Back link */}
			<Link
				href="/library"
				className="inline-flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-80 transition-opacity"
				style={{ color: "var(--ms-primary)" }}
			>
				<ArrowLeft size={16} />
				Library
			</Link>

			{/* Header */}
			<div className="mb-12">
				<div className="flex items-start justify-between gap-6 mb-4">
					<div className="flex-1">
						<span
							className="text-[10px] font-medium tracking-widest mb-3 block"
							style={{ color: "var(--tertiary)" }}
						>
							{categoryLabel}
						</span>
						<h1
							className="font-serif text-[clamp(2rem,5vw,3rem)] leading-tight"
							style={{ color: "var(--on-surface)" }}
						>
							{distortion.name}
						</h1>
					</div>
					<div
						className="p-4 rounded-lg"
						style={{ backgroundColor: "var(--surface-container-high)" }}
					>
						<IconComponent size={32} style={{ color: "var(--ms-primary)" }} />
					</div>
				</div>

				<p
					className="text-base leading-relaxed"
					style={{ color: "var(--on-surface)" }}
				>
					{distortion.definition}
				</p>
			</div>

			{/* Example section */}
			<section className="mb-12">
				<h2
					className="font-serif text-xl mb-4"
					style={{ color: "var(--on-surface)" }}
				>
					Example
				</h2>
				<div
					className="clarity-card p-6"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<p
						className="text-base italic leading-relaxed"
						style={{ color: "var(--tertiary)" }}
					>
						{distortion.example}
					</p>
				</div>
			</section>

			{/* Counter question section */}
			<section className="mb-16">
				<h2
					className="font-serif text-xl mb-4"
					style={{ color: "var(--on-surface)" }}
				>
					Counter Question
				</h2>
				<div
					className="clarity-card p-6"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<p
						className="text-base font-medium"
						style={{ color: "var(--ms-primary)" }}
					>
						{distortion.counterQuestion}
					</p>
				</div>
			</section>

			{/* Related records section */}
			<section>
				<h2
					className="font-serif text-xl mb-4"
					style={{ color: "var(--on-surface)" }}
				>
					Records using this pattern
				</h2>

				{!relatedRecords || relatedRecords.length === 0 ? (
					<div
						className="clarity-card p-8 text-center"
						style={{ backgroundColor: "var(--surface-container-high)" }}
					>
						<p style={{ color: "var(--tertiary)" }}>
							You haven't recorded any thoughts with this pattern yet.
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						{relatedRecords.map((record) => {
							const createdDate = new Date(record.created_at);

							return (
								<Link
									key={record.id}
									href={`/records/${record.id}`}
									className="clarity-card p-5 hover:opacity-90 transition-opacity block"
									style={{ backgroundColor: "var(--surface-container-high)" }}
								>
									<div className="flex gap-4">
										{/* Date */}
										<div className="flex flex-col items-center min-w-14">
											<p
												className="text-sm font-bold"
												style={{ color: "var(--on-surface)" }}
											>
												{formatShortDate(createdDate)}
											</p>
											<p
												className="text-xs mt-0.5"
												style={{ color: "var(--tertiary)" }}
											>
												{formatTime(createdDate)}
											</p>
										</div>

										{/* Situation snippet */}
										<div className="flex-1 min-w-0">
											<p
												className="text-sm leading-relaxed line-clamp-2"
												style={{ color: "var(--on-surface)" }}
											>
												{record.situation}
											</p>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</section>
		</main>
	);
}
