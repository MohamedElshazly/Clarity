"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

function LoginContent() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") ?? "/";
	const { signInWithGoogle } = useAuth();

	async function handleGoogleSignIn() {
		setLoading(true);
		setError(null);

		const { error } = await signInWithGoogle(redirectTo);

		if (error) {
			setError(error.message);
			setLoading(false);
		}
	}

	return (
		<main
			className="flex min-h-screen flex-col px-4 py-12"
			style={{ backgroundColor: "var(--surface)" }}
		>
			<div className="mx-auto w-full max-w-170 flex flex-col min-h-full">
				{/* Section 1: Wordmark */}
				<div className="mb-24">
					<h1
						className="font-serif text-[18px] font-normal"
						style={{ color: "var(--on-surface)" }}
					>
						Clarity
					</h1>
				</div>

				{/* Section 2: Hero - Vertically centered */}
				<div className="grow flex flex-col justify-center -mt-24">
					<h2
						className="font-serif text-[36px] sm:text-[52px] font-normal leading-[1.15]"
						style={{ color: "var(--on-surface)" }}
					>
						Your thoughts,
						<br />
						<em>examined.</em>
					</h2>

					<p
						className="mt-6 max-w-120 text-[16px] leading-[1.75]"
						style={{ color: "var(--tertiary)" }}
					>
						Clarity is a CBT journaling tool built around Thought Records — a
						clinically proven technique for identifying and reframing the
						automatic negative thoughts that drive anxiety and low mood. Seven
						guided steps. No fluff.
					</p>

					{/* Section 3: Three pillars */}
					<div className="mt-10 flex flex-col sm:flex-row gap-10 sm:gap-10">
						<div className="flex items-center gap-3">
							<div
								className="w-1.5 h-1.5 rounded-full shrink-0"
								style={{ backgroundColor: "var(--primary-container)" }}
							/>
							<span
								className="text-[13px]"
								style={{ color: "var(--tertiary)" }}
							>
								Identify the thought
							</span>
						</div>
						<div className="flex items-center gap-3">
							<div
								className="w-1.5 h-1.5 rounded-full shrink-0"
								style={{ backgroundColor: "var(--primary-container)" }}
							/>
							<span
								className="text-[13px]"
								style={{ color: "var(--tertiary)" }}
							>
								Examine the evidence
							</span>
						</div>
						<div className="flex items-center gap-3">
							<div
								className="w-1.5 h-1.5 rounded-full shrink-0"
								style={{ backgroundColor: "var(--primary-container)" }}
							/>
							<span
								className="text-[13px]"
								style={{ color: "var(--tertiary)" }}
							>
								Find the balanced view
							</span>
						</div>
					</div>

					{/* Section 4: CTA */}
					<div className="mt-12">
						<button
							onClick={handleGoogleSignIn}
							disabled={loading}
							className="clarity-btn-primary px-9 py-[0.85rem] text-[15px] font-medium transition-opacity disabled:opacity-60 hover:cursor-pointer"
							style={{
								borderRadius: "999px",
								backgroundColor: "var(--primary-container)",
								color: "var(--on-primary-container)",
							}}
						>
							{loading ? "Redirecting…" : "Continue with Google"}
						</button>

						{error && (
							<p
								className="mt-4 text-[12px]"
								style={{ color: "var(--destructive)" }}
							>
								{error}
							</p>
						)}

						<p
							className="mt-4 text-[12px]"
							style={{ color: "var(--tertiary)", opacity: 0.6 }}
						>
							Free to use. Your records are private and encrypted.
						</p>
					</div>
				</div>

				{/* Section 5: Footer quote */}
				<div className="mt-auto pt-24 text-center">
					<p
						className="font-serif italic text-[15px]"
						style={{ color: "var(--tertiary)", opacity: 0.7 }}
					>
						You are not your thoughts; you are the awareness observing them.
					</p>
					<p
						className="mt-2 text-[11px] uppercase tracking-widest"
						style={{ color: "var(--tertiary)", opacity: 0.4 }}
					>
						Daily Grounding
					</p>
				</div>
			</div>
		</main>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={
			<main
				className="flex min-h-screen flex-col px-4 py-12"
				style={{ backgroundColor: "var(--surface)" }}
			>
				<div className="mx-auto w-full max-w-170 flex flex-col min-h-full">
					<div className="mb-24">
						<h1
							className="font-serif text-[18px] font-normal"
							style={{ color: "var(--on-surface)" }}
						>
							Clarity
						</h1>
					</div>
				</div>
			</main>
		}>
			<LoginContent />
		</Suspense>
	);
}
