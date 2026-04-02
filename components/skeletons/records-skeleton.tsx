import { Skeleton } from "@/components/ui/skeleton";

export function RecordsSkeleton() {
	return (
		<main className="max-w-5xl mx-auto px-6 py-12">
			{/* Page header skeleton */}
			<div className="mb-12">
				<Skeleton className="h-14 w-64 mb-4" />
				<Skeleton className="h-5 w-full max-w-lg" />
			</div>

			{/* Filter bar skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
				{[...Array(3)].map((_, i) => (
					<div key={i}>
						<Skeleton className="h-3 w-32 mb-2" />
						<Skeleton
							className="h-10 w-full rounded-md"
							style={{ backgroundColor: "var(--surface-container-high)" }}
						/>
					</div>
				))}
			</div>

			{/* Timeline skeleton */}
			<div className="relative">
				{/* Timeline vertical line */}
				<div
					className="absolute left-0 top-0 bottom-0 w-px"
					style={{
						backgroundColor: "var(--surface-container-highest)",
						marginLeft: "0.5rem",
					}}
				/>

				{/* Record cards skeleton */}
				<div className="space-y-8">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="relative pl-8">
							{/* Timeline dot */}
							<div
								className="absolute left-0 top-8 w-4 h-4 rounded-full"
								style={{
									backgroundColor: "var(--surface-container-highest)",
								}}
							/>
							<div
								className="clarity-card p-6"
								style={{ backgroundColor: "var(--surface-container-high)" }}
							>
								<div className="flex items-start gap-4 mb-4">
									<Skeleton className="h-5 w-32" />
									<Skeleton className="h-5 w-20 ml-auto rounded-full" />
								</div>
								<Skeleton className="h-4 w-full mb-2" />
								<Skeleton className="h-4 w-5/6 mb-4" />
								<div className="flex flex-wrap gap-2">
									<Skeleton className="h-6 w-24 rounded-full" />
									<Skeleton className="h-6 w-28 rounded-full" />
									<Skeleton className="h-6 w-20 rounded-full" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
