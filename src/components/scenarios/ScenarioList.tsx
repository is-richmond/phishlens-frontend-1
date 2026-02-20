"use client";

import { useState, useCallback } from "react";
import { useScenarios } from "@/lib/hooks";
import { api } from "@/lib/api";
import { ScenarioCard, ScenarioCardSkeleton } from "./ScenarioCard";
import { Button, Alert } from "@/components/ui/FormElements";
import { formatCategory } from "@/lib/utils";
import {
	Search,
	Plus,
	Filter,
	FileText,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import type { Scenario, PretextCategory } from "@/types";

const CATEGORY_FILTERS: { value: string; label: string }[] = [
	{ value: "", label: "All Categories" },
	{ value: "credential_phishing", label: "Credential Phishing" },
	{ value: "business_email_compromise", label: "BEC" },
	{ value: "quishing", label: "Quishing" },
	{ value: "spear_phishing", label: "Spear Phishing" },
	{ value: "whaling", label: "Whaling" },
	{ value: "smishing", label: "Smishing" },
];

interface ScenarioListProps {
	onCreateNew: () => void;
	onEdit: (scenario: Scenario) => void;
}

/**
 * Full scenario list with search, category filter, pagination, and CRUD actions.
 */
export function ScenarioList({ onCreateNew, onEdit }: ScenarioListProps) {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("");
	const [page, setPage] = useState(1);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [confirmDelete, setConfirmDelete] = useState<Scenario | null>(null);

	const perPage = 12;

	const { data, isLoading, mutate } = useScenarios({
		page,
		per_page: perPage,
		category: category || undefined,
		search: search || undefined,
	});

	const scenarios = data?.items ?? [];
	const total = data?.total ?? 0;
	const totalPages = Math.ceil(total / perPage);

	/** Search with debounce reset to page 1 */
	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearch(e.target.value);
			setPage(1);
		},
		[],
	);

	const handleCategoryChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setCategory(e.target.value);
			setPage(1);
		},
		[],
	);

	async function handleDelete(scenario: Scenario) {
		setDeleteError(null);
		try {
			await api.delete(`/v1/scenarios/${scenario.id}`);
			setConfirmDelete(null);
			mutate();
		} catch (err) {
			setDeleteError(
				err instanceof Error ? err.message : "Failed to delete scenario",
			);
		}
	}

	return (
		<div className='space-y-5'>
			{/* Toolbar */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
				{/* Search */}
				<div className='relative flex-1 w-full sm:max-w-sm'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
					<input
						type='text'
						placeholder='Search scenarios…'
						value={search}
						onChange={handleSearchChange}
						className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors'
					/>
				</div>

				{/* Category filter */}
				<div className='relative'>
					<Filter className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none' />
					<select
						value={category}
						onChange={handleCategoryChange}
						className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-9 pr-8 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat"
					>
						{CATEGORY_FILTERS.map((f) => (
							<option key={f.value} value={f.value}>
								{f.label}
							</option>
						))}
					</select>
				</div>

				{/* Create button */}
				<Button onClick={onCreateNew} className='shrink-0'>
					<Plus className='w-4 h-4' />
					New Scenario
				</Button>
			</div>

			{/* Delete error */}
			{deleteError && <Alert variant='error'>{deleteError}</Alert>}

			{/* Delete confirmation dialog */}
			{confirmDelete && (
				<div className='rounded-lg border border-danger-200 dark:border-danger-500/30 bg-danger-50 dark:bg-danger-500/10 px-4 py-3 flex items-center justify-between gap-3'>
					<p className='text-sm text-danger-700 dark:text-danger-400'>
						Delete <span className='font-semibold'>{confirmDelete.title}</span>?
						This cannot be undone.
					</p>
					<div className='flex gap-2 shrink-0'>
						<Button
							variant='outline'
							onClick={() => setConfirmDelete(null)}
							className='text-xs px-3 py-1.5'
						>
							Cancel
						</Button>
						<Button
							onClick={() => handleDelete(confirmDelete)}
							className='text-xs px-3 py-1.5 bg-danger-600 hover:bg-danger-700 focus:ring-danger-500/40'
						>
							Delete
						</Button>
					</div>
				</div>
			)}

			{/* List */}
			{isLoading ? (
				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
					{Array.from({ length: 6 }).map((_, i) => (
						<ScenarioCardSkeleton key={i} />
					))}
				</div>
			) : scenarios.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-16 text-center'>
					<div className='rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4'>
						<FileText className='w-8 h-8 text-slate-400' />
					</div>
					<h3 className='text-base font-semibold text-slate-900 dark:text-white mb-1'>
						{search || category ? "No matching scenarios" : "No scenarios yet"}
					</h3>
					<p className='text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-sm'>
						{search || category
							? "Try adjusting your search or filter criteria."
							: "Create your first phishing scenario to get started with message generation."}
					</p>
					{!search && !category && (
						<Button onClick={onCreateNew}>
							<Plus className='w-4 h-4' />
							Create Scenario
						</Button>
					)}
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
					{scenarios.map((s) => (
						<ScenarioCard
							key={s.id}
							scenario={s}
							onEdit={onEdit}
							onDelete={setConfirmDelete}
						/>
					))}
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className='flex items-center justify-between pt-2'>
					<p className='text-sm text-slate-500 dark:text-slate-400'>
						Showing{" "}
						<span className='font-medium text-slate-700 dark:text-slate-300'>
							{(page - 1) * perPage + 1}–{Math.min(page * perPage, total)}
						</span>{" "}
						of{" "}
						<span className='font-medium text-slate-700 dark:text-slate-300'>
							{total}
						</span>
					</p>
					<div className='flex gap-1'>
						<button
							type='button'
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
							className='inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
						>
							<ChevronLeft className='w-4 h-4' />
						</button>
						{Array.from({ length: totalPages }, (_, i) => i + 1)
							.filter(
								(p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
							)
							.map((p, idx, arr) => {
								const prev = arr[idx - 1];
								const showEllipsis = prev !== undefined && p - prev > 1;
								return (
									<span key={p} className='flex items-center'>
										{showEllipsis && (
											<span className='px-1 text-slate-400'>…</span>
										)}
										<button
											type='button'
											onClick={() => setPage(p)}
											className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
												p === page
													? "bg-primary-600 text-white"
													: "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
											}`}
										>
											{p}
										</button>
									</span>
								);
							})}
						<button
							type='button'
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
							className='inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
						>
							<ChevronRight className='w-4 h-4' />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
