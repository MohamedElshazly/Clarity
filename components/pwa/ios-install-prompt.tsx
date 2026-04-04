"use client";

import { useEffect, useState } from "react";
import { X, Share } from "lucide-react";

export function IOSInstallPrompt() {
	const [showPrompt, setShowPrompt] = useState(false);

	useEffect(() => {
		console.log("[iOS PWA Install] Component mounted");

		// Check if user has already dismissed the prompt
		const dismissed = localStorage.getItem("ios-pwa-install-dismissed");
		if (dismissed === "true") {
			console.log("[iOS PWA Install] Previously dismissed");
			return;
		}

		// Check if already installed
		if (window.matchMedia("(display-mode: standalone)").matches) {
			console.log("[iOS PWA Install] Already installed");
			return;
		}

		// Detect iOS Safari
		const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

		console.log("[iOS PWA Install] isIOS:", isIOS, "isSafari:", isSafari);

		if (isIOS && isSafari) {
			// Show prompt after a short delay
			const timer = setTimeout(() => {
				setShowPrompt(true);
				console.log("[iOS PWA Install] Showing prompt");
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, []);

	const handleDismiss = () => {
		console.log("[iOS PWA Install] User dismissed prompt");
		setShowPrompt(false);
		localStorage.setItem("ios-pwa-install-dismissed", "true");
	};

	if (!showPrompt) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5">
			<div className="mx-auto max-w-md rounded-lg bg-surface-container-high p-4 shadow-[0_24px_48px_rgba(0,0,0,0.04)]">
				<div className="flex items-start gap-3">
					<div className="shrink-0 rounded-full bg-primary-container/10 p-2">
						<Share className="h-5 w-5 text-primary" />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-serif text-base font-medium text-on-surface">
							Install Clarity
						</h3>
						<p className="mt-1 text-sm text-tertiary">
							Tap{" "}
							<span className="inline-flex h-5 w-5 items-center justify-center">
								<Share className="h-4 w-4" />
							</span>{" "}
							below, then <strong>&quot;Add to Home Screen&quot;</strong>
						</p>
					</div>
					<button
						onClick={handleDismiss}
						className="shrink-0 rounded-full p-1 text-tertiary transition-opacity hover:opacity-90"
						aria-label="Close"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
