"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   AnalysisPanel — Collapsible LLM evaluation analysis text
   Shows detailed strengths/weaknesses from the evaluator
   ──────────────────────────────────────────────────────────── */

interface AnalysisPanelProps {
	analysis: string | null;
	/** Start expanded (default true) */
	defaultOpen?: boolean;
}

export function AnalysisPanel({
	analysis,
	defaultOpen = true,
}: AnalysisPanelProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	if (!analysis) {
		return (
			<div className='rounded-lg border border-slate-200 dark:border-slate-700 p-4'>
				<div className='flex items-center gap-2 text-slate-400 dark:text-slate-500'>
					<FileText className='h-4 w-4' />
					<span className='text-sm font-medium'>
						No evaluation analysis available
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className='rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden'>
			{/* Collapsible header */}
			<button
				type='button'
				onClick={() => setIsOpen(!isOpen)}
				className='w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors'
			>
				<div className='flex items-center gap-2'>
					<FileText className='h-4 w-4 text-primary-500' />
					<span className='text-sm font-semibold text-slate-900 dark:text-white'>
						Detailed Analysis
					</span>
				</div>
				{isOpen ? (
					<ChevronUp className='h-4 w-4 text-slate-400' />
				) : (
					<ChevronDown className='h-4 w-4 text-slate-400' />
				)}
			</button>

			{/* Collapsible body */}
			<div
				className={cn(
					"overflow-hidden transition-all duration-300",
					isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
				)}
			>
				<div className='px-4 py-3 border-t border-slate-100 dark:border-slate-700/50'>
					<div className='prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed'>
						<ReactMarkdown>{analysis}</ReactMarkdown>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   Skeleton
   ──────────────────────────────────────────────────────────── */

export function AnalysisPanelSkeleton() {
	return (
		<div className='rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse'>
			<div className='flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50'>
				<div className='h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded' />
			</div>
			<div className='px-4 py-3 border-t border-slate-100 dark:border-slate-700/50 space-y-2'>
				<div className='h-3 w-full bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-full bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded' />
			</div>
		</div>
	);
}
