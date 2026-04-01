"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/record/new", label: "New" },
  { href: "/records", label: "Records" },
  { href: "/library", label: "Library" },
  { href: "/insights", label: "Insights" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t px-2 py-2 md:hidden"
      style={{
        backgroundColor: "var(--surface-container-low)",
        borderColor: "color-mix(in srgb, var(--outline-variant) 15%, transparent)",
      }}
    >
      {navItems.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs"
            style={{
              color: isActive ? "var(--ms-primary)" : "var(--tertiary)",
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
