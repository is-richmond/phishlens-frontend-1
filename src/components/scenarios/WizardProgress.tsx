"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

/**
 * Wizard step definitions used by the progress bar and the wizard container.
 */
export const WIZARD_STEPS = [
	{ id: 1, label: "Target", description: "Who is being targeted" },
	{ id: 2, label: "Pretext", description: "Attack category & urgency" },
	{ id: 3, label: "Format", description: "Channel & language" },
	{ id: 4, label: "Review", description: "Confirm & create" },
] as const;

interface WizardProgressProps {
	currentStep: number;
	onStepClick?: (step: number) => void;
}

/**
 * Horizontal progress bar for the 4-step scenario wizard.
 * Completed steps show a checkmark; the active step is highlighted.
 */
export function WizardProgress({
	currentStep,
	onStepClick,
}: WizardProgressProps) {
	return (
		<nav aria-label='Wizard progress' className='mb-8'>
			<ol className='flex items-center'>
				{WIZARD_STEPS.map((step, index) => {
					const isCompleted = currentStep > step.id;
					const isActive = currentStep === step.id;
					const isLast = index === WIZARD_STEPS.length - 1;

					return (
						<li
							key={step.id}
							className={cn("flex items-center", !isLast && "flex-1")}
						>
							{/* Step circle + label */}
							<button
								type='button'
								onClick={() => onStepClick?.(step.id)}
								disabled={!onStepClick || step.id > currentStep}
								className={cn(
									"flex flex-col items-center gap-1.5 group",
									step.id <= currentStep
										? "cursor-pointer"
										: "cursor-not-allowed",
								)}
							>
								<span
									className={cn(
										"flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
										isCompleted && "bg-primary-600 text-white",
										isActive &&
											"bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-500/20",
										!isCompleted &&
											!isActive &&
											"bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
									)}
								>
									{isCompleted ? <Check className='w-4 h-4' /> : step.id}
								</span>
								<span
									className={cn(
										"text-xs font-medium hidden sm:block",
										isActive
											? "text-primary-600 dark:text-primary-400"
											: isCompleted
												? "text-slate-700 dark:text-slate-300"
												: "text-slate-400 dark:text-slate-500",
									)}
								>
									{step.label}
								</span>
							</button>

							{/* Connector line */}
							{!isLast && (
								<div className='flex-1 mx-3 sm:mx-4'>
									<div
										className={cn(
											"h-0.5 rounded-full transition-colors duration-200",
											isCompleted
												? "bg-primary-600"
												: "bg-slate-200 dark:bg-slate-700",
										)}
									/>
								</div>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
