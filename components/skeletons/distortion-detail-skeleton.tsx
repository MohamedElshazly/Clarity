import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function DistortionDetailSkeleton() {
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
						<Skeleton className="h-3 w-32 mb-3" />
						<Skeleton className="h-12 w-3/4 mb-2" />
					</div>
					<Skeleton className="w-20 h-20 rounded-lg" />
				</div>
				<Skeleton className="h-5 w-full mb-2" />
				<Skeleton className="h-5 w-5/6" />
			</div>

			{/* Example section */}
			<section className="mb-12">
				<Skeleton className="h-6 w-32 mb-4" />
				<div
					className="clarity-card p-6"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-4/5" />
				</div>
			</section>

			{/* Counter Question section */}
			<section className="mb-16">
				<Skeleton className="h-6 w-48 mb-4" />
				<div
					className="clarity-card p-6"
					style={{ backgroundColor: "var(--surface-container-high)" }}
				>
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-3/4" />
				</div>
			</section>

			{/* Related Records section */}
			<section>
				<Skeleton className="h-6 w-56 mb-6" />
				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="clarity-card p-5"
							style={{ backgroundColor: "var(--surface-container-high)" }}
						>
							<div className="flex gap-4">
								<div className="flex flex-col items-center min-w-14">
									<Skeleton className="h-5 w-12 mb-1" />
									<Skeleton className="h-3 w-12" />
								</div>
								<div className="flex-1">
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-3/4" />
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
