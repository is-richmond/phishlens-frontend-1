"use client";

import { useState } from "react";
import { Plus, Search, FolderKanban } from "lucide-react";
import { api } from "@/lib/api";
import { useCampaigns } from "@/lib/hooks";
import { Button } from "@/components/ui/FormElements";
import { CampaignCard, CampaignCardSkeleton } from "./CampaignCard";
import { CampaignFormModal } from "./CampaignFormModal";
import type { Campaign } from "@/types";

/* ────────────────────────────────────────────────────────────
   CampaignList — Campaign list with search, create, delete
   ──────────────────────────────────────────────────────────── */

interface CampaignListProps {
	onViewCampaign: (campaign: Campaign) => void;
}

export function CampaignList({ onViewCampaign }: CampaignListProps) {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [showCreate, setShowCreate] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
	const [deleting, setDeleting] = useState(false);

	const { data, isLoading, mutate } = useCampaigns({
		page,
		per_page: 12,
		search: search || undefined,
	});

	const handleDelete = async () => {
		if (!deleteTarget) return;
		setDeleting(true);
		try {
			await api.delete(`/v1/campaigns/${deleteTarget.id}`);
			mutate();
			setDeleteTarget(null);
		} catch {
			// Silent error handling
		} finally {
			setDeleting(false);
		}
	};

	const totalPages = data ? Math.ceil(data.total / 12) : 0;

	return (
		<div>
			{/* Toolbar */}
			<div className='flex items-center justify-between gap-3 mb-5'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
					<input
						type='text'
						placeholder='Search campaigns...'
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
					/>
				</div>
				<Button onClick={() => setShowCreate(true)} className='text-xs'>
					<Plus className='h-4 w-4' />
					New Campaign
				</Button>
			</div>

			{/* Loading */}
			{isLoading && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{Array.from({ length: 6 }).map((_, i) => (
						<CampaignCardSkeleton key={i} />
					))}
				</div>
			)}

			{/* Campaign grid */}
			{data && data.items.length > 0 && (
				<>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{data.items.map((campaign) => (
							<CampaignCard
								key={campaign.id}
								campaign={campaign}
								onView={onViewCampaign}
								onDelete={setDeleteTarget}
							/>
						))}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className='flex items-center justify-center gap-2 mt-6'>
							<Button
								variant='outline'
								disabled={page <= 1}
								onClick={() => setPage((p) => p - 1)}
								className='text-xs'
							>
								Previous
							</Button>
							<span className='text-xs text-slate-500 dark:text-slate-400'>
								Page {page} of {totalPages}
							</span>
							<Button
								variant='outline'
								disabled={page >= totalPages}
								onClick={() => setPage((p) => p + 1)}
								className='text-xs'
							>
								Next
							</Button>
						</div>
					)}
				</>
			)}

			{/* Empty state */}
			{data && data.items.length === 0 && (
				<div className='text-center py-16'>
					<FolderKanban className='h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3' />
					<p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
						{search ? "No campaigns found" : "No campaigns yet"}
					</p>
					<p className='text-xs text-slate-400 dark:text-slate-500 mt-1 mb-4'>
						{search
							? "Try adjusting your search terms"
							: "Create your first campaign to group generations together"}
					</p>
					{!search && (
						<Button onClick={() => setShowCreate(true)} className='text-xs'>
							<Plus className='h-4 w-4' />
							Create Campaign
						</Button>
					)}
				</div>
			)}

			{/* Create modal */}
			{showCreate && (
				<CampaignFormModal
					onClose={() => setShowCreate(false)}
					onSuccess={() => {
						setShowCreate(false);
						mutate();
					}}
				/>
			)}

			{/* Delete confirmation */}
			{deleteTarget && (
				<div className='fixed inset-0 z-50 flex items-center justify-center'>
					<div
						className='absolute inset-0 bg-black/50 backdrop-blur-sm'
						onClick={() => setDeleteTarget(null)}
					/>
					<div className='relative w-full max-w-sm mx-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl p-5'>
						<h3 className='text-base font-semibold text-slate-900 dark:text-white mb-2'>
							Delete Campaign
						</h3>
						<p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
							Are you sure you want to delete{" "}
							<span className='font-medium text-slate-700 dark:text-slate-200'>
								{deleteTarget.name}
							</span>
							? This will not delete the associated generations.
						</p>
						<div className='flex justify-end gap-2'>
							<Button variant='outline' onClick={() => setDeleteTarget(null)}>
								Cancel
							</Button>
							<Button
								onClick={handleDelete}
								isLoading={deleting}
								className='bg-danger-600 hover:bg-danger-700 focus:ring-danger-500/40'
							>
								Delete
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
