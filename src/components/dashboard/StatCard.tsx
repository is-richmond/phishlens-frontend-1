"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: ReactNode;
	trend?: { value: string; positive: boolean };
	color?: "primary" | "success" | "warning" | "danger";
}

const colorMap = {
	primary:
		"bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400",
	success:
		"bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400",
	warning:
		"bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400",
	danger:
		"bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400",
};

/**
 * Dashboard summary stat card.
 * Displays a metric with icon, value, optional subtitle and trend.
 */
export function StatCard({
	title,
	value,
	subtitle,
	icon,
	trend,
	color = "primary",
}: StatCardProps) {
	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm'>
			<div className='flex items-start justify-between'>
				<div className='space-y-2'>
					<p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
						{title}
					</p>
					<p className='text-3xl font-bold text-slate-900 dark:text-white'>
						{value}
					</p>
					{subtitle && (
						<p className='text-xs text-slate-400 dark:text-slate-500'>
							{subtitle}
						</p>
					)}
					{trend && (
						<p
							className={cn(
								"text-xs font-medium",
								trend.positive
									? "text-success-600 dark:text-success-400"
									: "text-danger-600 dark:text-danger-400",
							)}
						>
							{trend.positive ? "↑" : "↓"} {trend.value}
						</p>
					)}
				</div>
				<div className={cn("rounded-lg p-2.5", colorMap[color])}>{icon}</div>
			</div>
		</div>
	);
}

/** Loading skeleton placeholder for StatCard */
export function StatCardSkeleton() {
	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm animate-pulse'>
			<div className='flex items-start justify-between'>
				<div className='space-y-3'>
					<div className='h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded' />
					<div className='h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded' />
					<div className='h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded' />
				</div>
				<div className='h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg' />
			</div>
		</div>
	);
}
