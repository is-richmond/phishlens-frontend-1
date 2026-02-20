"use client";

import { ScoreGauge, ScoreGaugeSkeleton } from "./ScoreGauge";
import {
	DimensionalScoresPanel,
	DimensionalScoresSkeleton,
} from "./DimensionalScores";
import { EmailPreview, EmailPreviewSkeleton } from "./EmailPreview";
import { AnalysisPanel, AnalysisPanelSkeleton } from "./AnalysisPanel";
import { GenerationActions } from "./GenerationActions";
import type { Generation, Scenario } from "@/types";

/* ────────────────────────────────────────────────────────────
   GenerationResult — Two-panel layout
   Left (60%): email preview (message)
   Right (40%): evaluation (score gauge, dimensional, analysis)
   ──────────────────────────────────────────────────────────── */

interface GenerationResultProps {
	generation: Generation;
	scenario: Scenario | null;
	onRegenerate: (params: {
		temperature?: number;
		max_tokens?: number;
		model_variant?: string;
	}) => void;
	onAddToCampaign: () => void;
	isRegenerating?: boolean;
}

export function GenerationResult({
	generation,
	scenario,
	onRegenerate,
	onAddToCampaign,
	isRegenerating = false,
}: GenerationResultProps) {
	return (
		<div className='space-y-5'>
			{/* Action bar */}
			<GenerationActions
				generation={generation}
				onRegenerate={onRegenerate}
				onAddToCampaign={onAddToCampaign}
				isRegenerating={isRegenerating}
			/>

			{/* Two-panel layout */}
			<div className='grid grid-cols-1 lg:grid-cols-5 gap-5'>
				{/* Left panel — 60% (3/5) — Message preview */}
				<div className='lg:col-span-3'>
					<EmailPreview generation={generation} scenario={scenario} />
				</div>

				{/* Right panel — 40% (2/5) — Evaluation */}
				<div className='lg:col-span-2 space-y-5'>
					{/* Score gauge */}
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5'>
						<h3 className='text-sm font-semibold text-slate-900 dark:text-white mb-4 text-center'>
							Realism Score
						</h3>
						<ScoreGauge
							score={generation.overall_score}
							label='Overall realism assessment'
						/>
					</div>

					{/* Dimensional scores */}
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5'>
						<DimensionalScoresPanel scores={generation.dimensional_scores} />
					</div>

					{/* Analysis */}
					<AnalysisPanel analysis={generation.evaluation_analysis} />
				</div>
			</div>
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   GenerationResultSkeleton
   ──────────────────────────────────────────────────────────── */

export function GenerationResultSkeleton() {
	return (
		<div className='space-y-5'>
			{/* Action bar skeleton */}
			<div className='flex gap-2 animate-pulse'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className='h-9 w-28 rounded-lg bg-slate-200 dark:bg-slate-700'
					/>
				))}
			</div>

			{/* Two-panel skeleton */}
			<div className='grid grid-cols-1 lg:grid-cols-5 gap-5'>
				<div className='lg:col-span-3'>
					<EmailPreviewSkeleton />
				</div>
				<div className='lg:col-span-2 space-y-5'>
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5'>
						<ScoreGaugeSkeleton />
					</div>
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5'>
						<DimensionalScoresSkeleton />
					</div>
					<AnalysisPanelSkeleton />
				</div>
			</div>
		</div>
	);
}
