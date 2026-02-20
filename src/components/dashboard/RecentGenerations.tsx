"use client";

import Link from "next/link";
import { cn, formatDateTime, getScoreColor, truncate } from "@/lib/utils";
import type { Generation } from "@/types";
import { Zap, Clock } from "lucide-react";

interface RecentGenerationsProps {
	generations: Generation[];
	isLoading: boolean;
}

/**
 * Recent generations list for the dashboard.
 * Shows the latest generated phishing messages with score badges.
 */
export function RecentGenerations({
	generations,
	isLoading,
}: RecentGenerationsProps) {
	if (isLoading) {
		return (
			<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'>
				<div className='p-5 border-b border-slate-200 dark:border-slate-700'>
					<h2 className='text-base font-semibold text-slate-900 dark:text-white'>
						Recent Generations
					</h2>
				</div>
				<div className='divide-y divide-slate-100 dark:divide-slate-700/50'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className='p-4 animate-pulse'>
							<div className='flex items-start justify-between gap-3'>
								<div className='flex-1 space-y-2'>
									<div className='h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded' />
									<div className='h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded' />
								</div>
								<div className='h-8 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg' />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (generations.length === 0) {
		return (
			<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'>
				<div className='p-5 border-b border-slate-200 dark:border-slate-700'>
					<h2 className='text-base font-semibold text-slate-900 dark:text-white'>
						Recent Generations
					</h2>
				</div>
				<div className='p-8 text-center'>
					<Zap className='w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600' />
					<p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
						No generations yet
					</p>
					<p className='text-xs text-slate-400 dark:text-slate-500 mt-1'>
						Create a scenario and generate your first phishing simulation.
					</p>
					<Link
						href='/generate'
						className='inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-500'
					>
						Get started →
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'>
			<div className='flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700'>
				<h2 className='text-base font-semibold text-slate-900 dark:text-white'>
					Recent Generations
				</h2>
				<Link
					href='/generate'
					className='text-xs font-medium text-primary-600 hover:text-primary-500'
				>
					View all →
				</Link>
			</div>
			<div className='divide-y divide-slate-100 dark:divide-slate-700/50'>
				{generations.map((gen) => (
					<Link
						key={gen.id}
						href={`/generate/${gen.id}`}
						className='block p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors'
					>
						<div className='flex items-start justify-between gap-3'>
							<div className='flex-1 min-w-0'>
								<p className='text-sm font-medium text-slate-900 dark:text-white truncate'>
									{gen.generated_subject ||
										truncate(gen.generated_text, 60)}
								</p>
								<div className='flex items-center gap-3 mt-1.5'>
									<span className='inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500'>
										<Clock className='w-3 h-3' />
										{formatDateTime(gen.created_at)}
									</span>
									<span className='text-xs text-slate-400 dark:text-slate-500'>
										{gen.model_used}
									</span>
								</div>
							</div>
							{/* Score badge */}
							<div
								className={cn(
									"shrink-0 flex items-center justify-center w-12 h-8 rounded-lg text-sm font-bold",
									gen.overall_score !== null
										? cn(
												getScoreColor(gen.overall_score),
												gen.overall_score >= 7
													? "bg-success-50 dark:bg-success-500/10"
													: gen.overall_score >= 4
														? "bg-warning-50 dark:bg-warning-500/10"
														: "bg-danger-50 dark:bg-danger-500/10",
											)
										: "text-slate-400 bg-slate-100 dark:bg-slate-700",
								)}
							>
								{gen.overall_score !== null
									? gen.overall_score.toFixed(1)
									: "—"}
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
