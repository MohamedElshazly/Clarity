import { Skeleton } from "@/components/ui/skeleton";

export default function LibraryLoading() {
	return (
		<main className="max-w-7xl mx-auto px-8 py-12">
			{/* Page header skeleton */}
			<div className="mb-12">
				<Skeleton className="h-14 w-80 mb-4" />
				<Skeleton className="h-5 w-full max-w-105" />
			</div>

			{/* Search input skeleton */}
			<div className="mb-8 max-w-md ml-auto">
				<Skeleton className="h-10 w-full rounded-lg" />
			</div>

			{/* Grid skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="clarity-card p-6"
						style={{ backgroundColor: "var(--surface-container-high)" }}
					>
						{/* Top row: category and icon */}
						<div className="flex items-start justify-between mb-4">
							<Skeleton className="h-3 w-24" />
							<Skeleton className="h-5 w-5 rounded-full" />
						</div>

						{/* Name */}
						<Skeleton className="h-7 w-3/4 mb-2" />

						{/* Definition */}
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-4 w-5/6 mb-4" />

						{/* Example quote box */}
						<div
							className="rounded-lg p-4 mb-4"
							style={{ backgroundColor: "var(--surface-container)" }}
						>
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-4 w-4/5" />
						</div>

						{/* Counter question */}
						<Skeleton className="h-4 w-3/4" />
					</div>
				))}
			</div>
		</main>
	);
}
