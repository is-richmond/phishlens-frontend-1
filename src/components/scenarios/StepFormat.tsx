"use client";

import { UseFormReturn } from "react-hook-form";
import { FormSelect, FormTextarea } from "@/components/ui/FormElements";
import { cn } from "@/lib/utils";
import { Mail, MessageSquare, Smartphone } from "lucide-react";
import type { ScenarioFormData } from "@/lib/validations/scenario";

/** Channel options with icons */
const CHANNELS = [
	{
		value: "email" as const,
		label: "Email",
		description: "Traditional email-based phishing message",
		icon: Mail,
	},
	{
		value: "sms" as const,
		label: "SMS",
		description: "Text message / smishing attack",
		icon: Smartphone,
	},
	{
		value: "internal_chat" as const,
		label: "Internal Chat",
		description: "Slack, Teams, or similar platform message",
		icon: MessageSquare,
	},
];

/** Language options */
const LANGUAGE_OPTIONS = [
	{ value: "english", label: "English" },
	{ value: "russian", label: "Russian (Русский)" },
	{ value: "kazakh", label: "Kazakh (Қазақша)" },
];

interface StepFormatProps {
	form: UseFormReturn<ScenarioFormData>;
}

/**
 * Step 3 — Format Configuration
 *
 * Communication channel selection (radio-style cards) and language dropdown.
 */
export function StepFormat({ form }: StepFormatProps) {
	const {
		register,
		formState: { errors },
		setValue,
		watch,
	} = form;

	const selectedChannel = watch("communication_channel");

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-1'>
					Format Configuration
				</h2>
				<p className='text-sm text-slate-500 dark:text-slate-400'>
					Choose the delivery channel and language for the generated message.
				</p>
			</div>

			{/* Communication channel — radio cards */}
			<fieldset>
				<legend className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3'>
					Communication Channel
				</legend>

				<div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
					{CHANNELS.map((ch) => {
						const isSelected = selectedChannel === ch.value;
						return (
							<button
								key={ch.value}
								type='button'
								onClick={() =>
									setValue("communication_channel", ch.value, {
										shouldValidate: true,
									})
								}
								className={cn(
									"flex flex-col items-center gap-2.5 rounded-xl border-2 p-5 transition-all duration-150 text-center",
									isSelected
										? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 ring-2 ring-primary-500/20"
										: "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800",
								)}
							>
								<ch.icon
									className={cn(
										"w-6 h-6",
										isSelected
											? "text-primary-600 dark:text-primary-400"
											: "text-slate-400",
									)}
								/>
								<div>
									<p
										className={cn(
											"text-sm font-semibold",
											isSelected
												? "text-primary-700 dark:text-primary-300"
												: "text-slate-900 dark:text-white",
										)}
									>
										{ch.label}
									</p>
									<p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
										{ch.description}
									</p>
								</div>
							</button>
						);
					})}
				</div>

				{errors.communication_channel && (
					<p
						role='alert'
						className='mt-2 text-xs text-danger-600 dark:text-danger-400'
					>
						{errors.communication_channel.message}
					</p>
				)}
			</fieldset>

			{/* Language */}
			<FormSelect
				label='Language'
				options={LANGUAGE_OPTIONS}
				error={errors.language?.message}
				{...register("language")}
			/>

			{/* Description (optional) */}
			<FormTextarea
				label='Scenario Description'
				placeholder='Optional notes or description for this scenario…'
				hint="Internal notes visible only to you — won't be sent to the LLM."
				rows={3}
				error={errors.description?.message}
				{...register("description")}
			/>
		</div>
	);
}
