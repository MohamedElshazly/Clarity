"use client";

import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { useUserWithProfile } from "@/hooks/use-user";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const { data: userWithProfile, isLoading } = useUserWithProfile();

	if (!userWithProfile) {
		if (!isLoading) {
			redirect("/login");
		}
		return null;
	}

	const profile = userWithProfile.profile;

	return (
		<div style={{ backgroundColor: "var(--surface)" }}>
			{/* Desktop sidebar — hidden on mobile */}
			<div className="hidden md:block">
				<Sidebar profile={profile} />
			</div>

			{/* Mobile top bar — hidden on desktop */}
			<div
				className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3"
				style={{ backgroundColor: "var(--surface-container-low)" }}
			>
				<MobileNav profile={profile} />
				<span
					className="font-serif text-lg"
					style={{ color: "var(--on-surface)" }}
				>
					Clarity
				</span>
				{/* Balance spacer */}
				<div className="w-8" />
			</div>

			{/* Main content area */}
			<main
				className="min-h-screen md:pl-55 pt-14 md:pt-0 pb-20 md:pb-0"
				style={{ backgroundColor: "var(--surface)" }}
			>
				<div className="px-6 py-8 md:p-22">{children}</div>
			</main>

			{/* Mobile bottom navigation */}
			<MobileBottomNav />
		</div>
	);
}
