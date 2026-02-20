"use client";

import { useState, useMemo } from "react";
import {
	ArrowLeft,
	Download,
	Trash2,
	Check,
	BarChart3,
	Eye,
	X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatDateTime, getScoreColor, formatCategory, truncate } from "@/lib/utils";
import { api } from "@/lib/api";
import { useCampaign } from "@/lib/hooks";
import { Button, Alert } from "@/components/ui/FormElements";
import { CampaignStats } from "./CampaignStats";
import { ExportDialog } from "./ExportDialog";
import type { Generation } from "@/types";

/* ────────────────────────────────────────────────────────────
   CampaignDetailView — Full campaign detail with gen table
   Multi-select, export, remove generations, stats charts
   ──────────────────────────────────────────────────────────── */

interface CampaignDetailViewProps {
	campaignId: string;
	onBack: () => void;
}

export function CampaignDetailView({
	campaignId,
	onBack,
}: CampaignDetailViewProps) {
	const { data: campaign, isLoading, mutate } = useCampaign(campaignId);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [showExport, setShowExport] = useState(false);
	const [showStats, setShowStats] = useState(true);
	const [removing, setRemoving] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const generations = campaign?.generations ?? [];

	const allSelected =
		generations.length > 0 && selectedIds.size === generations.length;

	const toggleSelect = (id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const toggleAll = () => {
		if (allSelected) {
			setSelectedIds(new Set());
		} else {
			setSelectedIds(new Set(generations.map((g) => g.id)));
		}
	};

	const handleRemove = async (generationId: string) => {
		setRemoving(generationId);
		setError(null);
		try {
			await api.delete(
				`/v1/campaigns/${campaignId}/generations/${generationId}`,
			);
			setSelectedIds((prev) => {
				const next = new Set(prev);
				next.delete(generationId);
				return next;
			});
			mutate();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to remove");
		} finally {
			setRemoving(null);
		}
	};

	const handleExportSelected = () => {
		if (selectedIds.size > 0) {
			setShowExport(true);
		}
	};

	if (isLoading) {
		return <CampaignDetailSkeleton onBack={onBack} />;
	}

	if (!campaign) {
		return (
			<div className='text-center py-12'>
				<p className='text-sm text-slate-500'>Campaign not found</p>
				<Button variant='outline' onClick={onBack} className='mt-3 text-xs'>
					<ArrowLeft className='h-3.5 w-3.5' />
					Back to Campaigns
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-5'>
			{/* Header */}
			<div className='flex items-start justify-between'>
				<div>
					<button
						type='button'
						onClick={onBack}
						className='inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-2 transition-colors'
					>
						<ArrowLeft className='h-3.5 w-3.5' />
						Back to Campaigns
					</button>
					<h2 className='text-xl font-bold text-slate-900 dark:text-white'>
						{campaign.name}
					</h2>
					{campaign.description && (
						<p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
							{campaign.description}
						</p>
					)}
					<div className='flex items-center gap-4 mt-2 text-xs text-slate-400'>
						<span>{campaign.total_generations} generations</span>
						{campaign.average_score !== null && (
							<span className={getScoreColor(campaign.average_score)}>
								Avg: {campaign.average_score.toFixed(1)}
							</span>
						)}
						<span>Created {formatDate(campaign.created_at)}</span>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						onClick={() => setShowStats(!showStats)}
						className='text-xs'
					>
						<BarChart3 className='h-3.5 w-3.5' />
						{showStats ? "Hide" : "Show"} Stats
					</Button>
				</div>
			</div>

			{error && <Alert variant='error'>{error}</Alert>}

			{/* Statistics */}
			{showStats && <CampaignStats campaignId={campaignId} />}

			{/* Toolbar */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<span className='text-xs text-slate-500 dark:text-slate-400'>
						{selectedIds.size > 0
							? `${selectedIds.size} selected`
							: `${generations.length} generations`}
					</span>
				</div>
				<div className='flex items-center gap-2'>
					{selectedIds.size > 0 && (
						<Button
							variant='outline'
							onClick={handleExportSelected}
							className='text-xs'
						>
							<Download className='h-3.5 w-3.5' />
							Export ({selectedIds.size})
						</Button>
					)}
				</div>
			</div>

			{/* Generations table */}
			{generations.length > 0 ? (
				<div className='rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700'>
									<th className='w-10 px-3 py-3'>
										<input
											type='checkbox'
											checked={allSelected}
											onChange={toggleAll}
											className='h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500/30'
										/>
									</th>
									<th className='px-3 py-3 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
										Subject / Preview
									</th>
									<th className='px-3 py-3 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
										Model
									</th>
									<th className='px-3 py-3 text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
										Score
									</th>
									<th className='px-3 py-3 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
										Created
									</th>
									<th className='px-3 py-3 text-right text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-slate-100 dark:divide-slate-700/50'>
								{generations.map((gen) => (
									<GenerationRow
										key={gen.id}
										generation={gen}
										selected={selectedIds.has(gen.id)}
										onToggle={() => toggleSelect(gen.id)}
										onRemove={() => handleRemove(gen.id)}
										isRemoving={removing === gen.id}
									/>
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				<div className='text-center py-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'>
					<p className='text-sm text-slate-500 dark:text-slate-400'>
						No generations in this campaign yet
					</p>
					<p className='text-xs text-slate-400 dark:text-slate-500 mt-1'>
						Add generations from the Generate page
					</p>
				</div>
			)}

			{/* Export Dialog */}
			{showExport && (
				<ExportDialog
					generationIds={Array.from(selectedIds)}
					onClose={() => setShowExport(false)}
				/>
			)}
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   GenerationRow — table row for a generation
   ──────────────────────────────────────────────────────────── */

function GenerationRow({
	generation,
	selected,
	onToggle,
	onRemove,
	isRemoving,
}: {
	generation: Generation;
	selected: boolean;
	onToggle: () => void;
	onRemove: () => void;
	isRemoving: boolean;
}) {
	return (
		<tr
			className={cn(
				"transition-colors",
				selected
					? "bg-primary-50/50 dark:bg-primary-500/5"
					: "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50",
			)}
		>
			<td className='px-3 py-3'>
				<input
					type='checkbox'
					checked={selected}
					onChange={onToggle}
					className='h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500/30'
				/>
			</td>
			<td className='px-3 py-3'>
				{generation.generated_subject && (
					<p className='text-xs font-medium text-slate-900 dark:text-white truncate max-w-xs'>
						{generation.generated_subject}
					</p>
				)}
				<p className='text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs'>
					{truncate(generation.generated_text, 80)}
				</p>
			</td>
			<td className='px-3 py-3'>
				<span className='text-xs text-slate-600 dark:text-slate-400 font-mono'>
					{generation.model_used}
				</span>
			</td>
			<td className='px-3 py-3 text-center'>
				{generation.overall_score !== null ? (
					<span
						className={cn(
							"text-sm font-bold tabular-nums",
							getScoreColor(generation.overall_score),
						)}
					>
						{generation.overall_score.toFixed(1)}
					</span>
				) : (
					<span className='text-xs text-slate-400'>—</span>
				)}
			</td>
			<td className='px-3 py-3'>
				<span className='text-xs text-slate-500 dark:text-slate-400'>
					{formatDate(generation.created_at)}
				</span>
			</td>
			<td className='px-3 py-3'>
				<div className='flex items-center justify-end gap-1'>
					<button
						type='button'
						onClick={onRemove}
						disabled={isRemoving}
						className='inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:bg-danger-50 dark:hover:bg-danger-500/5 hover:text-danger-600 dark:hover:text-danger-400 transition-colors disabled:opacity-50'
						title='Remove from campaign'
					>
						<Trash2 className='h-3 w-3' />
						Remove
					</button>
				</div>
			</td>
		</tr>
	);
}

/* ────────────────────────────────────────────────────────────
   CampaignDetailSkeleton
   ──────────────────────────────────────────────────────────── */

function CampaignDetailSkeleton({ onBack }: { onBack: () => void }) {
	return (
		<div className='space-y-5 animate-pulse'>
			<div>
				<button
					type='button'
					onClick={onBack}
					className='inline-flex items-center gap-1 text-xs text-slate-500 mb-2'
				>
					<ArrowLeft className='h-3.5 w-3.5' />
					Back
				</button>
				<div className='h-6 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-2' />
				<div className='h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded' />
			</div>
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className='rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 h-16'
					/>
				))}
			</div>
			<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-64' />
		</div>
	);
}
