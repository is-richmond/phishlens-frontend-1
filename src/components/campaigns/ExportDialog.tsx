"use client";

import { useState } from "react";
import { Download, X, FileJson, FileSpreadsheet, Mail, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/FormElements";
import type { ExportFormat } from "@/types";

/* ────────────────────────────────────────────────────────────
   ExportDialog — Format selection + download for generations
   Supports JSON, CSV, EML formats with progress indicator
   ──────────────────────────────────────────────────────────── */

interface ExportDialogProps {
	generationIds: string[];
	onClose: () => void;
}

const FORMAT_OPTIONS: {
	value: ExportFormat;
	label: string;
	description: string;
	icon: React.ElementType;
}[] = [
	{
		value: "json",
		label: "JSON",
		description: "Full data with metadata, scores, and analysis",
		icon: FileJson,
	},
	{
		value: "csv",
		label: "CSV",
		description: "Tabular format for spreadsheets and data analysis",
		icon: FileSpreadsheet,
	},
	{
		value: "eml",
		label: "EML",
		description: "RFC 5322 email format for email client import",
		icon: Mail,
	},
];

export function ExportDialog({ generationIds, onClose }: ExportDialogProps) {
	const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("json");
	const [includeMetadata, setIncludeMetadata] = useState(true);
	const [isExporting, setIsExporting] = useState(false);
	const [progress, setProgress] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleExport = async () => {
		setIsExporting(true);
		setError(null);
		setProgress("Preparing export...");

		try {
			const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";
			const token = typeof window !== "undefined" ? localStorage.getItem("phishlens-token") : null;
			const url = `${API_BASE}/v1/export/?format=${selectedFormat}&include_metadata=${includeMetadata}`;

			setProgress("Downloading...");

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify(generationIds),
			});

			if (!response.ok) {
				const errData = await response.json().catch(() => ({ detail: "Export failed" }));
				throw new Error(errData.detail || "Export failed");
			}

			setProgress("Saving file...");

			const blob = await response.blob();
			const contentDisposition = response.headers.get("Content-Disposition");
			let filename = `phishlens_export.${selectedFormat}`;
			if (contentDisposition) {
				const match = contentDisposition.match(/filename=(.+)/);
				if (match) filename = match[1].replace(/"/g, "");
			}

			const blobUrl = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = blobUrl;
			a.download = filename;
			a.click();
			URL.revokeObjectURL(blobUrl);

			setProgress("Done!");
			setTimeout(() => onClose(), 800);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Export failed");
			setProgress(null);
		} finally {
			setIsExporting(false);
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
			<div className='relative w-full max-w-md mx-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl'>
				{/* Header */}
				<div className='flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50'>
					<div className='flex items-center gap-2'>
						<Download className='h-5 w-5 text-primary-600 dark:text-primary-400' />
						<h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
							Export Generations
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

				{/* Body */}
				<div className='p-5 space-y-4'>
					{/* Selected count */}
					<div className='rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-3 py-2'>
						<p className='text-xs text-slate-600 dark:text-slate-400'>
							<span className='font-semibold text-slate-900 dark:text-white'>
								{generationIds.length}
							</span>{" "}
							generation{generationIds.length !== 1 ? "s" : ""} selected for export
						</p>
					</div>

					{/* Format selection */}
					<div>
						<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
							Export Format
						</label>
						<div className='space-y-2'>
							{FORMAT_OPTIONS.map((fmt) => {
								const Icon = fmt.icon;
								return (
									<button
										key={fmt.value}
										type='button'
										onClick={() => setSelectedFormat(fmt.value)}
										className={cn(
											"w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
											selectedFormat === fmt.value
												? "border-primary-500 bg-primary-50 dark:bg-primary-500/5"
												: "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
										)}
									>
										<Icon
											className={cn(
												"h-5 w-5 shrink-0",
												selectedFormat === fmt.value
													? "text-primary-600 dark:text-primary-400"
													: "text-slate-400",
											)}
										/>
										<div>
											<p
												className={cn(
													"text-sm font-medium",
													selectedFormat === fmt.value
														? "text-primary-700 dark:text-primary-300"
														: "text-slate-700 dark:text-slate-300",
												)}
											>
												{fmt.label}
											</p>
											<p className='text-[10px] text-slate-400 dark:text-slate-500'>
												{fmt.description}
											</p>
										</div>
									</button>
								);
							})}
						</div>
					</div>

					{/* Include metadata toggle */}
					<label className='flex items-center gap-2 cursor-pointer'>
						<input
							type='checkbox'
							checked={includeMetadata}
							onChange={(e) => setIncludeMetadata(e.target.checked)}
							className='h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500/30'
						/>
						<span className='text-sm text-slate-700 dark:text-slate-300'>
							Include scenario metadata
						</span>
					</label>

					{/* Error */}
					{error && (
						<div className='rounded-lg bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 px-3 py-2 text-xs text-danger-700 dark:text-danger-400'>
							{error}
						</div>
					)}

					{/* Progress */}
					{progress && (
						<div className='flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400'>
							{isExporting && <Loader2 className='h-3.5 w-3.5 animate-spin' />}
							{progress}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className='flex justify-end gap-2 px-5 py-4 border-t border-slate-100 dark:border-slate-700/50'>
					<Button variant='outline' onClick={onClose} disabled={isExporting}>
						Cancel
					</Button>
					<Button
						onClick={handleExport}
						disabled={isExporting || generationIds.length === 0}
						isLoading={isExporting}
					>
						<Download className='h-4 w-4' />
						Export {selectedFormat.toUpperCase()}
					</Button>
				</div>
			</div>
		</div>
	);
}
