"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { type Distortion } from "@/lib/data/distortions";
import { Input } from "@/components/ui/input";

interface LibraryGridProps {
	distortions: Distortion[];
}

export function LibraryGrid({ distortions }: LibraryGridProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredDistortions = distortions.filter((distortion) => {
		const query = searchQuery.toLowerCase();
		return (
			distortion.name.toLowerCase().includes(query) ||
			distortion.definition.toLowerCase().includes(query)
		);
	});

	return (
		<div>
			{/* Search input */}
			<div className="mb-8 max-w-md ml-auto">
				<div className="relative">
					<Search
						size={18}
						className="absolute left-3 top-1/2 -translate-y-1/2"
						style={{ color: "var(--tertiary)" }}
					/>
					<Input
						type="text"
						placeholder="Search patterns..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 h-10 rounded-lg text-sm"
						style={{
							backgroundColor: "var(--surface-container)",
							border: "none",
							color: "var(--on-surface)",
						}}
					/>
				</div>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredDistortions.map((distortion) => (
					<DistortionCard key={distortion.slug} distortion={distortion} />
				))}
			</div>

			{filteredDistortions.length === 0 && (
				<div className="text-center py-12">
					<p
						className="font-serif italic text-lg"
						style={{ color: "var(--tertiary)" }}
					>
						No patterns match your search. Try a different term.
					</p>
				</div>
			)}
		</div>
	);
}

function DistortionCard({ distortion }: { distortion: Distortion }) {
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
		<Link
			href={`/library/${distortion.slug}`}
			className="clarity-card p-6 block transition-all duration-200 group"
			style={{
				backgroundColor: "var(--surface-container-high)",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.backgroundColor =
					"var(--surface-container-highest)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.backgroundColor =
					"var(--surface-container-high)";
			}}
		>
			{/* Top row: category and icon */}
			<div className="flex items-start justify-between mb-4">
				<span
					className="text-[10px] font-medium tracking-widest"
					style={{ color: "var(--tertiary)" }}
				>
					{categoryLabel}
				</span>
				<IconComponent size={20} style={{ color: "var(--tertiary)" }} />
			</div>

			{/* Name */}
			<h3
				className="font-serif text-xl font-semibold mb-2"
				style={{ color: "var(--on-surface)" }}
			>
				{distortion.name}
			</h3>

			{/* Definition */}
			<p
				className="text-sm leading-relaxed mb-4"
				style={{ color: "var(--on-surface)" }}
			>
				{distortion.definition}
			</p>

			{/* Example quote box */}
			<div
				className="rounded-lg p-4 mb-4"
				style={{ backgroundColor: "var(--surface-container)" }}
			>
				<p
					className="text-[13px] italic leading-relaxed"
					style={{ color: "var(--tertiary)" }}
				>
					{distortion.example}
				</p>
			</div>

			{/* Counter question */}
			<div className="flex items-center gap-2">
				<p
					className="text-[13px] font-medium flex-1"
					style={{ color: "var(--ms-primary)" }}
				>
					{distortion.counterQuestion}
				</p>
				<ArrowRight
					size={14}
					className="opacity-0 group-hover:opacity-100 transition-opacity"
					style={{ color: "var(--ms-primary)" }}
				/>
			</div>
		</Link>
	);
}
