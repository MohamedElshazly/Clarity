"use client";

import { RotateCcw, Loader2 } from "lucide-react";
import type { ThoughtRecord } from "@/lib/types/database";

interface ResumeBannerProps {
	draft: ThoughtRecord;
	onResume: () => void;
	onDiscard: () => void;
	isDiscarding: boolean;
}

export function ResumeBanner({
	draft,
	onResume,
	onDiscard,
	isDiscarding,
}: ResumeBannerProps) {
	// Format the updated_at date
	const formattedDate = new Date(draft.updated_at).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});

	// Extract the saved step from metadata
	const savedStep = (draft.metadata as any)?.currentStep || 1;

	return (
		<div
			style={{
				backgroundColor: "var(--surface-container-high)",
				borderRadius: "8px",
				padding: "1rem 1.5rem",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				marginBottom: "2rem",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
				<RotateCcw
					size={14}
					style={{ color: "var(--primary)", flexShrink: 0 }}
				/>
				<div>
					<div
						style={{
							fontFamily: "var(--font-plus-jakarta-sans)",
							fontSize: "13px",
							fontWeight: 500,
							color: "var(--on-surface)",
						}}
					>
						Unfinished session found
					</div>
					<div
						style={{
							fontFamily: "var(--font-plus-jakarta-sans)",
							fontSize: "11px",
							color: "var(--tertiary)",
							marginTop: "2px",
						}}
					>
						Step {savedStep} of 7 • {formattedDate}
					</div>
				</div>
			</div>

			<div style={{ display: "flex", gap: "0.75rem" }}>
				<button
					onClick={onDiscard}
					disabled={isDiscarding}
					style={{
						fontFamily: "var(--font-plus-jakarta-sans)",
						fontSize: "13px",
						color: "var(--tertiary)",
						background: "transparent",
						border: "none",
						cursor: isDiscarding ? "not-allowed" : "pointer",
						padding: "0.5rem 1rem",
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
					}}
				>
					{isDiscarding ? (
						<>
							<Loader2 size={14} className="animate-spin" />
							Discarding...
						</>
					) : (
						"Start fresh"
					)}
				</button>

				<button
					onClick={onResume}
					disabled={isDiscarding}
					style={{
						fontFamily: "var(--font-plus-jakarta-sans)",
						fontSize: "13px",
						backgroundColor: "var(--primary-container)",
						color: "var(--on-primary-container)",
						border: "none",
						borderRadius: "9999px",
						padding: "0.5rem 1.25rem",
						cursor: isDiscarding ? "not-allowed" : "pointer",
						opacity: isDiscarding ? 0.5 : 1,
					}}
				>
					Resume
				</button>
			</div>
		</div>
	);
}
