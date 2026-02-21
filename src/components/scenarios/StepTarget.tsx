"use client";

import { UseFormReturn } from "react-hook-form";
import { FormInput, FormSelect, FormTextarea } from "@/components/ui/FormElements";
import { User, Building2, Briefcase } from "lucide-react";
import type { ScenarioFormData } from "@/lib/validations/scenario";
import type { PersonaPreset } from "@/types";

interface StepTargetProps {
	form: UseFormReturn<ScenarioFormData>;
	personaPresets: PersonaPreset[] | undefined;
	isLoadingPresets: boolean;
}

/**
 * Step 1 — Target Configuration
 *
 * Collects the scenario title, target persona, department, and organization context.
 */
export function StepTarget({ form, personaPresets, isLoadingPresets }: StepTargetProps) {
	const {
		register,
		formState: { errors },
		setValue,
		watch,
	} = form;

	const selectedRole = watch("target_role");

	/** When a persona is selected, auto-fill the department suggestion */
	function handlePersonaChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const role = e.target.value;
		setValue("target_role", role, { shouldValidate: true });

		const preset = personaPresets?.find((p) => p.target_role === role);
		if (preset?.suggested_department) {
			const currentDept = form.getValues("target_department");
			if (!currentDept) {
				setValue("target_department", preset.suggested_department);
			}
		}
	}

	const personaOptions = isLoadingPresets
		? [{ value: "", label: "Loading personas…" }]
		: (personaPresets ?? []).map((p) => ({
				value: p.target_role,
				label: p.description.label,
			}));

	const selectedPreset = personaPresets?.find(
		(p) => p.target_role === selectedRole,
	);

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-1'>
					Target Configuration
				</h2>
				<p className='text-sm text-slate-500 dark:text-slate-400'>
					Define who the phishing scenario targets and the organizational context.
				</p>
			</div>

			{/* Title */}
			<FormInput
				label='Scenario Title'
				placeholder='e.g., Q1 Security Assessment — Finance Team'
				icon={<Briefcase className='w-4 h-4' />}
				error={errors.title?.message}
				{...register("title")}
			/>

			{/* Target Persona */}
			<FormSelect
				label='Target Persona'
				placeholder='Select a target persona…'
				options={personaOptions}
				error={errors.target_role?.message}
				value={selectedRole}
				onChange={handlePersonaChange}
			/>

			{/* Persona context hint */}
			{selectedPreset && (
				<div className='rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 px-4 py-3'>
					<p className='text-sm text-primary-700 dark:text-primary-400'>
						<span className='font-medium'>Context:</span>{" "}
						{selectedPreset.description.context}
					</p>
				</div>
			)}

			{/* Department */}
			<FormInput
				label='Target Department'
				placeholder='e.g., Finance, Engineering, HR'
				icon={<Building2 className='w-4 h-4' />}
				error={errors.target_department?.message}
				{...register("target_department")}
			/>

			{/* Organization context */}
			<FormTextarea
				label='Organization Context'
				placeholder="Describe the target organization's industry, size, culture, or any specific details that should be reflected in the phishing message…"
				hint='Optional — helps the LLM generate more realistic, context-aware messages.'
				rows={4}
				error={errors.organization_context?.message}
				{...register("organization_context")}
			/>
		</div>
	);
}
