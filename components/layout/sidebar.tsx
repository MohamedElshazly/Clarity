"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/record/new", label: "New Record" },
  { href: "/records", label: "Records" },
  { href: "/library", label: "Library" },
  { href: "/insights", label: "Insights" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col w-64 min-h-screen px-4 py-8"
      style={{ backgroundColor: "var(--surface-container-low)" }}
    >
      <div className="mb-10 px-2">
        <span
          className="font-serif text-xl"
          style={{ color: "var(--on-surface)" }}
        >
          Clarity
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="rounded px-3 py-2 text-sm transition-colors"
              style={{
                backgroundColor: isActive
                  ? "var(--surface-container-high)"
                  : "transparent",
                color: isActive
                  ? "var(--on-surface)"
                  : "var(--tertiary)",
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
