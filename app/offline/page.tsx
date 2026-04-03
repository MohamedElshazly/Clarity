"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
	const handleTryAgain = () => {
		window.location.reload();
	};

	return (
		<div className="min-h-screen bg-surface flex flex-col">
			{/* Header */}
			<header className="p-6">
				<h1 className="font-serif text-2xl font-semibold text-on-surface">
					Clarity
				</h1>
			</header>

			{/* Main content */}
			<main className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
				<div className="flex flex-col items-center max-w-md text-center space-y-6">
					{/* Icon */}
					<WifiOff className="w-8 h-8 text-tertiary" />

					{/* Heading */}
					<h2 className="font-serif text-4xl font-semibold text-on-surface">
						You're offline.
					</h2>

					{/* Body text */}
					<p className="text-[15px] text-tertiary max-w-[400px] leading-relaxed">
						Your records are waiting. Come back when you're connected and
						everything will be here.
					</p>

					{/* Try again button */}
					<Button
						onClick={handleTryAgain}
						className="rounded-full bg-primary-container text-on-primary-container hover:bg-primary-container/90 px-8 py-6 text-base font-medium mt-4"
					>
						Try again
					</Button>
				</div>
			</main>

			{/* Footer quote */}
			<footer className="p-6 pb-12">
				<p className="text-center font-serif italic text-sm text-tertiary max-w-2xl mx-auto">
					"You are not your thoughts; you are the awareness observing them."
				</p>
			</footer>
		</div>
	);
}
