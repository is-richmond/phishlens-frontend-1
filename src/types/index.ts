/**
 * PhishLens TypeScript Type Definitions
 *
 * Mirrors the Pydantic schemas from the backend.
 */

// --- Enums ---

export type UserRole = "researcher" | "admin";

export type PretextCategory =
	| "credential_phishing"
	| "business_email_compromise"
	| "quishing"
	| "spear_phishing"
	| "whaling"
	| "smishing";

export type CommunicationChannel = "email" | "sms" | "internal_chat";

export type Language = "english" | "russian" | "kazakh";

export type ExportFormat = "json" | "csv" | "eml";

// --- User ---

export interface User {
	id: string;
	email: string;
	full_name: string;
	institution: string;
	role: UserRole;
	is_active: boolean;
	terms_accepted_at: string | null;
	created_at: string;
	updated_at: string;
}

// --- Auth ---

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	full_name: string;
	institution: string;
	terms_accepted: boolean;
}

export interface TokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

// --- Scenario ---

export interface Scenario {
	id: string;
	user_id: string;
	title: string;
	description: string | null;
	target_role: string;
	target_department: string | null;
	organization_context: string | null;
	pretext_category: PretextCategory;
	pretext_description: string | null;
	urgency_level: number;
	communication_channel: CommunicationChannel;
	language: Language;
	created_at: string;
	updated_at: string;
}

export interface ScenarioCreate {
	title: string;
	description?: string;
	target_role: string;
	target_department?: string;
	organization_context?: string;
	pretext_category: PretextCategory;
	pretext_description?: string;
	urgency_level?: number;
	communication_channel?: CommunicationChannel;
	language?: Language;
}

// --- Template ---

export interface Template {
	id: string;
	user_id: string | null;
	name: string;
	description: string | null;
	category: PretextCategory;
	system_prompt: string;
	user_prompt_skeleton: string;
	is_predefined: boolean;
	is_public: boolean;
	version: string;
	created_at: string;
	updated_at: string;
}

// --- Generation ---

export interface DimensionalScores {
	linguistic_naturalness: number | null;
	psychological_triggers: number | null;
	technical_plausibility: number | null;
	contextual_relevance: number | null;
}

export interface Generation {
	id: string;
	scenario_id: string;
	template_id: string | null;
	input_parameters: Record<string, unknown>;
	generated_subject: string | null;
	generated_text: string;
	model_used: string;
	overall_score: number | null;
	dimensional_scores: DimensionalScores | null;
	evaluation_analysis: string | null;
	watermark: string;
	generation_time_ms: number | null;
	created_at: string;
}

export interface GenerationCreate {
	scenario_id: string;
	template_id?: string;
	temperature?: number;
	max_tokens?: number;
	model_variant?: string;
}

// --- Campaign ---

export interface Campaign {
	id: string;
	user_id: string;
	name: string;
	description: string | null;
	created_at: string;
	updated_at: string;
}

export interface CampaignDetail extends Campaign {
	generations: Generation[];
	total_generations: number;
	average_score: number | null;
}

// --- Audit Log ---

export interface AuditLog {
	id: string;
	user_id: string | null;
	action_type: string;
	resource_type: string | null;
	resource_id: string | null;
	details: Record<string, unknown> | null;
	ip_address: string | null;
	user_agent: string | null;
	created_at: string;
}

// --- Pagination ---

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	per_page: number;
}
