"use client";

import { useEffect } from "react";
import { cn, formatCategory, formatDate } from "@/lib/utils";
import {
	CATEGORY_ICONS,
	CATEGORY_BADGE_COLORS,
	CATEGORY_ICON_COLORS,
} from "./TemplateCard";
import { X, Lock, Globe, User, Clock, Copy, Target } from "lucide-react";
import { Button } from "@/components/ui/FormElements";
import type { Template } from "@/types";

interface TemplatePreviewProps {
	template: Template;
	onClose: () => void;
	onSelect?: (template: Template) => void;
}

/**
 * Full-screen modal preview of a template.
 * Shows system prompt, user prompt skeleton, metadata, and action buttons.
 */
export function TemplatePreview({
	template,
	onClose,
	onSelect,
}: TemplatePreviewProps) {
	const Icon = CATEGORY_ICONS[template.category] || Target;
	const badgeColor =
		CATEGORY_BADGE_COLORS[template.category] ??
		CATEGORY_BADGE_COLORS.credential_phishing;
	const iconColor =
		CATEGORY_ICON_COLORS[template.category] ??
		CATEGORY_ICON_COLORS.credential_phishing;

	// Lock body scroll & close on Escape
	useEffect(() => {
		document.body.style.overflow = "hidden";
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", handleKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKey);
		};
	}, [onClose]);

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text).catch(() => {});
	}

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4'
			role='dialog'
			aria-modal='true'
			aria-label={`Template preview: ${template.name}`}
		>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-black/50 backdrop-blur-sm'
				onClick={onClose}
			/>

			{/* Modal */}
			<div className='relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl'>
				{/* Header */}
				<div className='sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4'>
					<div className='flex items-center gap-3 min-w-0'>
						<div
							className={cn(
								"flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
								template.is_predefined
									? "bg-slate-100 dark:bg-slate-700"
									: "bg-primary-50 dark:bg-primary-500/10",
							)}
						>
							<Icon className={cn("w-5 h-5", iconColor)} />
						</div>
						<div className='min-w-0'>
							<h2 className='text-lg font-bold text-slate-900 dark:text-white truncate'>
								{template.name}
							</h2>
							<div className='flex items-center gap-2 mt-0.5'>
								<span
									className={cn(
										"inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
										badgeColor,
									)}
								>
									{formatCategory(template.category)}
								</span>
								{template.is_predefined ? (
									<span className='inline-flex items-center gap-1 text-[10px] text-slate-500'>
										<Lock className='w-2.5 h-2.5' />
										System
									</span>
								) : (
									<span className='inline-flex items-center gap-1 text-[10px] text-primary-600 dark:text-primary-400'>
										<User className='w-2.5 h-2.5' />
										Custom
									</span>
								)}
							</div>
						</div>
					</div>
					<button
						type='button'
						onClick={onClose}
						className='rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
						aria-label='Close preview'
					>
						<X className='w-5 h-5' />
					</button>
				</div>

				{/* Body */}
				<div className='px-6 py-5 space-y-6'>
					{/* Description */}
					{template.description && (
						<div>
							<h3 className='text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5'>
								Description
							</h3>
							<p className='text-sm text-slate-700 dark:text-slate-300'>
								{template.description}
							</p>
						</div>
					)}

					{/* System prompt */}
					<div>
						<div className='flex items-center justify-between mb-1.5'>
							<h3 className='text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
								System Prompt
							</h3>
							<button
								type='button'
								onClick={() => copyToClipboard(template.system_prompt)}
								className='inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
								title='Copy system prompt'
							>
								<Copy className='w-3 h-3' />
								Copy
							</button>
						</div>
						<pre className='rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto'>
							{template.system_prompt}
						</pre>
					</div>

					{/* User prompt skeleton */}
					<div>
						<div className='flex items-center justify-between mb-1.5'>
							<h3 className='text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
								User Prompt Skeleton
							</h3>
							<button
								type='button'
								onClick={() => copyToClipboard(template.user_prompt_skeleton)}
								className='inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
								title='Copy user prompt skeleton'
							>
								<Copy className='w-3 h-3' />
								Copy
							</button>
						</div>
						<pre className='rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto'>
							{template.user_prompt_skeleton}
						</pre>
					</div>

					{/* Metadata */}
					<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
						<MetaItem label='Version' value={`v${template.version}`} />
						<MetaItem
							label='Visibility'
							value={template.is_public ? "Public" : "Private"}
							icon={
								template.is_public ? (
									<Globe className='w-3 h-3 text-success-500' />
								) : (
									<Lock className='w-3 h-3 text-slate-400' />
								)
							}
						/>
						<MetaItem label='Created' value={formatDate(template.created_at)} />
						<MetaItem label='Updated' value={formatDate(template.updated_at)} />
					</div>
				</div>

				{/* Footer */}
				<div className='sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4'>
					<Button variant='outline' onClick={onClose}>
						Close
					</Button>
					{onSelect && (
						<Button onClick={() => onSelect(template)}>Select Template</Button>
					)}
				</div>
			</div>
		</div>
	);
}

function MetaItem({
	label,
	value,
	icon,
}: {
	label: string;
	value: string;
	icon?: React.ReactNode;
}) {
	return (
		<div>
			<p className='text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-0.5'>
				{label}
			</p>
			<p className='text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1'>
				{icon}
				{value}
			</p>
		</div>
	);
}
