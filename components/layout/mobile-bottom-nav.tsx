"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PenLine, History, BookOpen, TrendingUp } from "lucide-react";

const navItems = [
	{ href: "/", label: "Home", icon: Home },
	{ href: "/record/new", label: "New", icon: PenLine },
	{ href: "/records", label: "Records", icon: History },
	{ href: "/library", label: "Library", icon: BookOpen },
	{ href: "/insights", label: "Insights", icon: TrendingUp },
];

export function MobileBottomNav() {
	const pathname = usePathname();

	return (
		<nav
			className="md:hidden fixed bottom-0 inset-x-0 z-50 flex items-center justify-around px-2 py-3 border-t"
			style={{
				backgroundColor: "var(--background)",
				borderTopColor: "var(--outline)",
			}}
		>
			{navItems.map(({ href, label, icon: Icon }) => {
				const isActive =
					href === "/"
						? pathname === href
						: pathname.startsWith(href);

				return (
					<Link
						key={href}
						href={href}
						className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300"
						aria-label={label}
						style={{
							color: isActive ? "var(--ms-primary)" : "var(--on-surface-variant)",
						}}
					>
						<Icon
							size={22}
							strokeWidth={isActive ? 2.5 : 2}
							style={{
								color: isActive ? "var(--ms-primary)" : "var(--on-surface-variant)",
							}}
						/>
					</Link>
				);
			})}
		</nav>
	);
}
