import { z } from "zod";

/**
 * Zod validation schemas for authentication forms.
 * Mirrors the backend Pydantic schemas.
 */

/** Login form schema */
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/** Password complexity requirements */
const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/\d/, "Password must contain at least one digit")
	.regex(
		/[^A-Za-z0-9]/,
		"Password must contain at least one special character",
	);

/** Registration form schema */
export const registerSchema = z
	.object({
		full_name: z
			.string()
			.min(1, "Full name is required")
			.min(2, "Full name must be at least 2 characters")
			.max(100, "Full name must not exceed 100 characters"),
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email address"),
		institution: z
			.string()
			.min(1, "Institution is required")
			.min(2, "Institution must be at least 2 characters")
			.max(200, "Institution must not exceed 200 characters"),
		password: passwordSchema,
		confirm_password: z.string().min(1, "Please confirm your password"),
		terms_accepted: z.literal(true, {
			errorMap: () => ({
				message: "You must accept the Terms of Use to register",
			}),
		}),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

export type RegisterFormData = z.infer<typeof registerSchema>;
