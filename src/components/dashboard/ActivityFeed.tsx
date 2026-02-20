"use client";

import { formatDateTime } from "@/lib/utils";
import type { AuditLog } from "@/types";
import {
	LogIn,
	LogOut,
	UserPlus,
	Zap,
	FileText,
	Trash2,
	Edit,
	Shield,
	Activity,
} from "lucide-react";
import type { ComponentType } from "react";

/** Map action_type strings to icons and colors */
const ACTION_CONFIG: Record<
	string,
	{ icon: ComponentType<{ className?: string }>; color: string; label: string }
> = {
	login: {
		icon: LogIn,
		color: "text-primary-500",
		label: "User logged in",
	},
	logout: {
		icon: LogOut,
		color: "text-slate-400",
		label: "User logged out",
	},
	register: {
		icon: UserPlus,
		color: "text-success-500",
		label: "New user registered",
	},
	generation_create: {
		icon: Zap,
		color: "text-warning-500",
		label: "Generation created",
	},
	scenario_create: {
		icon: FileText,
		color: "text-primary-500",
		label: "Scenario created",
	},
	scenario_update: {
		icon: Edit,
		color: "text-primary-400",
		label: "Scenario updated",
	},
	scenario_delete: {
		icon: Trash2,
		color: "text-danger-500",
		label: "Scenario deleted",
	},
	user_suspend: {
		icon: Shield,
		color: "text-danger-500",
		label: "User suspended",
	},
	user_reactivate: {
		icon: Shield,
		color: "text-success-500",
		label: "User reactivated",
	},
};

const DEFAULT_CONFIG = {
	icon: Activity,
	color: "text-slate-400",
	label: "System event",
};

interface ActivityFeedProps {
	logs: AuditLog[];
	isLoading: boolean;
}

/**
 * Activity feed for the dashboard.
 * Displays recent audit log events with icons and timestamps.
 */
export function ActivityFeed({ logs, isLoading }: ActivityFeedProps) {
	if (isLoading) {
		return (
			<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'>
				<div className='p-5 border-b border-slate-200 dark:border-slate-700'>
					<h2 className='text-base font-semibold text-slate-900 dark:text-white'>
						Recent Activity
					</h2>
				</div>
				<div className='p-4 space-y-4'>
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className='flex items-start gap-3 animate-pulse'>
							<div className='w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700' />
							<div className='flex-1 space-y-1.5'>
								<div className='h-3.5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded' />
								<div className='h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded' />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (logs.length === 0) {
		return (
			<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'>
				<div className='p-5 border-b border-slate-200 dark:border-slate-700'>
					<h2 className='text-base font-semibold text-slate-900 dark:text-white'>
						Recent Activity
					</h2>
				</div>
				<div className='p-8 text-center'>
					<Activity className='w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600' />
					<p className='text-sm text-slate-500 dark:text-slate-400'>
						No activity yet
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'>
			<div className='p-5 border-b border-slate-200 dark:border-slate-700'>
				<h2 className='text-base font-semibold text-slate-900 dark:text-white'>
					Recent Activity
				</h2>
			</div>
			<div className='divide-y divide-slate-100 dark:divide-slate-700/50'>
				{logs.map((log) => {
					const config = ACTION_CONFIG[log.action_type] || DEFAULT_CONFIG;
					const Icon = config.icon;
					const label =
						ACTION_CONFIG[log.action_type]?.label ||
						log.action_type.replace(/_/g, " ");

					return (
						<div key={log.id} className='flex items-start gap-3 p-4'>
							<div
								className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700/50 ${config.color}`}
							>
								<Icon className='w-4 h-4' />
							</div>
							<div className='flex-1 min-w-0'>
								<p className='text-sm text-slate-700 dark:text-slate-300'>
									{label}
									{log.resource_type && (
										<span className='text-slate-400 dark:text-slate-500'>
											{" "}
											· {log.resource_type}
										</span>
									)}
								</p>
								<p className='text-xs text-slate-400 dark:text-slate-500 mt-0.5'>
									{formatDateTime(log.created_at)}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
