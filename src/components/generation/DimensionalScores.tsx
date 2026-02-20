"use client";

import { cn } from "@/lib/utils";
import type { DimensionalScores as DimensionalScoresType } from "@/types";

/* ────────────────────────────────────────────────────────────
   DimensionalScores — 4 horizontal bar charts for sub-scores
   ──────────────────────────────────────────────────────────── */

interface DimensionalScoresProps {
	scores: DimensionalScoresType | null;
}

interface ScoreDimension {
	key: keyof DimensionalScoresType;
	label: string;
	description: string;
}

const DIMENSIONS: ScoreDimension[] = [
	{
		key: "linguistic_naturalness",
		label: "Linguistic Naturalness",
		description: "Grammar, style, and tone quality",
	},
	{
		key: "psychological_triggers",
		label: "Psychological Triggers",
		description: "Urgency, authority, and persuasion",
	},
	{
		key: "technical_plausibility",
		label: "Technical Plausibility",
		description: "Pretext believability and realism",
	},
	{
		key: "contextual_relevance",
		label: "Contextual Relevance",
		description: "Scenario-specific appropriateness",
	},
];

function getBarColor(value: number | null): string {
	if (value === null) return "bg-slate-200 dark:bg-slate-700";
	if (value >= 7) return "bg-success-500";
	if (value >= 4) return "bg-warning-500";
	return "bg-danger-500";
}

function getTextColor(value: number | null): string {
	if (value === null) return "text-slate-400";
	if (value >= 7) return "text-success-600 dark:text-success-400";
	if (value >= 4) return "text-warning-600 dark:text-warning-400";
	return "text-danger-600 dark:text-danger-400";
}

export function DimensionalScoresPanel({ scores }: DimensionalScoresProps) {
	return (
		<div className='space-y-4'>
			<h3 className='text-sm font-semibold text-slate-900 dark:text-white'>
				Dimensional Analysis
			</h3>

			<div className='space-y-3'>
				{DIMENSIONS.map((dim) => {
					const value = scores?.[dim.key] ?? null;
					const percentage = value !== null ? (value / 10) * 100 : 0;

					return (
						<div key={dim.key}>
							{/* Label row */}
							<div className='flex items-center justify-between mb-1'>
								<div>
									<span className='text-xs font-medium text-slate-700 dark:text-slate-300'>
										{dim.label}
									</span>
									<p className='text-[10px] text-slate-400 dark:text-slate-500'>
										{dim.description}
									</p>
								</div>
								<span
									className={cn(
										"text-sm font-bold tabular-nums ml-3",
										getTextColor(value),
									)}
								>
									{value !== null ? value.toFixed(1) : "—"}
								</span>
							</div>

							{/* Bar */}
							<div className='h-2 rounded-full bg-slate-100 dark:bg-slate-700/50 overflow-hidden'>
								<div
									className={cn(
										"h-full rounded-full transition-all duration-1000 ease-out",
										getBarColor(value),
									)}
									style={{ width: `${percentage}%` }}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   Skeleton
   ──────────────────────────────────────────────────────────── */

export function DimensionalScoresSkeleton() {
	return (
		<div className='space-y-4 animate-pulse'>
			<div className='h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded' />
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className='space-y-1'>
					<div className='flex justify-between'>
						<div className='h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded' />
						<div className='h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded' />
					</div>
					<div className='h-2 rounded-full bg-slate-100 dark:bg-slate-700/50' />
				</div>
			))}
		</div>
	);
}
