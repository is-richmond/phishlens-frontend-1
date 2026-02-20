"use client";

import { FolderKanban, BarChart3, Hash, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, getScoreColor } from "@/lib/utils";
import type { Campaign } from "@/types";

/* ────────────────────────────────────────────────────────────
   CampaignCard — Campaign summary card for list view
   ──────────────────────────────────────────────────────────── */

interface CampaignCardProps {
	campaign: Campaign & {
		total_generations?: number;
		average_score?: number | null;
	};
	onView: (campaign: Campaign) => void;
	onDelete: (campaign: Campaign) => void;
}

export function CampaignCard({
	campaign,
	onView,
	onDelete,
}: CampaignCardProps) {
	const genCount = campaign.total_generations ?? 0;
	const avgScore = campaign.average_score ?? null;

	return (
		<div className='group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors overflow-hidden'>
			{/* Header */}
			<div className='px-5 pt-5 pb-3'>
				<div className='flex items-start justify-between'>
					<div className='flex items-center gap-3 min-w-0'>
						<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10 shrink-0'>
							<FolderKanban className='h-5 w-5 text-primary-600 dark:text-primary-400' />
						</div>
						<div className='min-w-0'>
							<h3 className='text-sm font-semibold text-slate-900 dark:text-white truncate'>
								{campaign.name}
							</h3>
							<p className='text-[10px] text-slate-400 dark:text-slate-500 mt-0.5'>
								Created {formatDate(campaign.created_at)}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Description */}
			<div className='px-5 pb-3'>
				<p className='text-xs text-slate-500 dark:text-slate-400 line-clamp-2'>
					{campaign.description || "No description"}
				</p>
			</div>

			{/* Stats row */}
			<div className='px-5 pb-3 flex items-center gap-4'>
				<div className='flex items-center gap-1.5'>
					<Hash className='h-3.5 w-3.5 text-slate-400' />
					<span className='text-xs font-medium text-slate-600 dark:text-slate-300'>
						{genCount}
					</span>
					<span className='text-[10px] text-slate-400'>generations</span>
				</div>
				{avgScore !== null && (
					<div className='flex items-center gap-1.5'>
						<BarChart3 className='h-3.5 w-3.5 text-slate-400' />
						<span
							className={cn(
								"text-xs font-bold tabular-nums",
								getScoreColor(avgScore),
							)}
						>
							{avgScore.toFixed(1)}
						</span>
						<span className='text-[10px] text-slate-400'>avg score</span>
					</div>
				)}
				<div className='flex items-center gap-1.5 ml-auto'>
					<Calendar className='h-3 w-3 text-slate-400' />
					<span className='text-[10px] text-slate-400'>
						{formatDate(campaign.updated_at)}
					</span>
				</div>
			</div>

			{/* Actions */}
			<div className='flex items-center border-t border-slate-100 dark:border-slate-700/50'>
				<button
					type='button'
					onClick={() => onView(campaign)}
					className='flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-colors'
				>
					View Details
				</button>
				<div className='w-px h-6 bg-slate-100 dark:bg-slate-700/50' />
				<button
					type='button'
					onClick={() => onDelete(campaign)}
					className='flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-danger-50 dark:hover:bg-danger-500/5 hover:text-danger-600 dark:hover:text-danger-400 transition-colors'
				>
					Delete
				</button>
			</div>
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   CampaignCardSkeleton
   ──────────────────────────────────────────────────────────── */

export function CampaignCardSkeleton() {
	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden animate-pulse'>
			<div className='px-5 pt-5 pb-3 flex items-center gap-3'>
				<div className='h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700' />
				<div className='flex-1 space-y-1.5'>
					<div className='h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded' />
					<div className='h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded' />
				</div>
			</div>
			<div className='px-5 pb-3'>
				<div className='h-3 w-full bg-slate-200 dark:bg-slate-700 rounded' />
			</div>
			<div className='px-5 pb-3 flex gap-4'>
				<div className='h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded' />
			</div>
			<div className='h-10 border-t border-slate-100 dark:border-slate-700/50' />
		</div>
	);
}
