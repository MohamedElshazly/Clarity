"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("dark");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem("clarity-theme") as Theme | null;
		const initialTheme = stored === "light" || stored === "dark" ? stored : "dark";
		setTheme(initialTheme);
		document.documentElement.classList.toggle("dark", initialTheme === "dark");
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		localStorage.setItem("clarity-theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

	// Prevent flash of wrong theme
	if (!mounted) {
		return (
			<>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								const theme = localStorage.getItem('clarity-theme') || 'dark';
								if (theme === 'dark') {
									document.documentElement.classList.add('dark');
								} else {
									document.documentElement.classList.remove('dark');
								}
							})();
						`,
					}}
				/>
				{children}
			</>
		);
	}

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
}
