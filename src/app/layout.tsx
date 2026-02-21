import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
			<body
				className={`${inter.variable} font-sans min-h-screen bg-slate-50 dark:bg-slate-900 antialiased`}
			>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
