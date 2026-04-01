"use client";

import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { distortions, type Distortion } from "@/lib/data/distortions";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

interface LibrarySheetProps {
	open: boolean;
	onClose: () => void;
	onSelectDistortion?: (slug: string) => void;
}

export function LibrarySheet({
	open,
	onClose,
	onSelectDistortion,
}: LibrarySheetProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredDistortions = distortions.filter((distortion) => {
		const query = searchQuery.toLowerCase();
		return (
			distortion.name.toLowerCase().includes(query) ||
			distortion.definition.toLowerCase().includes(query)
		);
	});

	const handleSelect = (slug: string) => {
		if (onSelectDistortion) {
			onSelectDistortion(slug);
			onClose();
		}
	};

	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-150 overflow-y-auto px-10"
				style={{ backgroundColor: "var(--surface-container)" }}
			>
				<SheetHeader>
					<SheetTitle
						className="font-serif text-2xl"
						style={{ color: "var(--on-surface)" }}
					>
						Thought Library
					</SheetTitle>
					<SheetDescription style={{ color: "var(--tertiary)" }}>
						Select a pattern to learn more or reference it in your thought
						record.
					</SheetDescription>
				</SheetHeader>

				{/* Search input */}
				<div className="mt-6 mb-6">
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
								backgroundColor: "var(--surface-container-high)",
								border: "none",
								color: "var(--on-surface)",
							}}
						/>
					</div>
				</div>

				{/* Distortion list */}
				<div className="flex flex-col gap-4 pb-4">
					{filteredDistortions.map((distortion) => (
						<DistortionSheetCard
							key={distortion.slug}
							distortion={distortion}
							onSelect={handleSelect}
						/>
					))}
				</div>

				{filteredDistortions.length === 0 && (
					<div className="text-center py-12">
						<p style={{ color: "var(--tertiary)" }}>
							No patterns match your search.
						</p>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}

function DistortionSheetCard({
	distortion,
	onSelect,
}: {
	distortion: Distortion;
	onSelect?: (slug: string) => void;
}) {
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

	const handleClick = () => {
		if (onSelect) {
			onSelect(distortion.slug);
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className="clarity-card p-5 text-left transition-all duration-200 group w-full cursor-pointer"
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
			<div className="flex items-start justify-between mb-3">
				<span
					className="text-[10px] font-medium tracking-widest"
					style={{ color: "var(--tertiary)" }}
				>
					{categoryLabel}
				</span>
				<IconComponent size={18} style={{ color: "var(--tertiary)" }} />
			</div>

			{/* Name */}
			<h3
				className="font-serif text-lg font-semibold mb-2"
				style={{ color: "var(--on-surface)" }}
			>
				{distortion.name}
			</h3>

			{/* Definition (truncated) */}
			<p
				className="text-sm leading-relaxed mb-3 line-clamp-2"
				style={{ color: "var(--on-surface)" }}
			>
				{distortion.definition}
			</p>

			{/* Counter question preview */}
			<div className="flex items-center gap-2">
				<p
					className="text-xs font-medium flex-1 line-clamp-1"
					style={{ color: "var(--ms-primary)" }}
				>
					{distortion.counterQuestion}
				</p>
				<ArrowRight
					size={14}
					className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
					style={{ color: "var(--ms-primary)" }}
				/>
			</div>
		</button>
	);
}
