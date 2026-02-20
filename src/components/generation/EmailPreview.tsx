"use client";

import { cn } from "@/lib/utils";
import { formatDateTime, formatCategory } from "@/lib/utils";
import { Mail, MessageSquare, Smartphone, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Generation, Scenario, CommunicationChannel } from "@/types";

/* ────────────────────────────────────────────────────────────
   EmailPreview — Simulated email/SMS/chat client
   Shows generated message in context-appropriate format
   ──────────────────────────────────────────────────────────── */

interface EmailPreviewProps {
	generation: Generation;
	scenario: Scenario | null;
}

const CHANNEL_ICONS: Record<CommunicationChannel, React.ElementType> = {
	email: Mail,
	sms: Smartphone,
	internal_chat: MessageSquare,
};

const CHANNEL_LABELS: Record<CommunicationChannel, string> = {
	email: "Email",
	sms: "SMS Message",
	internal_chat: "Internal Chat",
};

export function EmailPreview({ generation, scenario }: EmailPreviewProps) {
	const [copied, setCopied] = useState(false);
	const channel: CommunicationChannel =
		scenario?.communication_channel ?? "email";
	const ChannelIcon = CHANNEL_ICONS[channel];

	const handleCopy = async () => {
		const text = generation.generated_subject
			? `Subject: ${generation.generated_subject}\n\n${generation.generated_text}`
			: generation.generated_text;
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden'>
			{/* Channel header bar */}
			<div className='flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50'>
				<div className='flex items-center gap-2'>
					<ChannelIcon className='h-4 w-4 text-slate-400' />
					<span className='text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
						{CHANNEL_LABELS[channel]}
					</span>
				</div>
				<button
					type='button'
					onClick={handleCopy}
					className='inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
				>
					{copied ? (
						<>
							<Check className='h-3.5 w-3.5 text-success-500' />
							Copied
						</>
					) : (
						<>
							<Copy className='h-3.5 w-3.5' />
							Copy
						</>
					)}
				</button>
			</div>

			{/* Email headers (only for email channel) */}
			{channel === "email" && (
				<div className='px-5 py-3 border-b border-slate-100 dark:border-slate-700/50 space-y-1.5'>
					{generation.generated_subject && (
						<div className='flex items-start gap-2'>
							<span className='text-xs font-medium text-slate-400 dark:text-slate-500 w-14 shrink-0 pt-0.5'>
								Subject
							</span>
							<span className='text-sm font-semibold text-slate-900 dark:text-white'>
								{generation.generated_subject}
							</span>
						</div>
					)}
					<div className='flex items-start gap-2'>
						<span className='text-xs font-medium text-slate-400 dark:text-slate-500 w-14 shrink-0 pt-0.5'>
							From
						</span>
						<span className='text-sm text-slate-600 dark:text-slate-300'>
							[SENDER_NAME] &lt;[SENDER_EMAIL]&gt;
						</span>
					</div>
					<div className='flex items-start gap-2'>
						<span className='text-xs font-medium text-slate-400 dark:text-slate-500 w-14 shrink-0 pt-0.5'>
							To
						</span>
						<span className='text-sm text-slate-600 dark:text-slate-300'>
							{scenario?.target_role ?? "[TARGET_NAME]"} &lt;[TARGET_EMAIL]&gt;
						</span>
					</div>
					<div className='flex items-start gap-2'>
						<span className='text-xs font-medium text-slate-400 dark:text-slate-500 w-14 shrink-0 pt-0.5'>
							Date
						</span>
						<span className='text-sm text-slate-600 dark:text-slate-300'>
							{formatDateTime(generation.created_at)}
						</span>
					</div>
				</div>
			)}

			{/* SMS / chat header */}
			{channel !== "email" && scenario && (
				<div className='px-5 py-3 border-b border-slate-100 dark:border-slate-700/50'>
					<div className='flex items-center justify-between'>
						<span className='text-xs text-slate-500 dark:text-slate-400'>
							To: {scenario.target_role}
							{scenario.target_department && ` — ${scenario.target_department}`}
						</span>
						<span className='text-xs text-slate-400 dark:text-slate-500'>
							{formatDateTime(generation.created_at)}
						</span>
					</div>
				</div>
			)}

			{/* Message body */}
			<div className='px-5 py-4'>
				<div
					className={cn(
						"text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap",
						channel === "sms" &&
							"bg-primary-50 dark:bg-primary-500/5 rounded-xl p-4 max-w-md",
						channel === "internal_chat" &&
							"bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 max-w-lg",
					)}
				>
					{generation.generated_text}
				</div>
			</div>

			{/* Watermark footer */}
			<div className='px-5 py-2 border-t border-slate-100 dark:border-slate-700/50 bg-warning-50/50 dark:bg-warning-500/5'>
				<p className='text-[10px] font-medium text-warning-600 dark:text-warning-400 text-center tracking-wide'>
					{generation.watermark}
				</p>
			</div>

			{/* Metadata footer */}
			<div className='px-5 py-2.5 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-4 flex-wrap text-[11px] text-slate-400 dark:text-slate-500'>
				{scenario && (
					<span>Category: {formatCategory(scenario.pretext_category)}</span>
				)}
				<span>Model: {generation.model_used}</span>
				{generation.generation_time_ms && (
					<span>{(generation.generation_time_ms / 1000).toFixed(1)}s</span>
				)}
			</div>
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   EmailPreviewSkeleton
   ──────────────────────────────────────────────────────────── */

export function EmailPreviewSkeleton() {
	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden animate-pulse'>
			<div className='px-5 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50'>
				<div className='h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded' />
			</div>
			<div className='px-5 py-3 border-b border-slate-100 dark:border-slate-700/50 space-y-2'>
				<div className='h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded' />
			</div>
			<div className='px-5 py-4 space-y-2'>
				<div className='h-3 w-full bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-full bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-full bg-slate-200 dark:bg-slate-700 rounded' />
				<div className='h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded' />
			</div>
		</div>
	);
}
