import type { Metadata } from "next";
import { Noto_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const notoSerif = Noto_Serif({
	variable: "--font-noto-serif",
	subsets: ["latin"],
	display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
	variable: "--font-plus-jakarta",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Clarity — CBT Thought Record Journal",
	description:
		"A private space to observe your thoughts, challenge distortions, and find balance.",
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "Clarity",
	},
	formatDetection: {
		telephone: false,
	},
	themeColor: [
		{ media: "(prefers-color-scheme: dark)", color: "#0f1413" },
		{ media: "(prefers-color-scheme: light)", color: "#0f1413" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${notoSerif.variable} ${plusJakarta.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<head>
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/iphone5.png"
					media="(device-width: 320px) and (device-height: 568px)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/iphone6.png"
					media="(device-width: 375px) and (device-height: 667px)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/iphonex.png"
					media="(device-width: 375px) and (device-height: 812px)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/iphone14pro.png"
					media="(device-width: 393px) and (device-height: 852px)"
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								const theme = localStorage.getItem('clarity-theme') || 'dark';
								document.documentElement.classList.add(theme);
							})();
						`,
					}}
				/>
			</head>
			<body className="min-h-full" suppressHydrationWarning>
				<ThemeProvider>
					<QueryProvider>{children}</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
