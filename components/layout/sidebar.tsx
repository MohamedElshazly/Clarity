"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	Home,
	PenLine,
	History,
	BookOpen,
	TrendingUp,
	Plus,
	Moon,
	LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Profile } from "@/lib/types/database";

const navItems = [
	{ href: "/", label: "Home", icon: Home },
	{ href: "/record/new", label: "New Record", icon: PenLine },
	{ href: "/records", label: "My Records", icon: History },
	{ href: "/library", label: "Thought Library", icon: BookOpen },
	{ href: "/insights", label: "Insights", icon: TrendingUp },
];

export function Sidebar({ profile }: { profile: Profile | null }) {
	const pathname = usePathname();
	const router = useRouter();

	async function handleLogout() {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/login");
	}

	const initials = profile?.full_name
		? profile.full_name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.slice(0, 2)
			.toUpperCase()
		: "U";

	return (
		<aside
			className="fixed inset-y-0 left-0 z-40 flex flex-col w-55"
			style={{ backgroundColor: "var(--surface-container-low)" }}
		>
			{/* Wordmark */}
			<div className="px-6 pt-8 pb-6">
				<p
					className="font-serif text-[22px] leading-tight"
					style={{ color: "var(--on-surface)" }}
				>
					Clarity
				</p>
				<p className="mt-1 text-[12px]" style={{ color: "var(--tertiary)" }}>
					Your space to think clearly.
				</p>
			</div>

			{/* Nav */}
			<nav className="flex flex-col gap-0.5 px-3">
				{navItems.map(({ href, label, icon: Icon }) => {
					const isActive = pathname === href;
					return (
						<Link
							key={href}
							href={href}
							className="relative flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-opacity hover:opacity-80"
							style={{
								color: isActive ? "var(--ms-primary)" : "var(--tertiary)",
							}}
						>
							{isActive && (
								<span
									className="absolute left-0 inset-y-1 w-0.5 rounded-r-full"
									style={{ backgroundColor: "var(--primary-container)" }}
								/>
							)}
							<Icon
								size={16}
								style={{
									color: isActive ? "var(--ms-primary)" : "var(--tertiary)",
									flexShrink: 0,
								}}
							/>
							{label}
						</Link>
					);
				})}
			</nav>

			<div className="flex-1" />

			{/* Bottom section */}
			<div className="px-3 pb-8 flex flex-col gap-2">
				{/* Start New Session */}
				<Link
					href="/record/new"
					className="clarity-btn-primary flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium mb-2"
				>
					<Plus size={15} />
					Start New Session
				</Link>

				{/* User info */}
				{profile && (
					<div className="flex items-center gap-2.5 px-2 py-1.5">
						<Avatar size="sm">
							{profile.avatar_url && (
								<AvatarImage
									src={profile.avatar_url}
									alt={profile.full_name ?? "User"}
								/>
							)}
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<p
								className="text-xs font-medium truncate"
								style={{ color: "var(--on-surface)" }}
							>
								{profile.full_name ?? profile.email ?? "User"}
							</p>
							<p
								className="text-[10px] capitalize"
								style={{ color: "var(--tertiary)" }}
							>
								{profile.plan}
							</p>
						</div>
					</div>
				)}

				{/* Theme toggle (no-op) */}
				<button
					type="button"
					className="flex items-center gap-2.5 px-2 py-1.5 text-xs w-full text-left rounded-sm transition-opacity hover:opacity-70"
					style={{ color: "var(--tertiary)" }}
				>
					<Moon size={14} />
					Theme Mode
				</button>

				{/* Logout */}
				<button
					type="button"
					onClick={handleLogout}
					className="flex items-center gap-2.5 px-2 py-1.5 text-xs w-full text-left rounded-sm transition-opacity hover:opacity-70"
					style={{ color: "var(--tertiary)" }}
				>
					<LogOut size={14} />
					Log out
				</button>
			</div>
		</aside>
	);
}
