"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [showPrompt, setShowPrompt] = useState(false);

	useEffect(() => {
		console.log("[PWA Install] Component mounted");

		// Check if user has already dismissed the prompt
		const dismissed = localStorage.getItem("pwa-install-dismissed");
		if (dismissed === "true") {
			console.log("[PWA Install] Previously dismissed");
			return;
		}

		// Check if already installed
		if (window.matchMedia("(display-mode: standalone)").matches) {
			console.log("[PWA Install] Already installed");
			return;
		}

		// Check for iOS
		const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
		if (isIOS) {
			console.log("[PWA Install] iOS detected, skipping (use iOS prompt)");
			return;
		}

		const handler = (e: Event) => {
			console.log("[PWA Install] beforeinstallprompt event fired!");
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);

			// Show prompt after a short delay
			setTimeout(() => {
				setShowPrompt(true);
				console.log("[PWA Install] Showing prompt");
			}, 2000);
		};

		window.addEventListener("beforeinstallprompt", handler);
		console.log("[PWA Install] Event listener added");

		// Fallback: if no event fires within 5 seconds on Android Chrome, something is wrong
		const timeout = setTimeout(() => {
			const isAndroid = /android/i.test(navigator.userAgent);
			const isChrome = /chrome/i.test(navigator.userAgent);
			if (isAndroid && isChrome && !deferredPrompt) {
				console.log(
					"[PWA Install] No install prompt after 5s. Possible reasons: 1) Already installed 2) Not meeting install criteria 3) User engagement required",
				);
			}
		}, 5000);

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
			clearTimeout(timeout);
		};
	}, [deferredPrompt]);

	const handleInstall = async () => {
		if (!deferredPrompt) {
			console.log("[PWA Install] No deferred prompt available");
			return;
		}

		console.log("[PWA Install] Triggering install prompt");
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		console.log("[PWA Install] User choice:", outcome);

		if (outcome === "accepted") {
			setShowPrompt(false);
			setDeferredPrompt(null);
		}
	};

	const handleDismiss = () => {
		console.log("[PWA Install] User dismissed prompt");
		setShowPrompt(false);
		localStorage.setItem("pwa-install-dismissed", "true");
	};

	if (!showPrompt) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-5">
			<div className="mx-auto max-w-md rounded-lg bg-surface-container-high p-4 shadow-[0_24px_48px_rgba(0,0,0,0.04)]">
				<div className="flex items-start gap-3">
					<div className="shrink-0 rounded-full bg-primary-container/10 p-2">
						<Download className="h-5 w-5 text-primary" />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-serif text-base font-medium text-on-surface">
							Install Clarity
						</h3>
						<p className="mt-1 text-sm text-tertiary">
							Add Clarity to your home screen for quick access and a better
							experience.
						</p>
						<div className="mt-4 flex gap-2">
							<button
								onClick={handleInstall}
								className="flex-1 rounded-full bg-primary-container px-4 py-2 text-sm font-medium text-on-primary-container transition-opacity hover:opacity-90"
							>
								Install
							</button>
							<button
								onClick={handleDismiss}
								className="rounded-full px-4 py-2 text-sm font-medium text-tertiary transition-opacity hover:opacity-90"
							>
								Not now
							</button>
						</div>
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
