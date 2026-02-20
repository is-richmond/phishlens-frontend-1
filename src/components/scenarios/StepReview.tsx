"use client";

import { UseFormReturn } from "react-hook-form";
import { formatCategory } from "@/lib/utils";
import {
	Pencil,
	User,
	Building2,
	Shield,
	Gauge,
	Mail,
	Globe,
	FileText,
	Briefcase,
	AlignLeft,
} from "lucide-react";
import type { ScenarioFormData } from "@/lib/validations/scenario";

const URGENCY_MAP: Record<number, string> = {
	1: "Low",
	2: "Moderate",
	3: "Medium",
	4: "High",
	5: "Critical",
};

const CHANNEL_MAP: Record<string, string> = {
	email: "Email",
	sms: "SMS",
	internal_chat: "Internal Chat",
};

const LANGUAGE_MAP: Record<string, string> = {
	english: "English",
	russian: "Russian (Русский)",
	kazakh: "Kazakh (Қазақша)",
};

interface StepReviewProps {
	form: UseFormReturn<ScenarioFormData>;
	onGoToStep: (step: number) => void;
}

/**
 * Step 4 — Review & Confirm
 *
 * Read-only summary of all wizard data with edit links back to each step.
 */
export function StepReview({ form, onGoToStep }: StepReviewProps) {
	const values = form.getValues();

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-1'>
					Review & Confirm
				</h2>
				<p className='text-sm text-slate-500 dark:text-slate-400'>
					Review your scenario configuration before creating it. Click the edit
					icon to go back and change any section.
				</p>
			</div>

			{/* Section 1 — Target */}
			<ReviewSection title='Target Configuration' step={1} onEdit={onGoToStep}>
				<ReviewRow icon={Briefcase} label='Title' value={values.title} />
				<ReviewRow
					icon={User}
					label='Target Persona'
					value={formatCategory(values.target_role)}
				/>
				<ReviewRow
					icon={Building2}
					label='Department'
					value={values.target_department || "—"}
				/>
				<ReviewRow
					icon={AlignLeft}
					label='Organization Context'
					value={values.organization_context || "—"}
					multiline
				/>
			</ReviewSection>

			{/* Section 2 — Pretext */}
			<ReviewSection title='Pretext Configuration' step={2} onEdit={onGoToStep}>
				<ReviewRow
					icon={Shield}
					label='Category'
					value={formatCategory(values.pretext_category)}
				/>
				<ReviewRow
					icon={AlignLeft}
					label='Pretext Description'
					value={values.pretext_description || "—"}
					multiline
				/>
				<ReviewRow
					icon={Gauge}
					label='Urgency Level'
					value={`${values.urgency_level} — ${URGENCY_MAP[values.urgency_level] ?? "Medium"}`}
				/>
			</ReviewSection>

			{/* Section 3 — Format */}
			<ReviewSection title='Format Configuration' step={3} onEdit={onGoToStep}>
				<ReviewRow
					icon={Mail}
					label='Channel'
					value={
						CHANNEL_MAP[values.communication_channel] ??
						values.communication_channel
					}
				/>
				<ReviewRow
					icon={Globe}
					label='Language'
					value={LANGUAGE_MAP[values.language] ?? values.language}
				/>
				<ReviewRow
					icon={FileText}
					label='Description'
					value={values.description || "—"}
					multiline
				/>
			</ReviewSection>
		</div>
	);
}

/* ── helper sub-components ── */

function ReviewSection({
	title,
	step,
	onEdit,
	children,
}: {
	title: string;
	step: number;
	onEdit: (s: number) => void;
	children: React.ReactNode;
}) {
	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden'>
			<div className='flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 px-5 py-3'>
				<h3 className='text-sm font-semibold text-slate-900 dark:text-white'>
					{title}
				</h3>
				<button
					type='button'
					onClick={() => onEdit(step)}
					className='inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline'
				>
					<Pencil className='w-3.5 h-3.5' />
					Edit
				</button>
			</div>
			<div className='divide-y divide-slate-100 dark:divide-slate-700/50 px-5'>
				{children}
			</div>
		</div>
	);
}

function ReviewRow({
	icon: Icon,
	label,
	value,
	multiline,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
	multiline?: boolean;
}) {
	return (
		<div className='flex gap-3 py-3'>
			<Icon className='w-4 h-4 text-slate-400 mt-0.5 shrink-0' />
			<div className='min-w-0 flex-1'>
				<p className='text-xs font-medium text-slate-500 dark:text-slate-400'>
					{label}
				</p>
				<p
					className={`text-sm text-slate-900 dark:text-white mt-0.5 ${
						multiline ? "whitespace-pre-wrap" : ""
					} ${value === "—" ? "text-slate-400 dark:text-slate-500 italic" : ""}`}
				>
					{value}
				</p>
			</div>
		</div>
	);
}
