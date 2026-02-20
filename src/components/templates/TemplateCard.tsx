"use client";

import { cn, formatCategory, formatDate, truncate } from "@/lib/utils";
import {
	KeyRound,
	Mail,
	QrCode,
	Target,
	Crown,
	Smartphone,
	Eye,
	Lock,
	Globe,
	User,
} from "lucide-react";
import type { Template, PretextCategory } from "@/types";

/** Icons for each pretext category */
export const CATEGORY_ICONS: Record<PretextCategory, React.ElementType> = {
	credential_phishing: KeyRound,
	business_email_compromise: Mail,
	quishing: QrCode,
	spear_phishing: Target,
	whaling: Crown,
	smishing: Smartphone,
};

/** Badge color per category */
export const CATEGORY_BADGE_COLORS: Record<PretextCategory, string> = {
	credential_phishing:
		"bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400",
	business_email_compromise:
		"bg-warning-100 dark:bg-warning-500/20 text-warning-700 dark:text-warning-400",
	quishing:
		"bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400",
	spear_phishing:
		"bg-danger-100 dark:bg-danger-500/20 text-danger-700 dark:text-danger-400",
	whaling:
		"bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400",
	smishing: "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400",
};

export const CATEGORY_ICON_COLORS: Record<PretextCategory, string> = {
	credential_phishing: "text-primary-600 dark:text-primary-400",
	business_email_compromise: "text-warning-600 dark:text-warning-400",
	quishing: "text-success-600 dark:text-success-400",
	spear_phishing: "text-danger-600 dark:text-danger-400",
	whaling: "text-purple-600 dark:text-purple-400",
	smishing: "text-cyan-600 dark:text-cyan-400",
};

interface TemplateCardProps {
	template: Template;
	onPreview: (template: Template) => void;
	onSelect?: (template: Template) => void;
	onEdit?: (template: Template) => void;
	onDelete?: (template: Template) => void;
}

/**
 * Template card for the gallery grid.
 * Shows name, category badge, description, predefined/custom badge,
 * preview and select buttons.
 */
export function TemplateCard({
	template,
	onPreview,
	onSelect,
	onEdit,
	onDelete,
}: TemplateCardProps) {
	const Icon = CATEGORY_ICONS[template.category] || Target;
	const badgeColor =
		CATEGORY_BADGE_COLORS[template.category] ??
		CATEGORY_BADGE_COLORS.credential_phishing;
	const iconColor =
		CATEGORY_ICON_COLORS[template.category] ??
		CATEGORY_ICON_COLORS.credential_phishing;

	return (
		<div className='group flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors overflow-hidden'>
			{/* Card header — icon + category */}
			<div className='flex items-center gap-3 px-5 pt-5 pb-3'>
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
				<div className='min-w-0 flex-1'>
					<h3 className='text-sm font-semibold text-slate-900 dark:text-white truncate'>
						{template.name}
					</h3>
					<div className='flex items-center gap-2 mt-0.5'>
						<span
							className={cn(
								"inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
								badgeColor,
							)}
						>
							{formatCategory(template.category)}
						</span>
					</div>
				</div>
			</div>

			{/* Description */}
			<div className='px-5 pb-3 flex-1'>
				<p className='text-xs text-slate-500 dark:text-slate-400 line-clamp-2'>
					{template.description
						? truncate(template.description, 140)
						: "No description provided."}
				</p>
			</div>

			{/* Metadata badges */}
			<div className='flex items-center gap-2 px-5 pb-3 flex-wrap'>
				{template.is_predefined ? (
					<span className='inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400'>
						<Lock className='w-2.5 h-2.5' />
						System
					</span>
				) : (
					<span className='inline-flex items-center gap-1 rounded-full bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 text-[10px] font-medium text-primary-700 dark:text-primary-400'>
						<User className='w-2.5 h-2.5' />
						Custom
					</span>
				)}
				{template.is_public && (
					<span className='inline-flex items-center gap-1 rounded-full bg-success-50 dark:bg-success-500/10 px-2 py-0.5 text-[10px] font-medium text-success-700 dark:text-success-400'>
						<Globe className='w-2.5 h-2.5' />
						Public
					</span>
				)}
				{template.version && (
					<span className='text-[10px] text-slate-400 dark:text-slate-500'>
						v{template.version}
					</span>
				)}
			</div>

			{/* Actions */}
			<div className='flex items-center border-t border-slate-100 dark:border-slate-700/50'>
				<button
					type='button'
					onClick={() => onPreview(template)}
					className='flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors'
				>
					<Eye className='w-3.5 h-3.5' />
					Preview
				</button>

				{onSelect && (
					<>
						<div className='w-px h-6 bg-slate-100 dark:bg-slate-700/50' />
						<button
							type='button'
							onClick={() => onSelect(template)}
							className='flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors'
						>
							Select
						</button>
					</>
				)}

				{!template.is_predefined && onEdit && (
					<>
						<div className='w-px h-6 bg-slate-100 dark:bg-slate-700/50' />
						<button
							type='button'
							onClick={() => onEdit(template)}
							className='flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-warning-600 dark:hover:text-warning-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors'
						>
							Edit
						</button>
					</>
				)}

				{!template.is_predefined && onDelete && (
					<>
						<div className='w-px h-6 bg-slate-100 dark:bg-slate-700/50' />
						<button
							type='button'
							onClick={() => onDelete(template)}
							className='flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors'
						>
							Delete
						</button>
					</>
				)}
			</div>
		</div>
	);
}

/** Loading skeleton */
export function TemplateCardSkeleton() {
	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden animate-pulse'>
			<div className='flex items-center gap-3 px-5 pt-5 pb-3'>
				<div className='h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700' />
				<div className='flex-1 space-y-1.5'>
					<div className='h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded' />
					<div className='h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-full' />
				</div>
			</div>
			<div className='px-5 pb-3 space-y-1.5'>
				<div className='h-3 w-full bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded' />
			</div>
			<div className='flex gap-2 px-5 pb-3'>
				<div className='h-4 w-14 bg-slate-200 dark:bg-slate-700 rounded-full' />
				<div className='h-4 w-10 bg-slate-200 dark:bg-slate-700 rounded-full' />
			</div>
			<div className='border-t border-slate-100 dark:border-slate-700/50 py-3' />
		</div>
	);
}
