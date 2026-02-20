"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
	scenarioCreateSchema,
	scenarioDefaults,
	stepTargetSchema,
	stepPretextSchema,
	stepFormatSchema,
	type ScenarioFormData,
} from "@/lib/validations/scenario";
import { usePersonaPresets, useCategoryPresets } from "@/lib/hooks";
import { WizardProgress } from "./WizardProgress";
import { StepTarget } from "./StepTarget";
import { StepPretext } from "./StepPretext";
import { StepFormat } from "./StepFormat";
import { StepReview } from "./StepReview";
import { Button, Alert } from "@/components/ui/FormElements";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import type { Scenario, PersonaPreset, CategoryPreset } from "@/types";

/** Zod schema for each step — used for per-step validation */
const STEP_SCHEMAS = [
	stepTargetSchema,
	stepPretextSchema,
	stepFormatSchema,
	null, // review step has no additional validation
];

interface ScenarioWizardProps {
	/** If provided, pre-populates the form for editing */
	editScenario?: Scenario;
	/** Called when the user cancels or finishes */
	onClose: () => void;
}

/**
 * Multi-step wizard for creating or editing a phishing scenario.
 *
 * 4 steps: Target → Pretext → Format → Review & Confirm
 */
export function ScenarioWizard({ editScenario, onClose }: ScenarioWizardProps) {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	// Preset data
	const { data: personaPresets, isLoading: loadingPersonas } =
		usePersonaPresets();
	const { data: categoryPresets, isLoading: loadingCategories } =
		useCategoryPresets();

	// Form state
	const form = useForm<ScenarioFormData>({
		resolver: zodResolver(scenarioCreateSchema),
		defaultValues: editScenario
			? {
					title: editScenario.title,
					target_role: editScenario.target_role,
					target_department: editScenario.target_department ?? "",
					organization_context: editScenario.organization_context ?? "",
					pretext_category: editScenario.pretext_category,
					pretext_description: editScenario.pretext_description ?? "",
					urgency_level: editScenario.urgency_level,
					communication_channel: editScenario.communication_channel,
					language: editScenario.language,
					description: editScenario.description ?? "",
				}
			: scenarioDefaults,
		mode: "onTouched",
	});

	/** Validate only the current step's fields before advancing */
	async function validateCurrentStep(): Promise<boolean> {
		const schema = STEP_SCHEMAS[currentStep - 1];
		if (!schema) return true; // review step

		const values = form.getValues();
		const result = schema.safeParse(values);

		if (!result.success) {
			// Trigger validation errors on form fields
			const fieldNames = Object.keys(
				schema.shape,
			) as (keyof ScenarioFormData)[];
			await form.trigger(fieldNames);
			return false;
		}

		return true;
	}

	async function goNext() {
		const valid = await validateCurrentStep();
		if (valid && currentStep < 4) {
			setCurrentStep((s) => s + 1);
		}
	}

	function goPrev() {
		if (currentStep > 1) {
			setCurrentStep((s) => s - 1);
		}
	}

	function goToStep(step: number) {
		if (step >= 1 && step <= 4) {
			setCurrentStep(step);
		}
	}

	async function handleSubmit() {
		// Full form validation
		const isValid = await form.trigger();
		if (!isValid) return;

		setIsSubmitting(true);
		setApiError(null);

		try {
			const data = form.getValues();

			// Clean up empty strings → undefined so backend uses defaults
			const payload = {
				title: data.title,
				target_role: data.target_role,
				target_department: data.target_department || undefined,
				organization_context: data.organization_context || undefined,
				pretext_category: data.pretext_category,
				pretext_description: data.pretext_description || undefined,
				urgency_level: data.urgency_level,
				communication_channel: data.communication_channel,
				language: data.language,
				description: data.description || undefined,
			};

			if (editScenario) {
				await api.put<Scenario>(`/v1/scenarios/${editScenario.id}`, payload);
			} else {
				await api.post<Scenario>("/v1/scenarios", payload);
			}

			onClose();
			router.refresh();
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "An unexpected error occurred";
			setApiError(message);
		} finally {
			setIsSubmitting(false);
		}
	}

	const isFirstStep = currentStep === 1;
	const isLastStep = currentStep === 4;

	return (
		<div className='rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'>
			{/* Header */}
			<div className='flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4'>
				<h1 className='text-lg font-bold text-slate-900 dark:text-white'>
					{editScenario ? "Edit Scenario" : "Create New Scenario"}
				</h1>
				<button
					type='button'
					onClick={onClose}
					className='rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
					aria-label='Close wizard'
				>
					<X className='w-5 h-5' />
				</button>
			</div>

			{/* Progress bar */}
			<div className='px-6 pt-6'>
				<WizardProgress currentStep={currentStep} onStepClick={goToStep} />
			</div>

			{/* Step content */}
			<div className='px-6 pb-2 min-h-[340px]'>
				{apiError && (
					<Alert variant='error' className='mb-4'>
						{apiError}
					</Alert>
				)}

				{currentStep === 1 && (
					<StepTarget
						form={form}
						personaPresets={personaPresets as PersonaPreset[] | undefined}
						isLoadingPresets={loadingPersonas}
					/>
				)}
				{currentStep === 2 && (
					<StepPretext
						form={form}
						categoryPresets={categoryPresets as CategoryPreset[] | undefined}
						isLoadingPresets={loadingCategories}
					/>
				)}
				{currentStep === 3 && <StepFormat form={form} />}
				{currentStep === 4 && <StepReview form={form} onGoToStep={goToStep} />}
			</div>

			{/* Navigation buttons */}
			<div className='flex items-center justify-between border-t border-slate-200 dark:border-slate-700 px-6 py-4'>
				<Button
					variant='outline'
					onClick={isFirstStep ? onClose : goPrev}
					type='button'
				>
					{isFirstStep ? (
						"Cancel"
					) : (
						<>
							<ArrowLeft className='w-4 h-4' />
							Back
						</>
					)}
				</Button>

				{isLastStep ? (
					<Button onClick={handleSubmit} isLoading={isSubmitting} type='button'>
						<Check className='w-4 h-4' />
						{editScenario ? "Save Changes" : "Create Scenario"}
					</Button>
				) : (
					<Button onClick={goNext} type='button'>
						Next
						<ArrowRight className='w-4 h-4' />
					</Button>
				)}
			</div>
		</div>
	);
}
