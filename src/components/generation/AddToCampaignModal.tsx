"use client";

import { useState } from "react";
import {
	X,
	FolderPlus,
	Search,
	Check,
	Loader2,
	Plus,
	ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import { useCampaigns } from "@/lib/hooks";
import { Button, Alert } from "@/components/ui/FormElements";
import type { Campaign } from "@/types";

/* ────────────────────────────────────────────────────────────
   AddToCampaignModal
   Allows the user to:
   1. Select an existing campaign, OR
   2. Create a new campaign inline
   Then adds the generation to the chosen campaign.
   ──────────────────────────────────────────────────────────── */

interface AddToCampaignModalProps {
	generationId: string;
	onClose: () => void;
	onSuccess: (campaign: Campaign) => void;
}

type ModalView = "select" | "create";

export function AddToCampaignModal({
	generationId,
	onClose,
	onSuccess,
}: AddToCampaignModalProps) {
	const [view, setView] = useState<ModalView>("select");
	const [search, setSearch] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [adding, setAdding] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	// Inline create state
	const [newName, setNewName] = useState("");
	const [newDescription, setNewDescription] = useState("");
	const [creating, setCreating] = useState(false);

	const {
		data: campaignsData,
		isLoading,
		mutate,
	} = useCampaigns({
		per_page: 50,
		search: search || undefined,
	});

	const campaigns = campaignsData?.items ?? [];

	/* ── Add to existing campaign ── */
	const handleAddToExisting = async () => {
		if (!selectedId) return;
		setAdding(true);
		setError(null);

		try {
			await api.post(`/v1/campaigns/${selectedId}/generations`, {
				generation_id: generationId,
			});
			const campaign = campaigns.find((c) => c.id === selectedId);
			setSuccessMsg(`Added to "${campaign?.name ?? "campaign"}"`);
			setTimeout(() => {
				if (campaign) onSuccess(campaign);
			}, 800);
		} catch (err) {
			if (err instanceof ApiError) {
				if (err.status === 409) {
					setError("This generation is already in that campaign.");
				} else {
					setError(err.message);
				}
			} else {
				setError("Failed to add generation to campaign.");
			}
		} finally {
			setAdding(false);
		}
	};

	/* ── Create new campaign and add ── */
	const handleCreateAndAdd = async () => {
		if (!newName.trim()) return;
		setCreating(true);
		setError(null);

		try {
			// 1. Create the campaign
			const campaign = await api.post<Campaign>("/v1/campaigns", {
				name: newName.trim(),
				description: newDescription.trim() || undefined,
			});

			// 2. Add the generation to it
			await api.post(`/v1/campaigns/${campaign.id}/generations`, {
				generation_id: generationId,
			});

			// 3. Refresh campaign list cache
			mutate();

			setSuccessMsg(`Created "${campaign.name}" and added generation`);
			setTimeout(() => onSuccess(campaign), 800);
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else {
				setError("Failed to create campaign.");
			}
		} finally {
			setCreating(false);
		}
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-black/50 backdrop-blur-sm'
				onClick={onClose}
			/>

			{/* Modal */}
			<div className='relative w-full max-w-md mx-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl max-h-[80vh] flex flex-col'>
				{/* Header */}
				<div className='flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 shrink-0'>
					<div className='flex items-center gap-2'>
						{view === "create" && (
							<button
								type='button'
								onClick={() => {
									setView("select");
									setError(null);
								}}
								className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'
							>
								<ArrowLeft className='h-4 w-4' />
							</button>
						)}
						<FolderPlus className='h-5 w-5 text-primary-600 dark:text-primary-400' />
						<h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
							{view === "select" ? "Add to Campaign" : "New Campaign"}
						</h2>
					</div>
					<button
						type='button'
						onClick={onClose}
						className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'
					>
						<X className='h-5 w-5' />
					</button>
				</div>

				{/* Content */}
				<div className='flex-1 overflow-y-auto p-5 space-y-4'>
					{/* Status messages */}
					{error && <Alert variant='error'>{error}</Alert>}
					{successMsg && <Alert variant='success'>{successMsg}</Alert>}

					{/* ── Select existing campaign view ── */}
					{view === "select" && !successMsg && (
						<>
							{/* Search */}
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
								<input
									type='text'
									placeholder='Search campaigns...'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
								/>
							</div>

							{/* Create new button */}
							<button
								type='button'
								onClick={() => {
									setView("create");
									setError(null);
								}}
								className='w-full flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 p-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:border-primary-400 dark:hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
							>
								<Plus className='h-4 w-4' />
								Create new campaign
							</button>

							{/* Loading */}
							{isLoading && (
								<div className='flex items-center justify-center py-6'>
									<Loader2 className='h-5 w-5 animate-spin text-slate-400' />
								</div>
							)}

							{/* Campaign list */}
							{campaigns.length > 0 && (
								<div className='space-y-1.5'>
									{campaigns.map((campaign) => {
										const isSelected = selectedId === campaign.id;
										return (
											<button
												key={campaign.id}
												type='button'
												onClick={() =>
													setSelectedId(isSelected ? null : campaign.id)
												}
												className={cn(
													"w-full text-left rounded-lg border p-3 transition-all",
													isSelected
														? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 ring-1 ring-primary-500/30"
														: "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600",
												)}
											>
												<div className='flex items-center justify-between'>
													<div className='min-w-0'>
														<p
															className={cn(
																"text-sm font-medium truncate",
																isSelected
																	? "text-primary-700 dark:text-primary-400"
																	: "text-slate-900 dark:text-white",
															)}
														>
															{campaign.name}
														</p>
														{campaign.description && (
															<p className='text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5'>
																{campaign.description}
															</p>
														)}
													</div>
													{isSelected && (
														<Check className='h-4 w-4 text-primary-600 dark:text-primary-400 shrink-0 ml-2' />
													)}
												</div>
											</button>
										);
									})}
								</div>
							)}

							{/* Empty */}
							{!isLoading && campaigns.length === 0 && (
								<div className='text-center py-6'>
									<FolderPlus className='h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2' />
									<p className='text-sm text-slate-500 dark:text-slate-400'>
										{search
											? "No campaigns match your search"
											: "No campaigns yet"}
									</p>
									<p className='text-xs text-slate-400 dark:text-slate-500 mt-1'>
										Create one to get started
									</p>
								</div>
							)}
						</>
					)}

					{/* ── Create new campaign view ── */}
					{view === "create" && !successMsg && (
						<>
							<div>
								<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
									Campaign Name <span className='text-danger-500'>*</span>
								</label>
								<input
									type='text'
									placeholder='e.g., Q1 2026 Security Training'
									value={newName}
									onChange={(e) => setNewName(e.target.value)}
									autoFocus
									className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
									Description
								</label>
								<textarea
									placeholder='Optional description of the campaign goals...'
									value={newDescription}
									onChange={(e) => setNewDescription(e.target.value)}
									rows={3}
									className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none'
								/>
							</div>
						</>
					)}
				</div>

				{/* Footer */}
				{!successMsg && (
					<div className='flex justify-end gap-2 px-5 py-4 border-t border-slate-100 dark:border-slate-700/50 shrink-0'>
						<Button variant='ghost' onClick={onClose} className='text-xs'>
							Cancel
						</Button>

						{view === "select" && (
							<Button
								variant='primary'
								onClick={handleAddToExisting}
								disabled={!selectedId || adding}
								isLoading={adding}
								className='text-xs'
							>
								<FolderPlus className='h-3.5 w-3.5' />
								Add to Campaign
							</Button>
						)}

						{view === "create" && (
							<Button
								variant='primary'
								onClick={handleCreateAndAdd}
								disabled={!newName.trim() || creating}
								isLoading={creating}
								className='text-xs'
							>
								<Plus className='h-3.5 w-3.5' />
								Create & Add
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
