"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	User,
	Building2,
	UserPlus,
} from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import {
	FormInput,
	Button,
	Alert,
	Checkbox,
} from "@/components/ui/FormElements";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { TermsModal } from "@/components/ui/TermsModal";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { ApiError } from "@/lib/api";

/**
 * Registration page — multi-field form with password strength indicator,
 * terms-of-use checkbox, real-time validation, and server error handling.
 */
export default function RegisterPage() {
	const { register: authRegister } = useAuth();
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [termsOpen, setTermsOpen] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting, isValid },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			full_name: "",
			email: "",
			institution: "",
			password: "",
			confirm_password: "",
			terms_accepted: false as unknown as true,
		},
	});

	const passwordValue = watch("password");

	const onSubmit = async (data: RegisterFormData) => {
		setServerError(null);
		try {
			await authRegister({
				email: data.email,
				password: data.password,
				full_name: data.full_name,
				institution: data.institution,
				terms_accepted: data.terms_accepted,
			});
		} catch (err) {
			if (err instanceof ApiError) {
				setServerError(
					err.status === 409
						? "An account with this email already exists."
						: err.status === 422
							? "Please check your input and try again."
							: err.message,
				);
			} else {
				setServerError("An unexpected error occurred. Please try again.");
			}
		}
	};

	return (
		<>
			<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm'>
				<div className='mb-6'>
					<h1 className='text-2xl font-bold text-slate-900 dark:text-white mb-1'>
						Create Account
					</h1>
					<p className='text-sm text-slate-500 dark:text-slate-400'>
						Register for a research account to access the platform.
					</p>
				</div>

				{serverError && (
					<Alert variant='error' className='mb-6'>
						{serverError}
					</Alert>
				)}

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-4'
					noValidate
				>
					<FormInput
						label='Full Name'
						type='text'
						placeholder='Jane Researcher'
						autoComplete='name'
						icon={<User className='w-4 h-4' />}
						error={errors.full_name?.message}
						{...register("full_name")}
					/>

					<FormInput
						label='Email'
						type='email'
						placeholder='you@university.edu'
						autoComplete='email'
						icon={<Mail className='w-4 h-4' />}
						error={errors.email?.message}
						{...register("email")}
					/>

					<FormInput
						label='Institution'
						type='text'
						placeholder='University / Organization'
						autoComplete='organization'
						icon={<Building2 className='w-4 h-4' />}
						error={errors.institution?.message}
						{...register("institution")}
					/>

					{/* Password with strength indicator */}
					<div className='space-y-2'>
						<FormInput
							label='Password'
							type={showPassword ? "text" : "password"}
							placeholder='••••••••'
							autoComplete='new-password'
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
						<PasswordStrength password={passwordValue || ""} />
					</div>

					<FormInput
						label='Confirm Password'
						type={showConfirm ? "text" : "password"}
						placeholder='••••••••'
						autoComplete='new-password'
						icon={<Lock className='w-4 h-4' />}
						error={errors.confirm_password?.message}
						rightElement={
							<button
								type='button'
								onClick={() => setShowConfirm(!showConfirm)}
								className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'
								tabIndex={-1}
								aria-label={showConfirm ? "Hide password" : "Show password"}
							>
								{showConfirm ? (
									<EyeOff className='w-4 h-4' />
								) : (
									<Eye className='w-4 h-4' />
								)}
							</button>
						}
						{...register("confirm_password")}
					/>

					{/* Terms of Use */}
					<Checkbox
						id='terms_accepted'
						label={
							<>
								I agree to the{" "}
								<button
									type='button'
									onClick={() => setTermsOpen(true)}
									className='font-medium text-primary-600 hover:text-primary-500 underline underline-offset-2'
								>
									Terms of Use
								</button>{" "}
								and confirm this account is for authorized security research
								only.
							</>
						}
						error={errors.terms_accepted?.message}
						{...register("terms_accepted")}
					/>

					<Button
						type='submit'
						isLoading={isSubmitting}
						className='w-full'
						disabled={isSubmitting || !isValid}
					>
						<UserPlus className='w-4 h-4' />
						Create Account
					</Button>
				</form>

				<p className='mt-6 text-center text-sm text-slate-500 dark:text-slate-400'>
					Already have an account?{" "}
					<Link
						href='/login'
						className='font-medium text-primary-600 hover:text-primary-500'
					>
						Sign In
					</Link>
				</p>
			</div>

			{/* Terms of Use modal */}
			<TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
		</>
	);
}
