"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertTriangle, Zap } from "lucide-react";
import { useGeneration, useScenario } from "@/lib/hooks";
import { api, ApiError } from "@/lib/api";
import { Button, Alert } from "@/components/ui/FormElements";
import {
	GenerationResult,
	GenerationResultSkeleton,
} from "@/components/generation/GenerationResult";
import { AddToCampaignModal } from "@/components/generation/AddToCampaignModal";
import type { Generation } from "@/types";

/* ────────────────────────────────────────────────────────────
   /generate/[id] — View a specific generation by ID
   ──────────────────────────────────────────────────────────── */

export default function GenerationDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const generationId = params.id;

	const {
		data: generation,
		isLoading,
		error: fetchError,
		mutate,
	} = useGeneration(generationId ?? null);
	const { data: scenario } = useScenario(generation?.scenario_id ?? null);

	const [isRegenerating, setIsRegenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showCampaignModal, setShowCampaignModal] = useState(false);

	const handleRegenerate = useCallback(
		async (paramOverrides: {
			temperature?: number;
			max_tokens?: number;
			model_variant?: string;
		}) => {
			if (!generation) return;

			setIsRegenerating(true);
			setError(null);

			try {
				const inputParams = generation.input_parameters ?? {};
				const body = {
					scenario_id: generation.scenario_id,
					template_id: generation.template_id,
					temperature:
						paramOverrides.temperature ??
						(inputParams.temperature as number) ??
						0.7,
					max_tokens:
						paramOverrides.max_tokens ??
						(inputParams.max_tokens as number) ??
						1024,
					model_variant:
						paramOverrides.model_variant ??
						(inputParams.model_variant as string) ??
						"gemini-2.5-flash-lite",
				};

				const result = await api.post<Generation>("/v1/generations", body);
				// Navigate to the new generation
				router.push(`/generate/${result.id}`);
			} catch (err) {
				if (err instanceof ApiError) {
					setError(err.message);
				} else {
					setError("An unexpected error occurred during regeneration.");
				}
			} finally {
				setIsRegenerating(false);
			}
		},
		[generation, router],
	);

	const handleAddToCampaign = () => {
		setShowCampaignModal(true);
	};

	// Loading state
	if (isLoading) {
		return (
			<div>
				<div className='flex items-center gap-3 mb-6'>
					<Zap className='h-7 w-7 text-primary-600' />
					<div>
						<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
							Generation Details
						</h1>
						<p className='text-sm text-slate-500 dark:text-slate-400'>
							Loading generation...
						</p>
					</div>
				</div>
				<GenerationResultSkeleton />
			</div>
		);
	}

	// Error / not found
	if (fetchError || !generation) {
		return (
			<div>
				<div className='flex items-center gap-3 mb-6'>
					<Zap className='h-7 w-7 text-primary-600' />
					<div>
						<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
							Generation Not Found
						</h1>
						<p className='text-sm text-slate-500 dark:text-slate-400'>
							The requested generation could not be loaded
						</p>
					</div>
				</div>

				<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center'>
					<AlertTriangle className='h-10 w-10 text-warning-500 mx-auto mb-3' />
					<p className='text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
						Generation not found
					</p>
					<p className='text-xs text-slate-500 dark:text-slate-400 mb-4'>
						It may have been deleted or you don't have access to it.
					</p>
					<Button
						variant='outline'
						onClick={() => router.push("/generate")}
						className='text-xs'
					>
						<ArrowLeft className='h-3.5 w-3.5' />
						Back to Generate
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div>
			{/* Page header */}
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center gap-3'>
					<Zap className='h-7 w-7 text-primary-600' />
					<div>
						<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
							Generation Details
						</h1>
						<p className='text-sm text-slate-500 dark:text-slate-400'>
							{generation.generated_subject || "Phishing message result"}
						</p>
					</div>
				</div>

				<Button
					variant='ghost'
					onClick={() => router.push("/generate")}
					className='text-xs'
				>
					<ArrowLeft className='h-3.5 w-3.5' />
					New Generation
				</Button>
			</div>

			{/* Error */}
			{error && (
				<div className='mb-6'>
					<Alert variant='error'>{error}</Alert>
				</div>
			)}

			{/* Result */}
			<GenerationResult
				generation={generation}
				scenario={scenario ?? null}
				onRegenerate={handleRegenerate}
				onAddToCampaign={handleAddToCampaign}
				isRegenerating={isRegenerating}
			/>

			{/* Add to Campaign modal */}
			{showCampaignModal && (
				<AddToCampaignModal
					generationId={generation.id}
					onClose={() => setShowCampaignModal(false)}
					onSuccess={() => setShowCampaignModal(false)}
				/>
			)}
		</div>
	);
}
