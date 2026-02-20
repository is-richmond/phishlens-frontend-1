"use client";

import Link from "next/link";
import {
	FileText,
	Zap,
	BookTemplate,
	FolderKanban,
	ArrowRight,
} from "lucide-react";

interface QuickAction {
	label: string;
	description: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
}

const ACTIONS: QuickAction[] = [
	{
		label: "New Scenario",
		description: "Configure a phishing simulation",
		href: "/scenarios?new=1",
		icon: FileText,
		color:
			"bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400",
	},
	{
		label: "Quick Generate",
		description: "Generate with default settings",
		href: "/generate",
		icon: Zap,
		color:
			"bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400",
	},
	{
		label: "View Templates",
		description: "Browse template library",
		href: "/templates",
		icon: BookTemplate,
		color:
			"bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400",
	},
	{
		label: "Campaigns",
		description: "Manage generation campaigns",
		href: "/campaigns",
		icon: FolderKanban,
		color:
			"bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400",
	},
];

/**
 * Quick actions panel for the dashboard.
 * Provides one-click navigation to common workflows.
 */
export function QuickActions() {
	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'>
			<div className='p-5 border-b border-slate-200 dark:border-slate-700'>
				<h2 className='text-base font-semibold text-slate-900 dark:text-white'>
					Quick Actions
				</h2>
			</div>
			<div className='p-3 space-y-1'>
				{ACTIONS.map((action) => (
					<Link
						key={action.href}
						href={action.href}
						className='flex items-center gap-3 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group'
					>
						<div className={`rounded-lg p-2 ${action.color}`}>
							<action.icon className='w-4 h-4' />
						</div>
						<div className='flex-1 min-w-0'>
							<p className='text-sm font-medium text-slate-900 dark:text-white'>
								{action.label}
							</p>
							<p className='text-xs text-slate-400 dark:text-slate-500'>
								{action.description}
							</p>
						</div>
						<ArrowRight className='w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors' />
					</Link>
				))}
			</div>
		</div>
	);
}
