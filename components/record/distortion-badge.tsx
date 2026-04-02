"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getDistortionBySlug } from "@/lib/data/distortions";

interface DistortionBadgeProps {
	slug: string;
	href?: string;
}

export function DistortionBadge({ slug, href }: DistortionBadgeProps) {
	const distortion = getDistortionBySlug(slug);

	if (!distortion) return null;

	const badge = (
		<Badge
			className="text-xs uppercase tracking-wide rounded-full px-3 py-1"
			style={{
				backgroundColor: "var(--surface-container-highest)",
				color: "var(--tertiary)",
				border: "none",
			}}
		>
			{distortion.name}
		</Badge>
	);

	if (href) {
		return (
			<Link href={href} className="hover:opacity-80 transition-opacity">
				{badge}
			</Link>
		);
	}

	return badge;
}

interface DistortionBadgesProps {
	slugs: string[];
	linkToLibrary?: boolean;
}

export function DistortionBadges({
	slugs,
	linkToLibrary = false,
}: DistortionBadgesProps) {
	if (!slugs || slugs.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{slugs.map((slug) => (
				<DistortionBadge
					key={slug}
					slug={slug}
					href={linkToLibrary ? `/library/${slug}` : undefined}
				/>
			))}
		</div>
	);
}
