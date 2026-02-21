"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Save } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { FormInput, Button, Alert } from "@/components/ui/FormElements";
import { api, ApiError } from "@/lib/api";
import {
	profileSchema,
	type ProfileFormData,
} from "@/lib/validations/settings";

/**
 * Profile information form — edit name, institution; view email & role.
 * Uses react-hook-form + zod for validation.
 */
export default function ProfileForm() {
	const { user, refreshUser } = useAuth();
	const [serverMessage, setServerMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty, isValid },
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			full_name: user?.full_name ?? "",
			institution: user?.institution ?? "",
		},
	});

	const onSubmit = async (data: ProfileFormData) => {
		setServerMessage(null);
		try {
			await api.patch("/v1/auth/me", data);
			await refreshUser();
			setServerMessage({
				type: "success",
				text: "Profile updated successfully.",
			});
		} catch (err) {
			setServerMessage({
				type: "error",
				text:
					err instanceof ApiError ? err.message : "Failed to update profile.",
			});
		}
	};

	return (
		<div className='bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6'>
			<h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
				Profile Information
			</h2>

			{serverMessage && (
				<Alert
					variant={serverMessage.type === "success" ? "success" : "error"}
					className='mb-4'
				>
					{serverMessage.text}
				</Alert>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4' noValidate>
				{/* Email (read-only) */}
				<FormInput
					label='Email'
					type='email'
					value={user?.email ?? ""}
					disabled
				/>

				<FormInput
					label='Full Name'
					type='text'
					placeholder='John Doe'
					error={errors.full_name?.message}
					{...register("full_name")}
				/>

				<FormInput
					label='Institution'
					type='text'
					placeholder='IITU'
					error={errors.institution?.message}
					{...register("institution")}
				/>

				<div className='flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400'>
					<Shield className='w-4 h-4' />
					<span>
						Role:{" "}
						<span className='font-medium text-slate-700 dark:text-slate-300 capitalize'>
							{user?.role}
						</span>
					</span>
				</div>

				<div className='pt-2 flex justify-end'>
					<Button
						type='submit'
						isLoading={isSubmitting}
						disabled={!isDirty || !isValid}
					>
						<Save className='w-4 h-4' />
						Save Changes
					</Button>
				</div>
			</form>
		</div>
	);
}
