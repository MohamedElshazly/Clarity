import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function RecordDetailSkeleton() {
	return (
		<main className="max-w-4xl mx-auto px-6 py-12">
			{/* Back link */}
			<Link
				href="/records"
				className="inline-flex items-center gap-2 mb-8 text-sm transition-opacity hover:opacity-70"
				style={{ color: "var(--tertiary)" }}
			>
				<ChevronLeft size={16} />
				Back to Records
			</Link>

			{/* Tabs */}
			<div className="mb-8">
				<div
					className="inline-flex gap-2 p-1 rounded-lg"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<Skeleton className="h-9 w-20" />
					<Skeleton className="h-9 w-16" />
				</div>
			</div>

			{/* Record content */}
			<div
				className="clarity-card p-8 mb-6"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				{/* Title and date */}
				<div className="mb-8">
					<Skeleton className="h-8 w-3/4 mb-2" />
					<Skeleton className="h-4 w-32" />
				</div>

				{/* Emotions */}
				<div className="mb-8">
					<Skeleton className="h-5 w-24 mb-3" />
					<div className="flex flex-wrap gap-3">
						<Skeleton className="h-8 w-32 rounded-full" />
						<Skeleton className="h-8 w-28 rounded-full" />
					</div>
				</div>

				{/* Situation */}
				<div className="mb-8">
					<Skeleton className="h-5 w-32 mb-3" />
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-5/6" />
				</div>

				{/* Thoughts */}
				<div className="mb-8">
					<Skeleton className="h-5 w-48 mb-3" />
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-4/5" />
				</div>

				{/* Distortions */}
				<div className="mb-8">
					<Skeleton className="h-5 w-40 mb-3" />
					<div className="flex flex-wrap gap-2">
						<Skeleton className="h-7 w-32 rounded-full" />
						<Skeleton className="h-7 w-28 rounded-full" />
						<Skeleton className="h-7 w-36 rounded-full" />
					</div>
				</div>

				{/* Evidence sections */}
				<div className="mb-8">
					<Skeleton className="h-5 w-40 mb-3" />
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-3/4" />
				</div>

				<div className="mb-8">
					<Skeleton className="h-5 w-48 mb-3" />
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-5/6" />
				</div>

				{/* Balanced thought */}
				<div className="mb-8">
					<Skeleton className="h-5 w-36 mb-3" />
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-4/5" />
				</div>

				{/* Outcome */}
				<div>
					<Skeleton className="h-5 w-28 mb-3" />
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-2/3" />
				</div>
			</div>

			{/* Action buttons */}
			<div className="flex gap-3">
				<Skeleton className="h-10 w-24" />
				<Skeleton className="h-10 w-20 ml-auto" />
			</div>
		</main>
	);
}
