"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

/**
 * Password validation rules matching backend Pydantic schema.
 * 8+ characters, at least one uppercase, lowercase, digit, and special character.
 */
export const PASSWORD_RULES = [
	{
		key: "length",
		label: "At least 8 characters",
		test: (p: string) => p.length >= 8,
	},
	{
		key: "uppercase",
		label: "One uppercase letter",
		test: (p: string) => /[A-Z]/.test(p),
	},
	{
		key: "lowercase",
		label: "One lowercase letter",
		test: (p: string) => /[a-z]/.test(p),
	},
	{ key: "digit", label: "One digit", test: (p: string) => /\d/.test(p) },
	{
		key: "special",
		label: "One special character (!@#$%^&*…)",
		test: (p: string) => /[^A-Za-z0-9]/.test(p),
	},
] as const;

/** Returns an object with the result of each rule and overall validity */
export function validatePassword(password: string) {
	const results = PASSWORD_RULES.map((rule) => ({
		...rule,
		passed: rule.test(password),
	}));
	return {
		results,
		isValid: results.every((r) => r.passed),
		score: results.filter((r) => r.passed).length,
	};
}

/* ────────────────────────────────────────────────────────────
   PasswordStrength — visual password requirements indicator
   ──────────────────────────────────────────────────────────── */

export function PasswordStrength({ password }: { password: string }) {
	const { results, score } = useMemo(
		() => validatePassword(password),
		[password],
	);

	if (!password) return null;

	const strengthLabel =
		score <= 1 ? "Weak" : score <= 3 ? "Fair" : score <= 4 ? "Good" : "Strong";

	const strengthColor =
		score <= 1
			? "bg-danger-500"
			: score <= 3
				? "bg-warning-500"
				: score <= 4
					? "bg-primary-500"
					: "bg-success-500";

	return (
		<div className='space-y-2'>
			{/* Strength bar */}
			<div className='flex items-center gap-2'>
				<div className='flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
					<div
						className={cn(
							"h-full rounded-full transition-all duration-300",
							strengthColor,
						)}
						style={{ width: `${(score / PASSWORD_RULES.length) * 100}%` }}
					/>
				</div>
				<span
					className={cn(
						"text-xs font-medium",
						score <= 1
							? "text-danger-600 dark:text-danger-400"
							: score <= 3
								? "text-warning-600 dark:text-warning-400"
								: score <= 4
									? "text-primary-600 dark:text-primary-400"
									: "text-success-600 dark:text-success-400",
					)}
				>
					{strengthLabel}
				</span>
			</div>

			{/* Requirements checklist */}
			<ul className='space-y-1'>
				{results.map((rule) => (
					<li
						key={rule.key}
						className={cn(
							"flex items-center gap-1.5 text-xs transition-colors",
							rule.passed
								? "text-success-600 dark:text-success-400"
								: "text-slate-400 dark:text-slate-500",
						)}
					>
						{rule.passed ? (
							<Check className='w-3.5 h-3.5' />
						) : (
							<X className='w-3.5 h-3.5' />
						)}
						{rule.label}
					</li>
				))}
			</ul>
		</div>
	);
}
