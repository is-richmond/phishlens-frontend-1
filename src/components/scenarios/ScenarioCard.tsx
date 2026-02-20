"use client";

import Link from "next/link";
import { cn, formatCategory, formatDate, truncate } from "@/lib/utils";
import {
	MoreVertical,
	Pencil,
	Trash2,
	Zap,
	Clock,
	Shield,
	Gauge,
	Mail,
	MessageSquare,
	Smartphone,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Scenario } from "@/types";

const CHANNEL_ICONS: Record<string, React.ElementType> = {
	email: Mail,
	sms: Smartphone,
	internal_chat: MessageSquare,
};

const URGENCY_COLORS: Record<number, string> = {
	1: "bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400",
	2: "bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400",
	3: "bg-warning-100 dark:bg-warning-500/20 text-warning-700 dark:text-warning-400",
	4: "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400",
	5: "bg-danger-100 dark:bg-danger-500/20 text-danger-700 dark:text-danger-400",
};

const URGENCY_LABELS: Record<number, string> = {
	1: "Low",
	2: "Moderate",
	3: "Medium",
	4: "High",
	5: "Critical",
};

interface ScenarioCardProps {
	scenario: Scenario;
	onEdit: (scenario: Scenario) => void;
	onDelete: (scenario: Scenario) => void;
}

/**
 * Card for a single scenario in the list view.
 * Shows title, category badge, urgency, channel, date, and actions menu.
 */
export function ScenarioCard({
	scenario,
	onEdit,
	onDelete,
}: ScenarioCardProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Close menu on outside click
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMenuOpen(false);
			}
		}
		if (menuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [menuOpen]);

	const ChannelIcon = CHANNEL_ICONS[scenario.communication_channel] || Mail;

	return (
		<div className='group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors'>
			<div className='p-5'>
				{/* Header row: title + menu */}
				<div className='flex items-start justify-between gap-3'>
					<Link
						href={`/generate?scenario=${scenario.id}`}
						className='text-sm font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1'
					>
						{scenario.title}
					</Link>

					{/* Actions menu */}
					<div className='relative' ref={menuRef}>
						<button
							type='button'
							onClick={() => setMenuOpen((v) => !v)}
							className='rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100'
							aria-label='Scenario actions'
						>
							<MoreVertical className='w-4 h-4' />
						</button>

						{menuOpen && (
							<div className='absolute right-0 top-full mt-1 z-20 w-40 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1'>
								<button
									type='button'
									onClick={() => {
										setMenuOpen(false);
										onEdit(scenario);
									}}
									className='flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
								>
									<Pencil className='w-3.5 h-3.5' />
									Edit
								</button>
								<button
									type='button'
									onClick={() => {
										setMenuOpen(false);
										onDelete(scenario);
									}}
									className='flex w-full items-center gap-2 px-3 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-500/10'
								>
									<Trash2 className='w-3.5 h-3.5' />
									Delete
								</button>
								<hr className='my-1 border-slate-200 dark:border-slate-700' />
								<Link
									href={`/generate?scenario=${scenario.id}`}
									onClick={() => setMenuOpen(false)}
									className='flex w-full items-center gap-2 px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10'
								>
									<Zap className='w-3.5 h-3.5' />
									Generate
								</Link>
							</div>
						)}
					</div>
				</div>

				{/* Description */}
				{scenario.description && (
					<p className='mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2'>
						{truncate(scenario.description, 120)}
					</p>
				)}

				{/* Badges row */}
				<div className='flex flex-wrap items-center gap-2 mt-3'>
					{/* Category */}
					<span className='inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300'>
						<Shield className='w-3 h-3' />
						{formatCategory(scenario.pretext_category)}
					</span>

					{/* Urgency */}
					<span
						className={cn(
							"inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
							URGENCY_COLORS[scenario.urgency_level] ?? URGENCY_COLORS[3],
						)}
					>
						<Gauge className='w-3 h-3' />
						{URGENCY_LABELS[scenario.urgency_level] ?? "Medium"}
					</span>

					{/* Channel */}
					<span className='inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300'>
						<ChannelIcon className='w-3 h-3' />
						{formatCategory(scenario.communication_channel)}
					</span>
				</div>

				{/* Footer */}
				<div className='flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50'>
					<span className='text-xs text-slate-500 dark:text-slate-400'>
						{formatCategory(scenario.target_role)}
					</span>
					<span className='inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500'>
						<Clock className='w-3 h-3' />
						{formatDate(scenario.created_at)}
					</span>
				</div>
			</div>
		</div>
	);
}

/** Loading skeleton for ScenarioCard */
export function ScenarioCardSkeleton() {
	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 animate-pulse'>
			<div className='h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded' />
			<div className='h-3 w-full bg-slate-200 dark:bg-slate-700 rounded mt-3' />
			<div className='flex gap-2 mt-3'>
				<div className='h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full' />
				<div className='h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full' />
				<div className='h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full' />
			</div>
			<div className='flex justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50'>
				<div className='h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded' />
			</div>
		</div>
	);
}
