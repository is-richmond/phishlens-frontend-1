"use client";

import { UseFormReturn } from "react-hook-form";
import { FormTextarea } from "@/components/ui/FormElements";
import { cn } from "@/lib/utils";
import {
	KeyRound,
	Mail,
	QrCode,
	Target,
	Crown,
	Smartphone,
} from "lucide-react";
import type { ScenarioFormData } from "@/lib/validations/scenario";
import type { CategoryPreset, PretextCategory } from "@/types";

/** Icons for each pretext category */
const CATEGORY_ICONS: Record<PretextCategory, React.ElementType> = {
	credential_phishing: KeyRound,
	business_email_compromise: Mail,
	quishing: QrCode,
	spear_phishing: Target,
	whaling: Crown,
	smishing: Smartphone,
};

/** Color accents for category cards */
const CATEGORY_COLORS: Record<PretextCategory, string> = {
	credential_phishing:
		"border-primary-300 dark:border-primary-500/40 bg-primary-50 dark:bg-primary-500/10",
	business_email_compromise:
		"border-warning-300 dark:border-warning-500/40 bg-warning-50 dark:bg-warning-500/10",
	quishing:
		"border-success-300 dark:border-success-500/40 bg-success-50 dark:bg-success-500/10",
	spear_phishing:
		"border-danger-300 dark:border-danger-500/40 bg-danger-50 dark:bg-danger-500/10",
	whaling:
		"border-purple-300 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-500/10",
	smishing:
		"border-cyan-300 dark:border-cyan-500/40 bg-cyan-50 dark:bg-cyan-500/10",
};

const CATEGORY_ICON_COLORS: Record<PretextCategory, string> = {
	credential_phishing: "text-primary-600 dark:text-primary-400",
	business_email_compromise: "text-warning-600 dark:text-warning-400",
	quishing: "text-success-600 dark:text-success-400",
	spear_phishing: "text-danger-600 dark:text-danger-400",
	whaling: "text-purple-600 dark:text-purple-400",
	smishing: "text-cyan-600 dark:text-cyan-400",
};

/** Urgency level labels */
const URGENCY_LABELS: Record<number, { label: string; color: string }> = {
	1: { label: "Low", color: "text-success-600 dark:text-success-400" },
	2: { label: "Moderate", color: "text-primary-600 dark:text-primary-400" },
	3: { label: "Medium", color: "text-warning-600 dark:text-warning-400" },
	4: { label: "High", color: "text-orange-600 dark:text-orange-400" },
	5: { label: "Critical", color: "text-danger-600 dark:text-danger-400" },
};

interface StepPretextProps {
	form: UseFormReturn<ScenarioFormData>;
	categoryPresets: CategoryPreset[] | undefined;
	isLoadingPresets: boolean;
}

/**
 * Step 2 — Pretext Configuration
 *
 * Card-based category selector, optional description, and urgency slider.
 */
export function StepPretext({
	form,
	categoryPresets,
	isLoadingPresets,
}: StepPretextProps) {
	const {
		register,
		formState: { errors },
		setValue,
		watch,
	} = form;

	const selectedCategory = watch("pretext_category");
	const urgencyLevel = watch("urgency_level") ?? 3;

	/** Fallback categories when backend presets aren't loaded yet */
	const fallbackCategories: CategoryPreset[] = [
		{
			category: "credential_phishing",
			label: "Credential Phishing",
			description: {
				label: "Credential Phishing",
				description:
					"Attempts to steal login credentials through deceptive pages",
				tactics: ["Fake login pages", "Password reset lures"],
			},
		},
		{
			category: "business_email_compromise",
			label: "Business Email Compromise",
			description: {
				label: "Business Email Compromise",
				description: "Impersonation of executives or business partners",
				tactics: ["CEO fraud", "Invoice manipulation"],
			},
		},
		{
			category: "quishing",
			label: "Quishing",
			description: {
				label: "Quishing",
				description: "QR-code based phishing attacks",
				tactics: ["Malicious QR codes", "Fake payment portals"],
			},
		},
		{
			category: "spear_phishing",
			label: "Spear Phishing",
			description: {
				label: "Spear Phishing",
				description: "Highly targeted attacks against specific individuals",
				tactics: ["Personal reconnaissance", "Tailored pretexts"],
			},
		},
		{
			category: "whaling",
			label: "Whaling",
			description: {
				label: "Whaling",
				description:
					"Attacks targeting C-level executives and senior management",
				tactics: ["Board communications", "Strategic decisions"],
			},
		},
		{
			category: "smishing",
			label: "Smishing",
			description: {
				label: "Smishing",
				description: "SMS-based phishing attacks",
				tactics: ["Delivery notifications", "Bank alerts"],
			},
		},
	];

	const categories = categoryPresets ?? fallbackCategories;

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-1'>
					Pretext Configuration
				</h2>
				<p className='text-sm text-slate-500 dark:text-slate-400'>
					Select the phishing category and configure the urgency level.
				</p>
			</div>

			{/* Category cards */}
			<fieldset>
				<legend className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3'>
					Pretext Category
				</legend>

				{isLoadingPresets ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className='h-28 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 animate-pulse'
							/>
						))}
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
						{categories.map((cat) => {
							const Icon = CATEGORY_ICONS[cat.category] || Target;
							const isSelected = selectedCategory === cat.category;

							return (
								<button
									key={cat.category}
									type='button'
									onClick={() =>
										setValue("pretext_category", cat.category, {
											shouldValidate: true,
										})
									}
									className={cn(
										"relative rounded-xl border-2 p-4 text-left transition-all duration-150",
										isSelected
											? cn(
													CATEGORY_COLORS[cat.category],
													"ring-2 ring-primary-500/30",
												)
											: "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800",
									)}
								>
									<div className='flex items-start gap-3'>
										<Icon
											className={cn(
												"w-5 h-5 mt-0.5 shrink-0",
												isSelected
													? CATEGORY_ICON_COLORS[cat.category]
													: "text-slate-400",
											)}
										/>
										<div className='min-w-0'>
											<p className='text-sm font-semibold text-slate-900 dark:text-white'>
												{cat.label}
											</p>
											<p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2'>
												{cat.description.description}
											</p>
										</div>
									</div>
									{isSelected && (
										<span className='absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white'>
											<svg
												className='w-3 h-3'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
												strokeWidth={3}
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M5 13l4 4L19 7'
												/>
											</svg>
										</span>
									)}
								</button>
							);
						})}
					</div>
				)}

				{errors.pretext_category && (
					<p
						role='alert'
						className='mt-2 text-xs text-danger-600 dark:text-danger-400'
					>
						{errors.pretext_category.message}
					</p>
				)}
			</fieldset>

			{/* Pretext description */}
			<FormTextarea
				label='Pretext Description'
				placeholder='Optionally describe the specific pretext or cover story for this scenario…'
				hint='Provide additional details for the LLM to craft a more convincing message.'
				rows={3}
				error={errors.pretext_description?.message}
				{...register("pretext_description")}
			/>

			{/* Urgency slider */}
			<div className='space-y-3'>
				<label className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
					Urgency Level
				</label>

				<div className='space-y-2'>
					<input
						type='range'
						min={1}
						max={5}
						step={1}
						value={urgencyLevel}
						onChange={(e) =>
							setValue("urgency_level", Number(e.target.value), {
								shouldValidate: true,
							})
						}
						className='w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-600
							[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
							[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer'
					/>

					{/* Scale labels */}
					<div className='flex justify-between px-0.5'>
						{[1, 2, 3, 4, 5].map((level) => (
							<button
								key={level}
								type='button'
								onClick={() =>
									setValue("urgency_level", level, {
										shouldValidate: true,
									})
								}
								className={cn(
									"text-xs font-medium transition-colors",
									urgencyLevel === level
										? URGENCY_LABELS[level].color
										: "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300",
								)}
							>
								{URGENCY_LABELS[level].label}
							</button>
						))}
					</div>
				</div>

				{errors.urgency_level && (
					<p
						role='alert'
						className='text-xs text-danger-600 dark:text-danger-400'
					>
						{errors.urgency_level.message}
					</p>
				)}
			</div>
		</div>
	);
}
