"use client";

import { useState } from "react";
import {
	RefreshCw,
	FolderPlus,
	Download,
	Settings2,
	X,
	ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/FormElements";
import type { Generation, ExportFormat } from "@/types";

/* ────────────────────────────────────────────────────────────
   GenerationActions — Action buttons bar
   Regenerate, Add to Campaign, Export, Parameter adjustments
   ──────────────────────────────────────────────────────────── */

interface GenerationActionsProps {
	generation: Generation;
	onRegenerate: (params: {
		temperature?: number;
		max_tokens?: number;
		model_variant?: string;
	}) => void;
	onAddToCampaign: () => void;
	isRegenerating?: boolean;
}

const EXPORT_FORMATS: { value: ExportFormat; label: string }[] = [
	{ value: "json", label: "JSON" },
	{ value: "csv", label: "CSV" },
	{ value: "eml", label: "EML" },
];

export function GenerationActions({
	generation,
	onRegenerate,
	onAddToCampaign,
	isRegenerating = false,
}: GenerationActionsProps) {
	const [showParams, setShowParams] = useState(false);
	const [showExport, setShowExport] = useState(false);
	const [exporting, setExporting] = useState(false);

	// Parameter adjustment state
	const inputParams = generation.input_parameters ?? {};
	const [temperature, setTemperature] = useState(
		(inputParams.temperature as number) ?? 0.7,
	);
	const [maxTokens, setMaxTokens] = useState(
		(inputParams.max_tokens as number) ?? 1024,
	);
	const [modelVariant, setModelVariant] = useState(
		(inputParams.model_variant as string) ?? "gemini-2.5-flash-lite",
	);

	const handleRegenerate = () => {
		onRegenerate({
			temperature,
			max_tokens: maxTokens,
			model_variant: modelVariant,
		});
		setShowParams(false);
	};

	const handleExport = async (format: ExportFormat) => {
		setExporting(true);
		try {
			const response = await api.post<Blob>("/v1/export", {
				generation_ids: [generation.id],
				format,
			});
			// Trigger download
			const blob = new Blob([JSON.stringify(response)], {
				type:
					format === "json"
						? "application/json"
						: format === "csv"
							? "text/csv"
							: "message/rfc822",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `phishlens-${generation.id.slice(0, 8)}.${format}`;
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			// Export error handled silently
		} finally {
			setExporting(false);
			setShowExport(false);
		}
	};

	return (
		<div className='space-y-3'>
			{/* Main action buttons */}
			<div className='flex items-center gap-2 flex-wrap'>
				<Button
					variant='primary'
					onClick={() => (showParams ? handleRegenerate() : onRegenerate({}))}
					disabled={isRegenerating}
					isLoading={isRegenerating}
					className='text-xs'
				>
					<RefreshCw className='h-3.5 w-3.5' />
					Regenerate
				</Button>

				<Button
					variant='outline'
					onClick={() => setShowParams(!showParams)}
					className='text-xs'
				>
					<Settings2 className='h-3.5 w-3.5' />
					Parameters
				</Button>

				<Button variant='outline' onClick={onAddToCampaign} className='text-xs'>
					<FolderPlus className='h-3.5 w-3.5' />
					Add to Campaign
				</Button>

				{/* Export dropdown */}
				<div className='relative'>
					<Button
						variant='outline'
						onClick={() => setShowExport(!showExport)}
						className='text-xs'
						disabled={exporting}
					>
						<Download className='h-3.5 w-3.5' />
						Export
						<ChevronDown className='h-3 w-3' />
					</Button>

					{showExport && (
						<div className='absolute top-full left-0 mt-1 w-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-20'>
							{EXPORT_FORMATS.map((fmt) => (
								<button
									key={fmt.value}
									type='button'
									onClick={() => handleExport(fmt.value)}
									className='w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 first:rounded-t-lg last:rounded-b-lg transition-colors'
								>
									{fmt.label}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Parameter adjustment panel */}
			{showParams && (
				<div className='rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4'>
					<div className='flex items-center justify-between mb-3'>
						<h4 className='text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>
							Generation Parameters
						</h4>
						<button
							type='button'
							onClick={() => setShowParams(false)}
							className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
						>
							<X className='h-4 w-4' />
						</button>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
						{/* Temperature */}
						<div>
							<label className='block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1'>
								Temperature
							</label>
							<div className='flex items-center gap-2'>
								<input
									type='range'
									min={0}
									max={2}
									step={0.1}
									value={temperature}
									onChange={(e) => setTemperature(parseFloat(e.target.value))}
									className='flex-1 h-1.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-primary-600'
								/>
								<span className='text-xs font-mono font-medium text-slate-700 dark:text-slate-300 w-8 text-right'>
									{temperature.toFixed(1)}
								</span>
							</div>
						</div>

						{/* Max Tokens */}
						<div>
							<label className='block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1'>
								Max Tokens
							</label>
							<input
								type='number'
								min={100}
								max={8192}
								step={100}
								value={maxTokens}
								onChange={(e) => setMaxTokens(parseInt(e.target.value) || 1024)}
								className='w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30'
							/>
						</div>

						{/* Model Variant */}
						<div>
							<label className='block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1'>
								Model
							</label>
							<select
								value={modelVariant}
								onChange={(e) => setModelVariant(e.target.value)}
								className='w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30'
							>
								<option value='gemini-2.5-flash-lite'>
									Gemini 2.5 Flash-Lite
								</option>
								<option value='gemini-2.5-flash'>Gemini 2.5 Flash</option>
								<option value='gemini-2.5-pro'>Gemini 2.5 Pro</option>
							</select>
						</div>
					</div>

					<div className='mt-3 flex justify-end'>
						<Button
							variant='primary'
							onClick={handleRegenerate}
							disabled={isRegenerating}
							isLoading={isRegenerating}
							className='text-xs'
						>
							<RefreshCw className='h-3.5 w-3.5' />
							Regenerate with Parameters
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
