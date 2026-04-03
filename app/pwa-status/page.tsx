"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface PWAStatus {
	manifestLoaded: boolean;
	serviceWorkerRegistered: boolean;
	serviceWorkerActive: boolean;
	isStandalone: boolean;
	manifestUrl: string | null;
	swUrl: string | null;
	displayMode: string;
	userAgent: string;
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
	});

	useEffect(() => {
		const checkPWAStatus = async () => {
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
			});
		};

		checkPWAStatus();
	}, []);

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
