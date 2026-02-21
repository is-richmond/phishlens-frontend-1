"use client";

import { useState, useCallback } from "react";
import {
	Zap,
	ChevronRight,
	Target,
	LayoutTemplate,
	Loader2,
	AlertTriangle,
	ArrowLeft,
	Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCategory, formatDate } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import { useScenarios, useTemplates, useScenario } from "@/lib/hooks";
import { Button, Alert } from "@/components/ui/FormElements";
import {
	GenerationResult,
	GenerationResultSkeleton,
} from "@/components/generation/GenerationResult";
import { AddToCampaignModal } from "@/components/generation/AddToCampaignModal";
import type { Scenario, Template, Generation } from "@/types";

/* ────────────────────────────────────────────────────────────
   GeneratePage — Full generation flow
   Step 1: Select Scenario
   Step 2: Select Template (optional)
   Step 3: Configure & Generate
   Step 4: View Results
   ──────────────────────────────────────────────────────────── */

type GenerateStep = "scenario" | "template" | "configure" | "result";

const STEPS: { id: GenerateStep; label: string; icon: React.ElementType }[] = [
	{ id: "scenario", label: "Scenario", icon: Target },
	{ id: "template", label: "Template", icon: LayoutTemplate },
	{ id: "configure", label: "Generate", icon: Zap },
	{ id: "result", label: "Results", icon: Check },
];

export default function GeneratePage() {
	const [step, setStep] = useState<GenerateStep>("scenario");
	const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
		null,
	);
	const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
		null,
	);
	const [generation, setGeneration] = useState<Generation | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showCampaignModal, setShowCampaignModal] = useState(false);

	// Generation parameters
	const [temperature, setTemperature] = useState(0.7);
	const [maxTokens, setMaxTokens] = useState(1024);
	const [modelVariant, setModelVariant] = useState("gemini-2.5-flash-lite");

	const handleSelectScenario = (scenario: Scenario) => {
		setSelectedScenario(scenario);
		setStep("template");
	};

	const handleSelectTemplate = (template: Template | null) => {
		setSelectedTemplate(template);
		setStep("configure");
	};

	const handleGenerate = useCallback(
		async (paramOverrides?: {
			temperature?: number;
			max_tokens?: number;
			model_variant?: string;
		}) => {
			if (!selectedScenario) return;

			setIsGenerating(true);
			setError(null);

			try {
				const body = {
					scenario_id: selectedScenario.id,
					template_id: selectedTemplate?.id,
					temperature: paramOverrides?.temperature ?? temperature,
					max_tokens: paramOverrides?.max_tokens ?? maxTokens,
					model_variant: paramOverrides?.model_variant ?? modelVariant,
				};

				const result = await api.post<Generation>("/v1/generations", body);
				setGeneration(result);
				setStep("result");
			} catch (err) {
				if (err instanceof ApiError) {
					setError(err.message);
				} else {
					setError("An unexpected error occurred during generation.");
				}
			} finally {
				setIsGenerating(false);
			}
		},
		[selectedScenario, selectedTemplate, temperature, maxTokens, modelVariant],
	);

	const handleRegenerate = (params: {
		temperature?: number;
		max_tokens?: number;
		model_variant?: string;
	}) => {
		if (params.temperature !== undefined) setTemperature(params.temperature);
		if (params.max_tokens !== undefined) setMaxTokens(params.max_tokens);
		if (params.model_variant !== undefined)
			setModelVariant(params.model_variant);
		handleGenerate(params);
	};

	const handleAddToCampaign = () => {
		if (generation) {
			setShowCampaignModal(true);
		}
	};

	const handleReset = () => {
		setStep("scenario");
		setSelectedScenario(null);
		setSelectedTemplate(null);
		setGeneration(null);
		setError(null);
	};

	const currentStepIndex = STEPS.findIndex((s) => s.id === step);

	return (
		<div>
			{/* Page header */}
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center gap-3'>
					<Zap className='h-7 w-7 text-primary-600' />
					<div>
						<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
							Generate
						</h1>
						<p className='text-sm text-slate-500 dark:text-slate-400'>
							Create phishing messages for security research
						</p>
					</div>
				</div>

				{step !== "scenario" && (
					<Button variant='ghost' onClick={handleReset} className='text-xs'>
						<ArrowLeft className='h-3.5 w-3.5' />
						Start Over
					</Button>
				)}
			</div>

			{/* Step progress */}
			<div className='flex items-center gap-1 mb-8'>
				{STEPS.map((s, i) => {
					const isActive = s.id === step;
					const isCompleted = i < currentStepIndex;
					const StepIcon = s.icon;

					return (
						<div key={s.id} className='flex items-center'>
							{i > 0 && (
								<ChevronRight
									className={cn(
										"h-4 w-4 mx-1",
										isCompleted
											? "text-primary-500"
											: "text-slate-300 dark:text-slate-600",
									)}
								/>
							)}
							<div
								className={cn(
									"flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
									isActive
										? "bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
										: isCompleted
											? "bg-success-50 dark:bg-success-500/10 text-success-700 dark:text-success-400"
											: "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500",
								)}
							>
								<StepIcon className='h-3.5 w-3.5' />
								{s.label}
							</div>
						</div>
					);
				})}
			</div>

			{/* Error */}
			{error && (
				<div className='mb-6'>
					<Alert variant='error'>{error}</Alert>
				</div>
			)}

			{/* Step content */}
			{step === "scenario" && (
				<ScenarioSelector onSelect={handleSelectScenario} />
			)}
			{step === "template" && (
				<TemplateSelector
					scenario={selectedScenario}
					onSelect={handleSelectTemplate}
					onBack={() => setStep("scenario")}
				/>
			)}
			{step === "configure" && (
				<ConfigurePanel
					scenario={selectedScenario}
					template={selectedTemplate}
					temperature={temperature}
					maxTokens={maxTokens}
					modelVariant={modelVariant}
					onTemperatureChange={setTemperature}
					onMaxTokensChange={setMaxTokens}
					onModelVariantChange={setModelVariant}
					onGenerate={() => handleGenerate()}
					onBack={() => setStep("template")}
					isGenerating={isGenerating}
				/>
			)}
			{step === "result" && generation && (
				<GenerationResult
					generation={generation}
					scenario={selectedScenario}
					onRegenerate={handleRegenerate}
					onAddToCampaign={handleAddToCampaign}
					isRegenerating={isGenerating}
				/>
			)}
			{step === "result" && isGenerating && !generation && (
				<GenerationResultSkeleton />
			)}

			{/* Add to Campaign modal */}
			{showCampaignModal && generation && (
				<AddToCampaignModal
					generationId={generation.id}
					onClose={() => setShowCampaignModal(false)}
					onSuccess={() => setShowCampaignModal(false)}
				/>
			)}
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   ScenarioSelector — Step 1
   ──────────────────────────────────────────────────────────── */

function ScenarioSelector({
	onSelect,
}: {
	onSelect: (scenario: Scenario) => void;
}) {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const { data, isLoading } = useScenarios({
		page,
		per_page: 12,
		search: search || undefined,
	});

	return (
		<div>
			<div className='mb-4'>
				<h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
					Select a Scenario
				</h2>
				<p className='text-sm text-slate-500 dark:text-slate-400'>
					Choose the phishing scenario to generate a message for
				</p>
			</div>

			{/* Search */}
			<div className='mb-4'>
				<input
					type='text'
					placeholder='Search scenarios...'
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setPage(1);
					}}
					className='w-full max-w-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
				/>
			</div>

			{/* Loading */}
			{isLoading && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 animate-pulse'
						>
							<div className='h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2' />
							<div className='h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-3' />
							<div className='h-3 w-full bg-slate-200 dark:bg-slate-700 rounded' />
						</div>
					))}
				</div>
			)}

			{/* Scenario list */}
			{data && data.items.length > 0 && (
				<>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
						{data.items.map((scenario) => (
							<button
								key={scenario.id}
								type='button'
								onClick={() => onSelect(scenario)}
								className='text-left rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:border-primary-300 dark:hover:border-primary-500/50 hover:shadow-sm transition-all group'
							>
								<h3 className='text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate'>
									{scenario.title}
								</h3>
								<div className='flex items-center gap-2 mt-1 mb-2'>
									<span className='inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400'>
										{formatCategory(scenario.pretext_category)}
									</span>
									<span className='text-[10px] text-slate-400'>
										{scenario.communication_channel}
									</span>
								</div>
								<p className='text-xs text-slate-500 dark:text-slate-400 line-clamp-2'>
									{scenario.description || `Target: ${scenario.target_role}`}
								</p>
								<p className='text-[10px] text-slate-400 mt-2'>
									{formatDate(scenario.created_at)}
								</p>
							</button>
						))}
					</div>

					{/* Pagination */}
					{data.total > 12 && (
						<div className='flex justify-center gap-2 mt-4'>
							<Button
								variant='outline'
								disabled={page <= 1}
								onClick={() => setPage((p) => p - 1)}
								className='text-xs'
							>
								Previous
							</Button>
							<span className='flex items-center text-xs text-slate-500'>
								Page {page} of {Math.ceil(data.total / 12)}
							</span>
							<Button
								variant='outline'
								disabled={page >= Math.ceil(data.total / 12)}
								onClick={() => setPage((p) => p + 1)}
								className='text-xs'
							>
								Next
							</Button>
						</div>
					)}
				</>
			)}

			{/* Empty state */}
			{data && data.items.length === 0 && (
				<div className='text-center py-12'>
					<Target className='h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3' />
					<p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
						No scenarios found
					</p>
					<p className='text-xs text-slate-400 dark:text-slate-500 mt-1'>
						Create a scenario first from the Scenarios page
					</p>
				</div>
			)}
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   TemplateSelector — Step 2
   ──────────────────────────────────────────────────────────── */

function TemplateSelector({
	scenario,
	onSelect,
	onBack,
}: {
	scenario: Scenario | null;
	onSelect: (template: Template | null) => void;
	onBack: () => void;
}) {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const { data, isLoading } = useTemplates({
		page,
		per_page: 12,
		category: scenario?.pretext_category,
		search: search || undefined,
	});

	return (
		<div>
			<div className='flex items-center justify-between mb-4'>
				<div>
					<h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
						Select a Template
					</h2>
					<p className='text-sm text-slate-500 dark:text-slate-400'>
						Choose a prompt template or skip to use defaults
					</p>
				</div>
				<Button variant='ghost' onClick={onBack} className='text-xs'>
					<ArrowLeft className='h-3.5 w-3.5' />
					Back
				</Button>
			</div>

			{/* Skip template button */}
			<button
				type='button'
				onClick={() => onSelect(null)}
				className='w-full mb-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-4 text-center hover:border-primary-400 dark:hover:border-primary-500/50 transition-colors group'
			>
				<span className='text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'>
					Skip — Use default prompt template
				</span>
			</button>

			{/* Search */}
			<div className='mb-4'>
				<input
					type='text'
					placeholder='Search templates...'
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setPage(1);
					}}
					className='w-full max-w-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
				/>
			</div>

			{/* Loading */}
			{isLoading && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 animate-pulse'
						>
							<div className='h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded mb-2' />
							<div className='h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded' />
						</div>
					))}
				</div>
			)}

			{/* Template list */}
			{data && data.items.length > 0 && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
					{data.items.map((template) => (
						<button
							key={template.id}
							type='button'
							onClick={() => onSelect(template)}
							className='text-left rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:border-primary-300 dark:hover:border-primary-500/50 hover:shadow-sm transition-all group'
						>
							<h3 className='text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate'>
								{template.name}
							</h3>
							<div className='flex items-center gap-2 mt-1 mb-2'>
								<span className='inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400'>
									{formatCategory(template.category)}
								</span>
								{template.is_predefined && (
									<span className='text-[10px] text-primary-500 font-medium'>
										System
									</span>
								)}
							</div>
							<p className='text-xs text-slate-500 dark:text-slate-400 line-clamp-2'>
								{template.description || "No description"}
							</p>
						</button>
					))}
				</div>
			)}

			{/* Empty */}
			{data && data.items.length === 0 && (
				<div className='text-center py-8'>
					<LayoutTemplate className='h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2' />
					<p className='text-sm text-slate-500 dark:text-slate-400'>
						No templates found for this category
					</p>
				</div>
			)}
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   ConfigurePanel — Step 3
   ──────────────────────────────────────────────────────────── */

function ConfigurePanel({
	scenario,
	template,
	temperature,
	maxTokens,
	modelVariant,
	onTemperatureChange,
	onMaxTokensChange,
	onModelVariantChange,
	onGenerate,
	onBack,
	isGenerating,
}: {
	scenario: Scenario | null;
	template: Template | null;
	temperature: number;
	maxTokens: number;
	modelVariant: string;
	onTemperatureChange: (v: number) => void;
	onMaxTokensChange: (v: number) => void;
	onModelVariantChange: (v: string) => void;
	onGenerate: () => void;
	onBack: () => void;
	isGenerating: boolean;
}) {
	return (
		<div>
			<div className='flex items-center justify-between mb-4'>
				<div>
					<h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
						Configure & Generate
					</h2>
					<p className='text-sm text-slate-500 dark:text-slate-400'>
						Review your selections and adjust parameters
					</p>
				</div>
				<Button variant='ghost' onClick={onBack} className='text-xs'>
					<ArrowLeft className='h-3.5 w-3.5' />
					Back
				</Button>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
				{/* Summary */}
				<div className='space-y-4'>
					{/* Selected scenario */}
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4'>
						<h3 className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2'>
							Scenario
						</h3>
						{scenario ? (
							<div>
								<p className='text-sm font-medium text-slate-900 dark:text-white'>
									{scenario.title}
								</p>
								<div className='flex items-center gap-2 mt-1'>
									<span className='text-xs text-slate-500'>
										{formatCategory(scenario.pretext_category)}
									</span>
									<span className='text-xs text-slate-400'>·</span>
									<span className='text-xs text-slate-500'>
										{scenario.target_role}
									</span>
									<span className='text-xs text-slate-400'>·</span>
									<span className='text-xs text-slate-500'>
										{scenario.communication_channel}
									</span>
								</div>
							</div>
						) : (
							<p className='text-sm text-slate-400'>No scenario selected</p>
						)}
					</div>

					{/* Selected template */}
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4'>
						<h3 className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2'>
							Template
						</h3>
						{template ? (
							<div>
								<p className='text-sm font-medium text-slate-900 dark:text-white'>
									{template.name}
								</p>
								<p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
									{template.description || "No description"}
								</p>
							</div>
						) : (
							<p className='text-sm text-slate-500 dark:text-slate-400'>
								Default prompt template
							</p>
						)}
					</div>
				</div>

				{/* Parameters */}
				<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5'>
					<h3 className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4'>
						Generation Parameters
					</h3>

					<div className='space-y-5'>
						{/* Temperature */}
						<div>
							<div className='flex items-center justify-between mb-1.5'>
								<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
									Temperature
								</label>
								<span className='text-sm font-mono font-medium text-primary-600 dark:text-primary-400'>
									{temperature.toFixed(1)}
								</span>
							</div>
							<input
								type='range'
								min={0}
								max={2}
								step={0.1}
								value={temperature}
								onChange={(e) =>
									onTemperatureChange(parseFloat(e.target.value))
								}
								className='w-full h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-primary-600'
							/>
							<div className='flex justify-between mt-1'>
								<span className='text-[10px] text-slate-400'>
									Precise (0.0)
								</span>
								<span className='text-[10px] text-slate-400'>
									Creative (2.0)
								</span>
							</div>
						</div>

						{/* Max Tokens */}
						<div>
							<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
								Max Tokens
							</label>
							<input
								type='number'
								min={100}
								max={8192}
								step={100}
								value={maxTokens}
								onChange={(e) =>
									onMaxTokensChange(parseInt(e.target.value) || 1024)
								}
								className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white font-mono outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
							/>
						</div>

						{/* Model */}
						<div>
							<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
								Model Variant
							</label>
							<select
								value={modelVariant}
								onChange={(e) => onModelVariantChange(e.target.value)}
								className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
							>
								<option value='gemini-2.5-flash-lite'>
									Gemini 2.5 Flash-Lite
								</option>
								<option value='gemini-2.5-flash'>Gemini 2.5 Flash</option>
								<option value='gemini-2.5-pro'>Gemini 2.5 Pro</option>
							</select>
						</div>
					</div>

					{/* Warning */}
					<div className='mt-5 rounded-lg bg-warning-50 dark:bg-warning-500/5 border border-warning-200 dark:border-warning-500/20 p-3'>
						<div className='flex items-start gap-2'>
							<AlertTriangle className='h-4 w-4 text-warning-500 shrink-0 mt-0.5' />
							<p className='text-xs text-warning-700 dark:text-warning-400'>
								Generated content is for authorized security research only. All
								outputs include watermarks and are logged for audit purposes.
							</p>
						</div>
					</div>

					{/* Generate button */}
					<Button
						variant='primary'
						onClick={onGenerate}
						disabled={isGenerating || !scenario}
						isLoading={isGenerating}
						className='w-full mt-5'
					>
						<Zap className='h-4 w-4' />
						{isGenerating ? "Generating..." : "Generate Phishing Message"}
					</Button>
				</div>
			</div>
		</div>
	);
}
