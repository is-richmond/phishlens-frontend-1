"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { FormInput, Button, Alert } from "@/components/ui/FormElements";
import { api, ApiError } from "@/lib/api";
import {
	changePasswordSchema,
	type ChangePasswordFormData,
} from "@/lib/validations/settings";

/**
 * Standalone form for changing the user's password.
 * Uses react-hook-form + zod for validation.
 */
export default function ChangePasswordForm() {
	const [serverMessage, setServerMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isValid },
	} = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			current_password: "",
			new_password: "",
			confirm_password: "",
		},
		mode: "all",
	});

	const onSubmit = async (data: ChangePasswordFormData) => {
		setServerMessage(null);
		try {
			await api.post("/v1/auth/change-password", {
				current_password: data.current_password,
				new_password: data.new_password,
			});
			reset();
			setServerMessage({
				type: "success",
				text: "Password changed successfully.",
			});
		} catch (err) {
			setServerMessage({
				type: "error",
				text:
					err instanceof ApiError ? err.message : "Failed to change password.",
			});
		}
	};

	return (
		<div className='bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6'>
			<h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
				Change Password
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
				<FormInput
					label='Current Password'
					type='password'
					placeholder='••••••••'
					autoComplete='current-password'
					icon={<Lock className='w-4 h-4' />}
					error={errors.current_password?.message}
					{...register("current_password")}
				/>

				<FormInput
					label='New Password'
					type='password'
					placeholder='••••••••'
					autoComplete='new-password'
					icon={<Lock className='w-4 h-4' />}
					error={errors.new_password?.message}
					{...register("new_password")}
				/>

				<FormInput
					label='Confirm New Password'
					type='password'
					placeholder='••••••••'
					autoComplete='new-password'
					icon={<Lock className='w-4 h-4' />}
					error={errors.confirm_password?.message}
					{...register("confirm_password")}
				/>

				<div className='pt-2 flex justify-end'>
					<Button type='submit' isLoading={isSubmitting} disabled={!isValid}>
						Change Password
					</Button>
				</div>
			</form>
		</div>
	);
}
