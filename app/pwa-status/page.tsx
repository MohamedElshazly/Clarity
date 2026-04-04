"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Download } from "lucide-react";

interface PWAStatus {
	manifestLoaded: boolean;
	serviceWorkerRegistered: boolean;
	serviceWorkerActive: boolean;
	isStandalone: boolean;
	manifestUrl: string | null;
	swUrl: string | null;
	displayMode: string;
	userAgent: string;
	canInstall: boolean;
	isIOS: boolean;
	isSafari: boolean;
	isChrome: boolean;
	isAndroid: boolean;
}

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAStatusPage() {
	const [status, setStatus] = useState<PWAStatus>({
		manifestLoaded: false,
		serviceWorkerRegistered: false,
		serviceWorkerActive: false,
		isStandalone: false,
		manifestUrl: null,
		swUrl: null,
		displayMode: "browser",
		userAgent: "",
		canInstall: false,
		isIOS: false,
		isSafari: false,
		isChrome: false,
		isAndroid: false,
	});

	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);

	useEffect(() => {
		const checkPWAStatus = async () => {
			const ua = navigator.userAgent;
			const isIOS = /iPad|iPhone|iPod/.test(ua);
			const isAndroid = /android/i.test(ua);
			const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
			const isChrome = /chrome/i.test(ua) && !/edge/i.test(ua);

			// Check manifest
			const manifestLink = document.querySelector(
				'link[rel="manifest"]'
			) as HTMLLinkElement;
			const manifestUrl = manifestLink?.href || null;

			let manifestLoaded = false;
			if (manifestUrl) {
				try {
					const response = await fetch(manifestUrl);
					manifestLoaded = response.ok;
				} catch (error) {
					console.error("Manifest check failed:", error);
				}
			}

			// Check service worker
			const swRegistration =
				"serviceWorker" in navigator
					? await navigator.serviceWorker.getRegistration()
					: null;
			const serviceWorkerRegistered = !!swRegistration;
			const serviceWorkerActive = !!swRegistration?.active;

			// Check if running as standalone PWA
			const isStandalone =
				window.matchMedia("(display-mode: standalone)").matches ||
				(window.navigator as any).standalone === true;

			// Get display mode
			const displayMode = isStandalone
				? "standalone"
				: window.matchMedia("(display-mode: fullscreen)").matches
					? "fullscreen"
					: window.matchMedia("(display-mode: minimal-ui)").matches
						? "minimal-ui"
						: "browser";

			setStatus({
				manifestLoaded,
				serviceWorkerRegistered,
				serviceWorkerActive,
				isStandalone,
				manifestUrl,
				swUrl: swRegistration?.active?.scriptURL || null,
				displayMode,
				userAgent: navigator.userAgent,
				canInstall: false,
				isIOS,
				isSafari,
				isChrome,
				isAndroid,
			});
		};

		checkPWAStatus();

		// Listen for beforeinstallprompt
		const handler = (e: Event) => {
			console.log("[PWA Status] beforeinstallprompt fired");
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
			setStatus((prev) => ({ ...prev, canInstall: true }));
		};

		window.addEventListener("beforeinstallprompt", handler);

		return () => window.removeEventListener("beforeinstallprompt", handler);
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) {
			alert("Install prompt not available. Try using your browser menu.");
			return;
		}

		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		console.log("[PWA Status] User choice:", outcome);

		if (outcome === "accepted") {
			setDeferredPrompt(null);
			setStatus((prev) => ({ ...prev, canInstall: false }));
		}
	};

	const clearLocalStorage = () => {
		localStorage.removeItem("pwa-install-dismissed");
		localStorage.removeItem("ios-pwa-install-dismissed");
		alert("Local storage cleared! The install prompts should appear again.");
	};

	const StatusRow = ({
		label,
		value,
		status,
	}: {
		label: string;
		value: string;
		status: "success" | "error" | "warning";
	}) => (
		<div className="flex items-start gap-3 py-3 border-b border-outline-variant/10">
			<div className="mt-0.5">
				{status === "success" && (
					<CheckCircle2 className="w-5 h-5 text-green-500" />
				)}
				{status === "error" && <XCircle className="w-5 h-5 text-red-500" />}
				{status === "warning" && (
					<AlertCircle className="w-5 h-5 text-yellow-500" />
				)}
			</div>
			<div className="flex-1">
				<div className="text-sm font-medium text-on-surface">{label}</div>
				<div className="text-sm text-tertiary mt-0.5">{value}</div>
			</div>
		</div>
	);

	const isPWAInstallable =
		status.manifestLoaded && status.serviceWorkerRegistered;

	return (
		<div className="min-h-screen bg-surface p-6">
			<div className="max-w-2xl mx-auto">
				<h1 className="font-serif text-3xl font-semibold text-on-surface mb-2">
					PWA Status
				</h1>
				<p className="text-tertiary mb-8">
					Check if Clarity is properly configured as a Progressive Web App
				</p>

				{/* Overall Status */}
				<div className="bg-surface-container-high rounded-lg p-6 mb-6">
					<div className="flex items-center gap-3 mb-4">
						{isPWAInstallable ? (
							<CheckCircle2 className="w-6 h-6 text-green-500" />
						) : (
							<XCircle className="w-6 h-6 text-red-500" />
						)}
						<h2 className="font-serif text-xl font-semibold text-on-surface">
							{isPWAInstallable
								? "PWA is Installable"
								: "PWA Configuration Issues"}
						</h2>
					</div>
					{!isPWAInstallable && (
						<p className="text-sm text-tertiary">
							Some PWA features are not working. Check the details below.
						</p>
					)}
				</div>

				{/* Detailed Status */}
				<div className="bg-surface-container-high rounded-lg p-6 mb-6">
					<h2 className="font-serif text-lg font-semibold text-on-surface mb-4">
						Configuration Details
					</h2>

					<StatusRow
						label="Web App Manifest"
						value={
							status.manifestLoaded
								? `Loaded from ${status.manifestUrl}`
								: "Not found or failed to load"
						}
						status={status.manifestLoaded ? "success" : "error"}
					/>

					<StatusRow
						label="Service Worker"
						value={
							status.serviceWorkerRegistered
								? `Registered at ${status.swUrl}`
								: "Not registered"
						}
						status={status.serviceWorkerRegistered ? "success" : "error"}
					/>

					<StatusRow
						label="Service Worker State"
						value={status.serviceWorkerActive ? "Active" : "Not active"}
						status={status.serviceWorkerActive ? "success" : "warning"}
					/>

					<StatusRow
						label="Display Mode"
						value={
							status.displayMode === "standalone"
								? "Standalone (PWA installed)"
								: `${status.displayMode} (running in browser)`
						}
						status={status.isStandalone ? "success" : "warning"}
					/>

					<StatusRow
						label="Running as PWA"
						value={status.isStandalone ? "Yes" : "No"}
						status={status.isStandalone ? "success" : "warning"}
					/>

					<StatusRow
						label="Can Show Install Prompt"
						value={status.canInstall ? "Yes (event fired!)" : "No"}
						status={status.canInstall ? "success" : "warning"}
					/>

					<div className="flex items-start gap-3 py-3 border-b border-outline-variant/10">
						<div className="mt-0.5">
							{status.isIOS ? (
								<AlertCircle className="w-5 h-5 text-yellow-500" />
							) : (
								<CheckCircle2 className="w-5 h-5 text-green-500" />
							)}
						</div>
						<div className="flex-1">
							<div className="text-sm font-medium text-on-surface">Platform</div>
							<div className="text-sm text-tertiary mt-0.5">
								iOS: {status.isIOS ? "Yes" : "No"} | Android:{" "}
								{status.isAndroid ? "Yes" : "No"} | Safari:{" "}
								{status.isSafari ? "Yes" : "No"} | Chrome:{" "}
								{status.isChrome ? "Yes" : "No"}
							</div>
						</div>
					</div>
				</div>

				{/* Browser Info */}
				<div className="bg-surface-container-high rounded-lg p-6 mb-6">
					<h2 className="font-serif text-lg font-semibold text-on-surface mb-4">
						Browser Information
					</h2>
					<div className="text-sm text-tertiary break-all">
						{status.userAgent}
					</div>
				</div>

				{/* Manual Install Button */}
				<div className="bg-surface-container-high rounded-lg p-6 mb-6">
					<h2 className="font-serif text-lg font-semibold text-on-surface mb-4">
						Manual Installation
					</h2>

					{status.isStandalone ? (
						<div className="flex items-center gap-2 text-sm text-green-500">
							<CheckCircle2 className="w-4 h-4" />
							Already installed as PWA!
						</div>
					) : (
						<div className="space-y-3">
							{status.canInstall ? (
								<button
									onClick={handleInstall}
									className="w-full flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3 text-sm font-medium text-on-primary-container transition-opacity hover:opacity-90"
								>
									<Download className="w-4 h-4" />
									Install Clarity Now
								</button>
							) : (
								<div className="p-4 rounded-lg bg-surface-container text-sm text-tertiary">
									{status.isIOS ? (
										<>
											<p className="mb-2">
												iOS doesn&apos;t support automatic install prompts.
											</p>
											<p>
												Tap the Share button{" "}
												<span className="inline-block">↑</span> and select
												&quot;Add to Home Screen&quot;
											</p>
										</>
									) : status.isChrome && status.isAndroid ? (
										<>
											<p className="mb-2">
												No install prompt available yet. This could mean:
											</p>
											<ul className="list-disc list-inside space-y-1 ml-2">
												<li>You need to interact more with the site first</li>
												<li>
													The browser hasn&apos;t checked PWA criteria yet
												</li>
												<li>Check your browser menu for &quot;Install app&quot;</li>
											</ul>
										</>
									) : (
										<>
											<p>
												Use your browser&apos;s menu to install this app. Look
												for:
											</p>
											<ul className="list-disc list-inside space-y-1 ml-2 mt-2">
												<li>&quot;Install app&quot;</li>
												<li>&quot;Add to Home screen&quot;</li>
												<li>&quot;Create shortcut&quot;</li>
											</ul>
										</>
									)}
								</div>
							)}

							<button
								onClick={clearLocalStorage}
								className="w-full rounded-full border border-outline-variant/20 px-6 py-2 text-sm font-medium text-tertiary transition-opacity hover:opacity-90"
							>
								Clear Dismissed Prompts
							</button>
						</div>
					)}
				</div>

				{/* Installation Instructions */}
				<div className="bg-surface-container-high rounded-lg p-6">
					<h2 className="font-serif text-lg font-semibold text-on-surface mb-4">
						Installation Instructions
					</h2>

					<div className="space-y-4 text-sm text-tertiary">
						<div>
							<h3 className="font-medium text-on-surface mb-2">
								iOS (Safari)
							</h3>
							<ol className="list-decimal list-inside space-y-1 ml-2">
								<li>Tap the Share button (square with arrow pointing up)</li>
								<li>Scroll down and tap "Add to Home Screen"</li>
								<li>Tap "Add" in the top-right corner</li>
							</ol>
						</div>

						<div>
							<h3 className="font-medium text-on-surface mb-2">
								Android (Chrome)
							</h3>
							<ol className="list-decimal list-inside space-y-1 ml-2">
								<li>Tap the menu (three dots) in the top-right</li>
								<li>Tap "Add to Home screen" or "Install app"</li>
								<li>Tap "Add" or "Install"</li>
							</ol>
						</div>

						<div>
							<h3 className="font-medium text-on-surface mb-2">
								Desktop (Chrome/Edge)
							</h3>
							<ol className="list-decimal list-inside space-y-1 ml-2">
								<li>
									Look for the install icon in the address bar (monitor with
									down arrow)
								</li>
								<li>Click the icon and then click "Install"</li>
								<li>
									Or go to menu → "Save and share" → "Install Clarity" (or
									"Create shortcut")
								</li>
							</ol>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
