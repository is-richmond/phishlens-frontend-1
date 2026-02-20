import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "PhishLens — Phishing Research Platform",
	description:
		"Web application for phishing message generation using LLMs for cybersecurity research and awareness training.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className='min-h-screen bg-slate-50 dark:bg-slate-900 antialiased'>
				{children}
			</body>
		</html>
	);
}
