import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LibraryNotFound() {
	return (
		<main className="max-w-7xl mx-auto px-8 py-32">
			<div className="text-center">
				<h1
					className="font-serif italic text-3xl mb-4"
					style={{ color: "var(--on-surface)" }}
				>
					This reflection doesn't exist or belongs to someone else.
				</h1>
				<p className="text-base mb-8" style={{ color: "var(--tertiary)" }}>
					The cognitive pattern you're looking for could not be found.
				</p>
				<Link
					href="/library"
					className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
					style={{ color: "var(--ms-primary)" }}
				>
					<ArrowLeft size={16} />
					Back to Thought Library
				</Link>
			</div>
		</main>
	);
}
