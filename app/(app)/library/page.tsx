import { distortions } from "@/lib/data/distortions";
import { LibraryGrid } from "@/components/library/library-grid";

export default function LibraryPage() {
	return (
		<main className="max-w-7xl mx-auto px-8 py-12">
			{/* Page header */}
			<div className="mb-12">
				<h1
					className="font-serif text-[clamp(2.5rem,5vw,3.5rem)] leading-tight mb-4"
					style={{ color: "var(--on-surface)" }}
				>
					Thought Library
				</h1>
				<p
					className="text-base leading-relaxed max-w-105"
					style={{ color: "var(--tertiary)" }}
				>
					A curated archive of common mental shortcuts. Recognizing these
					patterns is the first step toward reclaiming your mental space.
				</p>
			</div>

			{/* Grid with search */}
			<LibraryGrid distortions={distortions} />
		</main>
	);
}
