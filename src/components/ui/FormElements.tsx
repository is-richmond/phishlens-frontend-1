"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   FormInput — a styled <input> with label, error, and icon
   ──────────────────────────────────────────────────────────── */

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	icon?: ReactNode;
	rightElement?: ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
	(
		{ label, error, icon, rightElement, className, id, disabled, ...props },
		ref,
	) => {
		const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className='space-y-1.5'>
				<label
					htmlFor={inputId}
					className='block text-sm font-medium text-slate-700 dark:text-slate-300'
				>
					{label}
				</label>
				<div className='relative'>
					{icon && (
						<span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
							{icon}
						</span>
					)}
					<input
						ref={ref}
						id={inputId}
						className={cn(
							"w-full rounded-lg border bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-colors",
							icon && "pl-10",
							rightElement && "pr-10",
							error
								? "border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20"
								: "border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
							disabled &&
								"bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed",
							className,
						)}
						aria-invalid={!!error}
						aria-describedby={error ? `${inputId}-error` : undefined}
						disabled={disabled}
						{...props}
					/>
					{rightElement && (
						<span className='absolute right-3 top-1/2 -translate-y-1/2'>
							{rightElement}
						</span>
					)}
				</div>
				{error && (
					<p
						id={`${inputId}-error`}
						role='alert'
						className='text-xs text-danger-600 dark:text-danger-400'
					>
						{error}
					</p>
				)}
			</div>
		);
	},
);
FormInput.displayName = "FormInput";

/* ────────────────────────────────────────────────────────────
   Button — primary / outline / ghost variants
   ──────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "outline" | "ghost";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary:
		"bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500/40",
	outline:
		"border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400/30",
	ghost:
		"text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400/30",
};

export function Button({
	variant = "primary",
	isLoading = false,
	disabled,
	className,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			disabled={disabled || isLoading}
			className={cn(
				"inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60",
				variantStyles[variant],
				className,
			)}
			{...props}
		>
			{isLoading && (
				<svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24' fill='none'>
					<circle
						className='opacity-25'
						cx='12'
						cy='12'
						r='10'
						stroke='currentColor'
						strokeWidth='4'
					/>
					<path
						className='opacity-75'
						fill='currentColor'
						d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
					/>
				</svg>
			)}
			{children}
		</button>
	);
}

/* ────────────────────────────────────────────────────────────
   Alert — error / success / warning banners
   ──────────────────────────────────────────────────────────── */

type AlertVariant = "error" | "success" | "warning" | "info";

const alertStyles: Record<AlertVariant, string> = {
	error:
		"bg-danger-50 dark:bg-danger-500/10 text-danger-700 dark:text-danger-400 border-danger-200 dark:border-danger-500/20",
	success:
		"bg-success-50 dark:bg-success-500/10 text-success-700 dark:text-success-400 border-success-200 dark:border-success-500/20",
	warning:
		"bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-500/20",
	info: "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-500/20",
};

export function Alert({
	variant = "error",
	children,
	className,
}: {
	variant?: AlertVariant;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			role='alert'
			className={cn(
				"rounded-lg border px-4 py-3 text-sm",
				alertStyles[variant],
				className,
			)}
		>
			{children}
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   Checkbox — styled checkbox with label
   ──────────────────────────────────────────────────────────── */

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
	label: ReactNode;
	error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	({ label, error, className, id, ...props }, ref) => {
		const checkId = id || "checkbox";

		return (
			<div className='space-y-1'>
				<div className='flex items-start gap-2.5'>
					<input
						ref={ref}
						type='checkbox'
						id={checkId}
						className={cn(
							"mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500/40 bg-white dark:bg-slate-700",
							className,
						)}
						aria-invalid={!!error}
						{...props}
					/>
					<label
						htmlFor={checkId}
						className='text-sm text-slate-600 dark:text-slate-400 leading-snug cursor-pointer'
					>
						{label}
					</label>
				</div>
				{error && (
					<p
						role='alert'
						className='text-xs text-danger-600 dark:text-danger-400'
					>
						{error}
					</p>
				)}
			</div>
		);
	},
);
Checkbox.displayName = "Checkbox";

/* ────────────────────────────────────────────────────────────
   FormTextarea — a styled <textarea> with label, error
   ──────────────────────────────────────────────────────────── */

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label: string;
	error?: string;
	hint?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
	({ label, error, hint, className, id, ...props }, ref) => {
		const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className='space-y-1.5'>
				<label
					htmlFor={textareaId}
					className='block text-sm font-medium text-slate-700 dark:text-slate-300'
				>
					{label}
				</label>
				<textarea
					ref={ref}
					id={textareaId}
					className={cn(
						"w-full rounded-lg border bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-colors resize-y min-h-[80px]",
						error
							? "border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20"
							: "border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
						className,
					)}
					aria-invalid={!!error}
					aria-describedby={
						error
							? `${textareaId}-error`
							: hint
								? `${textareaId}-hint`
								: undefined
					}
					{...props}
				/>
				{hint && !error && (
					<p
						id={`${textareaId}-hint`}
						className='text-xs text-slate-500 dark:text-slate-400'
					>
						{hint}
					</p>
				)}
				{error && (
					<p
						id={`${textareaId}-error`}
						role='alert'
						className='text-xs text-danger-600 dark:text-danger-400'
					>
						{error}
					</p>
				)}
			</div>
		);
	},
);
FormTextarea.displayName = "FormTextarea";

/* ────────────────────────────────────────────────────────────
   FormSelect — a styled <select> with label, error
   ──────────────────────────────────────────────────────────── */

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
	error?: string;
	options: { value: string; label: string }[];
	placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
	({ label, error, options, placeholder, className, id, ...props }, ref) => {
		const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className='space-y-1.5'>
				<label
					htmlFor={selectId}
					className='block text-sm font-medium text-slate-700 dark:text-slate-300'
				>
					{label}
				</label>
				<select
					ref={ref}
					id={selectId}
					className={cn(
						"w-full rounded-lg border bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat pr-10",
						error
							? "border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20"
							: "border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
						className,
					)}
					aria-invalid={!!error}
					aria-describedby={error ? `${selectId}-error` : undefined}
					{...props}
				>
					{placeholder && (
						<option value='' disabled>
							{placeholder}
						</option>
					)}
					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
				{error && (
					<p
						id={`${selectId}-error`}
						role='alert'
						className='text-xs text-danger-600 dark:text-danger-400'
					>
						{error}
					</p>
				)}
			</div>
		);
	},
);
FormSelect.displayName = "FormSelect";
