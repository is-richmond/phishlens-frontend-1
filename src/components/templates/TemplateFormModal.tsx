"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	FormInput,
	FormTextarea,
	FormSelect,
	Button,
	Alert,
} from "@/components/ui/FormElements";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import type { Template, PretextCategory } from "@/types";

/* ── Zod schema (mirrors backend TemplateCreate) ── */

const CATEGORIES = [
	"credential_phishing",
	"business_email_compromise",
	"quishing",
	"spear_phishing",
	"whaling",
	"smishing",
] as const;

const templateSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(255, "Name must not exceed 255 characters"),
	description: z
		.string()
		.max(1000, "Description must not exceed 1000 characters")
		.optional()
		.or(z.literal("")),
	category: z.enum(CATEGORIES, {
		errorMap: () => ({ message: "Please select a category" }),
	}),
	system_prompt: z
		.string()
		.min(10, "System prompt must be at least 10 characters"),
	user_prompt_skeleton: z
		.string()
		.min(10, "User prompt skeleton must be at least 10 characters"),
	is_public: z.boolean().default(false),
});

type TemplateFormData = z.infer<typeof templateSchema>;

const CATEGORY_OPTIONS = [
	{ value: "credential_phishing", label: "Credential Phishing" },
	{ value: "business_email_compromise", label: "Business Email Compromise" },
	{ value: "quishing", label: "Quishing" },
	{ value: "spear_phishing", label: "Spear Phishing" },
	{ value: "whaling", label: "Whaling" },
	{ value: "smishing", label: "Smishing" },
];

interface TemplateFormModalProps {
	/** If provided, pre-populates the form for editing */
	editTemplate?: Template;
	onClose: () => void;
	onSuccess: () => void;
}

/**
 * Modal for creating or editing a custom template.
 * System prompt, user prompt skeleton, name, description, category.
 */
export function TemplateFormModal({
	editTemplate,
	onClose,
	onSuccess,
}: TemplateFormModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TemplateFormData>({
		resolver: zodResolver(templateSchema),
		defaultValues: editTemplate
			? {
					name: editTemplate.name,
					description: editTemplate.description ?? "",
					category: editTemplate.category,
					system_prompt: editTemplate.system_prompt,
					user_prompt_skeleton: editTemplate.user_prompt_skeleton,
					is_public: editTemplate.is_public,
				}
			: {
					name: "",
					description: "",
					category: "credential_phishing",
					system_prompt: "",
					user_prompt_skeleton: "",
					is_public: false,
				},
	});

	// Lock body scroll & close on Escape
	useEffect(() => {
		document.body.style.overflow = "hidden";
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", handleKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKey);
		};
	}, [onClose]);

	async function onSubmit(data: TemplateFormData) {
		setIsSubmitting(true);
		setApiError(null);

		try {
			const payload = {
				name: data.name,
				description: data.description || undefined,
				category: data.category,
				system_prompt: data.system_prompt,
				user_prompt_skeleton: data.user_prompt_skeleton,
				is_public: data.is_public,
			};

			if (editTemplate) {
				await api.put(`/v1/templates/${editTemplate.id}`, payload);
			} else {
				await api.post("/v1/templates", payload);
			}

			onSuccess();
		} catch (err) {
			setApiError(
				err instanceof Error ? err.message : "An unexpected error occurred",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4'
			role='dialog'
			aria-modal='true'
			aria-label={editTemplate ? "Edit template" : "Create template"}
		>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-black/50 backdrop-blur-sm'
				onClick={onClose}
			/>

			{/* Modal */}
			<div className='relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl'>
				{/* Header */}
				<div className='sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4'>
					<h2 className='text-lg font-bold text-slate-900 dark:text-white'>
						{editTemplate ? "Edit Custom Template" : "Create Custom Template"}
					</h2>
					<button
						type='button'
						onClick={onClose}
						className='rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
						aria-label='Close'
					>
						<X className='w-5 h-5' />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit(onSubmit)} className='px-6 py-5 space-y-5'>
					{apiError && <Alert variant='error'>{apiError}</Alert>}

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<FormInput
							label='Template Name'
							placeholder='e.g., Executive Urgency Template'
							error={errors.name?.message}
							{...register("name")}
						/>
						<FormSelect
							label='Category'
							options={CATEGORY_OPTIONS}
							error={errors.category?.message}
							{...register("category")}
						/>
					</div>

					<FormTextarea
						label='Description'
						placeholder='Brief description of what this template does…'
						hint='Optional — helps identify this template in the gallery.'
						rows={2}
						error={errors.description?.message}
						{...register("description")}
					/>

					<FormTextarea
						label='System Prompt'
						placeholder='Define the LLM role and constraints. E.g.: "You are an expert social engineer…"'
						hint="The system-level instruction that defines the LLM's behavior. Minimum 10 characters."
						rows={6}
						error={errors.system_prompt?.message}
						className='font-mono text-xs'
						{...register("system_prompt")}
					/>

					<FormTextarea
						label='User Prompt Skeleton'
						placeholder='Write the prompt template with placeholders like {target_role}, {organization_context}, {pretext_category}…'
						hint='Use {placeholder} syntax for dynamic values. Minimum 10 characters.'
						rows={6}
						error={errors.user_prompt_skeleton?.message}
						className='font-mono text-xs'
						{...register("user_prompt_skeleton")}
					/>

					{/* Public toggle */}
					<label className='flex items-center gap-3 cursor-pointer'>
						<input
							type='checkbox'
							className='h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500/40 bg-white dark:bg-slate-700'
							{...register("is_public")}
						/>
						<span className='text-sm text-slate-700 dark:text-slate-300'>
							Make this template public (visible to all users)
						</span>
					</label>

					{/* Actions */}
					<div className='flex justify-end gap-3 pt-2'>
						<Button variant='outline' type='button' onClick={onClose}>
							Cancel
						</Button>
						<Button type='submit' isLoading={isSubmitting}>
							{editTemplate ? "Save Changes" : "Create Template"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
