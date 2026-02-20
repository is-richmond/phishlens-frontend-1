"use client";

import { useState, useCallback } from "react";
import { useTemplates } from "@/lib/hooks";
import { api } from "@/lib/api";
import { cn, formatCategory } from "@/lib/utils";
import { TemplateCard, TemplateCardSkeleton } from "./TemplateCard";
import { TemplatePreview } from "./TemplatePreview";
import { TemplateFormModal } from "./TemplateFormModal";
import { Button, Alert } from "@/components/ui/FormElements";
import {
	Search,
	Plus,
	BookTemplate,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import type { Template, PretextCategory } from "@/types";

/** Category filter tabs */
const CATEGORY_TABS: { value: string; label: string }[] = [
	{ value: "", label: "All" },
	{ value: "credential_phishing", label: "Credential Phishing" },
	{ value: "business_email_compromise", label: "BEC" },
	{ value: "quishing", label: "Quishing" },
	{ value: "spear_phishing", label: "Spear Phishing" },
	{ value: "whaling", label: "Whaling" },
	{ value: "smishing", label: "Smishing" },
];

interface TemplateGalleryProps {
	/** If provided, the gallery shows a "Select" button and calls this */
	onSelectTemplate?: (template: Template) => void;
}

/**
 * Full template gallery with search, category filter bar, grid layout,
 * preview modal, create/edit/delete, and pagination.
 */
export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("");
	const [page, setPage] = useState(1);

	// Modal state
	const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
	const [formModal, setFormModal] = useState<{
		open: boolean;
		template?: Template;
	}>({ open: false });
	const [confirmDelete, setConfirmDelete] = useState<Template | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	const perPage = 12;

	const { data, isLoading, mutate } = useTemplates({
		page,
		per_page: perPage,
		category: category || undefined,
		search: search || undefined,
	});

	const templates = data?.items ?? [];
	const total = data?.total ?? 0;
	const totalPages = Math.ceil(total / perPage);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearch(e.target.value);
			setPage(1);
		},
		[],
	);

	function handleCategoryClick(cat: string) {
		setCategory(cat);
		setPage(1);
	}

	function handleCreateNew() {
		setFormModal({ open: true });
	}

	function handleEdit(template: Template) {
		setFormModal({ open: true, template });
	}

	function handleFormSuccess() {
		setFormModal({ open: false });
		mutate();
	}

	async function handleDelete(template: Template) {
		setDeleteError(null);
		try {
			await api.delete(`/v1/templates/${template.id}`);
			setConfirmDelete(null);
			mutate();
		} catch (err) {
			setDeleteError(
				err instanceof Error ? err.message : "Failed to delete template",
			);
		}
	}

	return (
		<>
			<div className='space-y-5'>
				{/* Toolbar: search + create */}
				<div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
					<div className='relative flex-1 w-full sm:max-w-sm'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
						<input
							type='text'
							placeholder='Search templates…'
							value={search}
							onChange={handleSearchChange}
							className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors'
						/>
					</div>

					<Button onClick={handleCreateNew} className='shrink-0'>
						<Plus className='w-4 h-4' />
						New Template
					</Button>
				</div>

				{/* Category filter bar */}
				<div className='flex flex-wrap gap-2'>
					{CATEGORY_TABS.map((tab) => (
						<button
							key={tab.value}
							type='button'
							onClick={() => handleCategoryClick(tab.value)}
							className={cn(
								"rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
								category === tab.value
									? "bg-primary-600 text-white"
									: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600",
							)}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Delete error */}
				{deleteError && <Alert variant='error'>{deleteError}</Alert>}

				{/* Delete confirmation */}
				{confirmDelete && (
					<div className='rounded-lg border border-danger-200 dark:border-danger-500/30 bg-danger-50 dark:bg-danger-500/10 px-4 py-3 flex items-center justify-between gap-3'>
						<p className='text-sm text-danger-700 dark:text-danger-400'>
							Delete template{" "}
							<span className='font-semibold'>{confirmDelete.name}</span>? This
							cannot be undone.
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

				{/* Grid */}
				{isLoading ? (
					<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
						{Array.from({ length: 6 }).map((_, i) => (
							<TemplateCardSkeleton key={i} />
						))}
					</div>
				) : templates.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-16 text-center'>
						<div className='rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4'>
							<BookTemplate className='w-8 h-8 text-slate-400' />
						</div>
						<h3 className='text-base font-semibold text-slate-900 dark:text-white mb-1'>
							{search || category
								? "No matching templates"
								: "No templates yet"}
						</h3>
						<p className='text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-sm'>
							{search || category
								? "Try adjusting your search or filter criteria."
								: "Create your first custom template or wait for system templates to be seeded."}
						</p>
						{!search && !category && (
							<Button onClick={handleCreateNew}>
								<Plus className='w-4 h-4' />
								Create Template
							</Button>
						)}
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
						{templates.map((t) => (
							<TemplateCard
								key={t.id}
								template={t}
								onPreview={setPreviewTemplate}
								onSelect={onSelectTemplate}
								onEdit={handleEdit}
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

			{/* Preview modal */}
			{previewTemplate && (
				<TemplatePreview
					template={previewTemplate}
					onClose={() => setPreviewTemplate(null)}
					onSelect={onSelectTemplate}
				/>
			)}

			{/* Create/Edit modal */}
			{formModal.open && (
				<TemplateFormModal
					editTemplate={formModal.template}
					onClose={() => setFormModal({ open: false })}
					onSuccess={handleFormSuccess}
				/>
			)}
		</>
	);
}
