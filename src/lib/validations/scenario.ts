import { z } from "zod";

/**
 * Zod validation schemas for the Scenario Builder wizard.
 * Mirrors the backend Pydantic ScenarioCreate schema.
 */

/** Valid pretext categories (matches backend enum) */
const pretextCategories = [
	"credential_phishing",
	"business_email_compromise",
	"quishing",
	"spear_phishing",
	"whaling",
	"smishing",
] as const;

/** Valid communication channels */
const communicationChannels = ["email", "sms", "internal_chat"] as const;

/** Valid languages */
const languages = ["english", "russian", "kazakh"] as const;

/** Step 1: Target configuration */
export const stepTargetSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.min(3, "Title must be at least 3 characters")
		.max(200, "Title must not exceed 200 characters"),
	target_role: z.string().min(1, "Target persona is required"),
	target_department: z
		.string()
		.max(100, "Department must not exceed 100 characters")
		.optional()
		.or(z.literal("")),
	organization_context: z
		.string()
		.max(2000, "Organization context must not exceed 2000 characters")
		.optional()
		.or(z.literal("")),
});

/** Step 2: Pretext configuration */
export const stepPretextSchema = z.object({
	pretext_category: z.enum(pretextCategories, {
		errorMap: () => ({ message: "Please select a pretext category" }),
	}),
	pretext_description: z
		.string()
		.max(1000, "Pretext description must not exceed 1000 characters")
		.optional()
		.or(z.literal("")),
	urgency_level: z
		.number()
		.int()
		.min(1, "Urgency must be at least 1")
		.max(5, "Urgency must not exceed 5")
		.default(3),
});

/** Step 3: Format configuration */
export const stepFormatSchema = z.object({
	communication_channel: z.enum(communicationChannels).default("email"),
	language: z.enum(languages).default("english"),
	description: z
		.string()
		.max(500, "Description must not exceed 500 characters")
		.optional()
		.or(z.literal("")),
});

/** Full scenario schema — union of all steps */
export const scenarioCreateSchema = stepTargetSchema
	.merge(stepPretextSchema)
	.merge(stepFormatSchema);

export type StepTargetData = z.infer<typeof stepTargetSchema>;
export type StepPretextData = z.infer<typeof stepPretextSchema>;
export type StepFormatData = z.infer<typeof stepFormatSchema>;
export type ScenarioFormData = z.infer<typeof scenarioCreateSchema>;

/** Default values for a new scenario */
export const scenarioDefaults: ScenarioFormData = {
	title: "",
	target_role: "",
	target_department: "",
	organization_context: "",
	pretext_category: "credential_phishing",
	pretext_description: "",
	urgency_level: 3,
	communication_channel: "email",
	language: "english",
	description: "",
};
