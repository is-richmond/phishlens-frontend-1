"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
	{
		id: "light" as const,
		label: "Light",
		desc: "Bright background with dark text",
	},
	{
		id: "dark" as const,
		label: "Dark",
		desc: "Dark background with light text",
	},
	{
		id: "system" as const,
		label: "System",
		desc: "Follow your OS preference",
	},
] as const;

/**
 * Theme picker card — lets the user switch between light, dark and system themes.
 */
export default function AppearanceSettings() {
	const { theme, setTheme } = useTheme();

	return (
		<div className='bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6'>
			<h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
				Appearance
			</h2>
			<p className='text-sm text-slate-500 dark:text-slate-400 mb-6'>
				Choose how PhishLens looks to you.
			</p>

			<div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
				{THEME_OPTIONS.map((option) => (
					<button
						key={option.id}
						onClick={() => setTheme(option.id)}
						className={cn(
							"flex flex-col items-start p-4 rounded-xl border-2 transition-colors text-left",
							theme === option.id
								? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
								: "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
						)}
					>
						{/* Mini preview */}
						<div
							className={cn(
								"w-full h-16 rounded-lg mb-3 border",
								option.id === "light"
									? "bg-white border-slate-200"
									: option.id === "dark"
										? "bg-slate-800 border-slate-600"
										: "bg-gradient-to-r from-white to-slate-800 border-slate-300",
							)}
						/>
						<span
							className={cn(
								"text-sm font-medium",
								theme === option.id
									? "text-primary-700 dark:text-primary-400"
									: "text-slate-700 dark:text-slate-300",
							)}
						>
							{option.label}
						</span>
						<span className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
							{option.desc}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}
