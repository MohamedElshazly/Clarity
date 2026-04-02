import { Skeleton } from "@/components/ui/skeleton";

export function InsightsSkeleton() {
	return (
		<main className="max-w-6xl mx-auto">
			{/* Header skeleton */}
			<section className="mb-12">
				<Skeleton className="h-14 w-96 mb-6" />
				<div className="flex gap-2">
					<Skeleton className="h-9 w-20 rounded-full" />
					<Skeleton className="h-9 w-24 rounded-full" />
					<Skeleton className="h-9 w-20 rounded-full" />
				</div>
			</section>

			{/* Two-column layout skeleton */}
			<section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
				{/* Left column - Cognitive Patterns */}
				<div
					className="lg:col-span-3 clarity-card p-8"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<div className="flex items-start justify-between mb-6">
						<div className="flex-1">
							<Skeleton className="h-8 w-48 mb-2" />
							<Skeleton className="h-4 w-64" />
						</div>
						<Skeleton className="h-5 w-5 rounded-full" />
					</div>

					<div className="space-y-6">
						{[...Array(5)].map((_, i) => (
							<div key={i}>
								<div className="flex items-center justify-between mb-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-12" />
								</div>
								<Skeleton className="h-1.5 w-full rounded-full mb-1" />
								<Skeleton className="h-3 w-24" />
							</div>
						))}
					</div>
				</div>

				{/* Right column - The Shift */}
				<div
					className="lg:col-span-2 clarity-card p-8"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<Skeleton className="h-8 w-32 mb-2" />
					<Skeleton className="h-4 w-full mb-8" />

					<div className="flex items-end justify-center gap-8 mb-8">
						<div className="flex flex-col items-center gap-3">
							<Skeleton className="w-14" style={{ height: "200px" }} />
							<div className="text-center">
								<Skeleton className="h-3 w-12 mb-1 mx-auto" />
								<Skeleton className="h-6 w-12 mx-auto" />
							</div>
						</div>
						<div className="flex flex-col items-center gap-3">
							<Skeleton className="w-14" style={{ height: "200px" }} />
							<div className="text-center">
								<Skeleton className="h-3 w-12 mb-1 mx-auto" />
								<Skeleton className="h-6 w-12 mx-auto" />
							</div>
						</div>
					</div>

					<Skeleton className="h-20 w-full rounded-lg" />
				</div>
			</section>

			{/* Consistency Garden skeleton */}
			<section
				className="clarity-card p-8 mb-16"
				style={{ backgroundColor: "var(--surface-container-high)" }}
			>
				<div className="flex items-start justify-between mb-8 flex-wrap gap-4">
					<div className="flex-1">
						<Skeleton className="h-8 w-56 mb-2" />
						<Skeleton className="h-4 w-64" />
					</div>

					<div className="flex gap-8">
						<div>
							<Skeleton className="h-3 w-24 mb-1" />
							<Skeleton className="h-8 w-16" />
						</div>
						<div>
							<Skeleton className="h-3 w-24 mb-1" />
							<Skeleton className="h-8 w-12" />
						</div>
					</div>
				</div>

				{/* Calendar skeleton */}
				<div className="grid grid-cols-7 gap-2 mb-3">
					{[...Array(7)].map((_, i) => (
						<Skeleton key={i} className="h-3 w-full" />
					))}
				</div>
				<div className="grid grid-cols-7 gap-2">
					{[...Array(35)].map((_, i) => (
						<Skeleton key={i} className="h-12 w-full rounded-lg" />
					))}
				</div>
			</section>

			{/* Grounding Quote skeleton */}
			<section className="text-center py-16 mb-12">
				<Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
				<Skeleton className="h-12 w-full max-w-2xl mx-auto mb-4" />
				<Skeleton className="h-4 w-48 mx-auto mb-2" />
				<Skeleton className="h-3 w-32 mx-auto" />
			</section>
		</main>
	);
}
