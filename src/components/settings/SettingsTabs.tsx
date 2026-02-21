"use client";

import { User as UserIcon, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsTab = "profile" | "appearance";

interface SettingsTabsProps {
	activeTab: SettingsTab;
	onChange: (tab: SettingsTab) => void;
}

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
	{ id: "profile", label: "Profile", icon: UserIcon },
	{ id: "appearance", label: "Appearance", icon: Palette },
];

/**
 * Sidebar / horizontal tab strip for the settings page.
 */
export default function SettingsTabs({
	activeTab,
	onChange,
}: SettingsTabsProps) {
	return (
		<nav className='md:w-56 shrink-0'>
			<ul className='flex md:flex-col gap-1'>
				{TABS.map((tab) => (
					<li key={tab.id}>
						<button
							onClick={() => onChange(tab.id)}
							className={cn(
								"flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
								activeTab === tab.id
									? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
									: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50",
							)}
						>
							<tab.icon className='w-4 h-4 shrink-0' />
							{tab.label}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
}
