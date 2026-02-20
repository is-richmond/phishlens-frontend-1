"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import { FormInput, Button, Alert } from "@/components/ui/FormElements";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { ApiError } from "@/lib/api";

/**
 * Login page — centered card with email/password form, real-time validation,
 * loading state, and server-side error display.
 */
export default function LoginPage() {
	const { login } = useAuth();
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = async (data: LoginFormData) => {
		setServerError(null);
		try {
			await login(data);
		} catch (err) {
			if (err instanceof ApiError) {
				setServerError(
					err.status === 401
						? "Invalid email or password. Please try again."
						: err.status === 403
							? "Your account has been suspended. Contact an administrator."
							: err.message,
				);
			} else {
				setServerError("An unexpected error occurred. Please try again.");
			}
		}
	};

	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold text-slate-900 dark:text-white mb-1'>
					Welcome back
				</h1>
				<p className='text-sm text-slate-500 dark:text-slate-400'>
					Enter your credentials to access the platform.
				</p>
			</div>

			{serverError && (
				<Alert variant='error' className='mb-6'>
					{serverError}
				</Alert>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4' noValidate>
				<FormInput
					label='Email'
					type='email'
					placeholder='you@example.com'
					autoComplete='email'
					icon={<Mail className='w-4 h-4' />}
					error={errors.email?.message}
					{...register("email")}
				/>

				<FormInput
					label='Password'
					type={showPassword ? "text" : "password"}
					placeholder='••••••••'
					autoComplete='current-password'
					icon={<Lock className='w-4 h-4' />}
					error={errors.password?.message}
					rightElement={
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'
							tabIndex={-1}
							aria-label={showPassword ? "Hide password" : "Show password"}
						>
							{showPassword ? (
								<EyeOff className='w-4 h-4' />
							) : (
								<Eye className='w-4 h-4' />
							)}
						</button>
					}
					{...register("password")}
				/>

				<Button type='submit' isLoading={isSubmitting} className='w-full'>
					<LogIn className='w-4 h-4' />
					Sign In
				</Button>
			</form>

			<p className='mt-6 text-center text-sm text-slate-500 dark:text-slate-400'>
				Don&apos;t have an account?{" "}
				<Link
					href='/register'
					className='font-medium text-primary-600 hover:text-primary-500'
				>
					Register
				</Link>
			</p>
		</div>
	);
}
