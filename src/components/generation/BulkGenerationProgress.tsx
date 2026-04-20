'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export const BULK_GENERATION_STEPS = [
  { id: 'upload', label: 'Upload File', icon: '📤' },
  { id: 'mapping', label: 'Map Fields', icon: '🔗' },
  { id: 'processing', label: 'Generate', icon: '⚙️' },
  { id: 'results', label: 'Results', icon: '✅' },
] as const;

interface BulkGenerationProgressProps {
  currentStep: 'upload' | 'mapping' | 'processing' | 'results';
  onStepClick?: (step: 'upload' | 'mapping' | 'processing' | 'results') => void;
}

export function BulkGenerationProgress({
  currentStep,
  onStepClick,
}: BulkGenerationProgressProps) {
  const currentStepIndex = BULK_GENERATION_STEPS.findIndex(
    (s) => s.id === currentStep,
  );

  return (
    <nav aria-label="Bulk generation progress" className="mb-8">
      <ol className="flex items-center">
        {BULK_GENERATION_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = step.id === currentStep;
          const isLast = index === BULK_GENERATION_STEPS.length - 1;

          return (
            <li
              key={step.id}
              className={cn('flex items-center', !isLast && 'flex-1')}
            >
              {/* Step circle + label */}
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                disabled={!onStepClick || index > currentStepIndex}
                className={cn(
                  'flex flex-col items-center gap-1.5 group',
                  index <= currentStepIndex
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed',
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200',
                    isCompleted && 'bg-blue-600 text-white',
                    isActive &&
                      'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-500/20',
                    !isCompleted &&
                      !isActive &&
                      'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.icon}
                </span>
                <span
                  className={cn(
                    'text-xs font-medium hidden sm:block whitespace-nowrap',
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : isCompleted
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-500',
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-3 sm:mx-4">
                  <div
                    className={cn(
                      'h-1 rounded-full transition-colors duration-200',
                      isCompleted
                        ? 'bg-blue-600'
                        : 'bg-slate-200 dark:bg-slate-700',
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
