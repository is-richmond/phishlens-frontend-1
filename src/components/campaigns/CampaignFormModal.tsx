"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button, FormInput, FormTextarea } from "@/components/ui/FormElements";
import type { Campaign } from "@/types";

/* ────────────────────────────────────────────────────────────
   CampaignFormModal — Create / Edit campaign
   ──────────────────────────────────────────────────────────── */

const campaignSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(255, "Name must be under 255 characters"),
	description: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormModalProps {
	campaign?: Campaign | null;
	onClose: () => void;
	onSuccess: () => void;
}

export function CampaignFormModal({
	campaign,
	onClose,
	onSuccess,
}: CampaignFormModalProps) {
	const isEditing = !!campaign;
	const [submitting, setSubmitting] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CampaignFormData>({
		resolver: zodResolver(campaignSchema),
		defaultValues: {
			name: campaign?.name ?? "",
			description: campaign?.description ?? "",
		},
	});

	const onSubmit = async (data: CampaignFormData) => {
		setSubmitting(true);
		setApiError(null);
		try {
			if (isEditing) {
				await api.put(`/v1/campaigns/${campaign.id}`, data);
			} else {
				await api.post("/v1/campaigns", data);
			}
			onSuccess();
		} catch (err) {
			setApiError(
				err instanceof Error ? err.message : "Failed to save campaign",
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-black/50 backdrop-blur-sm'
				onClick={onClose}
			/>

			{/* Modal */}
			<div className='relative w-full max-w-md mx-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl'>
				{/* Header */}
				<div className='flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50'>
					<h2 className='text-lg font-semibold text-slate-900 dark:text-white'>
						{isEditing ? "Edit Campaign" : "Create Campaign"}
					</h2>
					<button
						type='button'
						onClick={onClose}
						className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'
					>
						<X className='h-5 w-5' />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit(onSubmit)} className='p-5 space-y-4'>
					{apiError && (
						<div className='rounded-lg bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 px-3 py-2 text-xs text-danger-700 dark:text-danger-400'>
							{apiError}
						</div>
					)}

					<FormInput
						label='Campaign Name'
						placeholder='e.g., Q1 2026 Security Training'
						error={errors.name?.message}
						{...register("name")}
					/>

					<FormTextarea
						label='Description'
						placeholder='Optional description of the campaign goals...'
						rows={3}
						error={errors.description?.message}
						{...register("description")}
					/>

					{/* Actions */}
					<div className='flex justify-end gap-2 pt-2'>
						<Button type='button' variant='outline' onClick={onClose}>
							Cancel
						</Button>
						<Button type='submit' isLoading={submitting}>
							{isEditing ? "Update" : "Create"} Campaign
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
