import { z } from "zod";

/**
 * Zod validation schemas for the Settings page forms.
 */

/** Profile edit form */
export const profileSchema = z.object({
	full_name: z
		.string()
		.min(1, "Full name is required")
		.min(2, "Full name must be at least 2 characters")
		.max(100, "Full name must not exceed 100 characters"),
	institution: z
		.string()
		.min(1, "Institution is required")
		.min(2, "Institution must be at least 2 characters")
		.max(200, "Institution must not exceed 200 characters"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/** Password complexity (shared with auth.ts) */
const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(/[A-Z]/, "Must contain at least one uppercase letter")
	.regex(/[a-z]/, "Must contain at least one lowercase letter")
	.regex(/\d/, "Must contain at least one digit")
	.regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

/** Change-password form */
export const changePasswordSchema = z
	.object({
		current_password: z.string().min(1, "Current password is required"),
		new_password: passwordSchema,
		confirm_password: z.string().min(1, "Please confirm your new password"),
	})
	.refine((data) => data.new_password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
