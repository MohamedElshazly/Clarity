import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
	return (
		<main className="max-w-5xl mx-auto">
			{/* Section 1: Greeting Skeleton */}
			<section className="mb-12">
				<div className="flex items-start justify-between gap-6">
					<div className="flex-1">
						<Skeleton className="h-3 w-32 mb-3" />
						<Skeleton className="h-16 w-full max-w-xl mb-4" />
						<Skeleton className="h-5 w-full max-w-md" />
					</div>
					<Skeleton className="h-12 w-48 rounded-full mt-8" />
				</div>
			</section>

			{/* Section 2: Stat Chips Skeleton */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className="clarity-card flex items-center gap-4 p-5"
						style={{ backgroundColor: "var(--surface-container-high)" }}
					>
						<Skeleton className="w-14 h-14 rounded-lg" />
						<div className="flex-1">
							<Skeleton className="h-3 w-16 mb-2" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>
				))}
			</section>

			{/* Section 3: Recent Reflections Skeleton */}
			<section className="mb-20">
				<div className="flex items-end justify-between mb-6">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-5 w-32" />
				</div>

				<div className="flex flex-col gap-6">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="clarity-card p-6"
							style={{ backgroundColor: "var(--surface-container-high)" }}
						>
							<div className="flex gap-6">
								<div className="flex flex-col items-center min-w-16">
									<Skeleton className="h-6 w-12 mb-2" />
									<Skeleton className="h-4 w-12" />
								</div>
								<div className="flex-1">
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-3/4 mb-4" />
									<div className="flex items-center gap-3">
										<Skeleton className="h-6 w-24 rounded-full" />
										<Skeleton className="h-3 w-3 rounded-full" />
										<Skeleton className="h-6 w-32 rounded-full" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Section 4: Daily Quote Skeleton */}
			<section className="text-center py-16 mb-12">
				<div className="flex justify-center mb-6">
					<Skeleton className="w-8 h-8 rounded-full" />
				</div>
				<Skeleton className="h-12 w-full max-w-2xl mx-auto mb-4" />
				<Skeleton className="h-3 w-24 mx-auto" />
			</section>
		</main>
	);
}
