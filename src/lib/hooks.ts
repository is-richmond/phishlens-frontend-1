/**
 * SWR data fetching hooks for PhishLens.
 *
 * Wraps SWR with typed API calls and auth-aware fetching.
 */

import useSWR, { SWRConfiguration } from "swr";
import { api } from "@/lib/api";
import type {
	User,
	Scenario,
	Template,
	Generation,
	Campaign,
	CampaignDetail,
	CampaignStatistics,
	AuditLog,
	PaginatedResponse,
	AdminStatistics,
	PersonaPreset,
	CategoryPreset,
} from "@/types";

// --- Generic fetcher ---

function fetcher<T>(path: string): Promise<T> {
	return api.get<T>(path);
}

// --- Auth hooks ---

export function useCurrentUser(config?: SWRConfiguration) {
	return useSWR<User>("/v1/auth/me", fetcher, config);
}

// --- Scenario hooks ---

export function useScenarios(
	params?: {
		page?: number;
		per_page?: number;
		category?: string;
		search?: string;
	},
	config?: SWRConfiguration,
) {
	const searchParams = new URLSearchParams();
	if (params?.page) searchParams.set("page", String(params.page));
	if (params?.per_page) searchParams.set("per_page", String(params.per_page));
	if (params?.category) searchParams.set("category", params.category);
	if (params?.search) searchParams.set("search", params.search);
	const qs = searchParams.toString();
	const key = `/v1/scenarios${qs ? `?${qs}` : ""}`;

	return useSWR<PaginatedResponse<Scenario>>(key, fetcher, config);
}

export function useScenario(id: string | null, config?: SWRConfiguration) {
	return useSWR<Scenario>(id ? `/v1/scenarios/${id}` : null, fetcher, config);
}

// --- Template hooks ---

export function useTemplates(
	params?: {
		page?: number;
		per_page?: number;
		category?: string;
		search?: string;
	},
	config?: SWRConfiguration,
) {
	const searchParams = new URLSearchParams();
	if (params?.page) searchParams.set("page", String(params.page));
	if (params?.per_page) searchParams.set("per_page", String(params.per_page));
	if (params?.category) searchParams.set("category", params.category);
	if (params?.search) searchParams.set("search", params.search);
	const qs = searchParams.toString();
	const key = `/v1/templates${qs ? `?${qs}` : ""}`;

	return useSWR<PaginatedResponse<Template>>(key, fetcher, config);
}

export function useTemplate(id: string | null, config?: SWRConfiguration) {
	return useSWR<Template>(id ? `/v1/templates/${id}` : null, fetcher, config);
}

// --- Generation hooks ---

export function useGenerations(
	params?: {
		page?: number;
		per_page?: number;
		scenario_id?: string;
		min_score?: number;
		max_score?: number;
		model?: string;
	},
	config?: SWRConfiguration,
) {
	const searchParams = new URLSearchParams();
	if (params?.page) searchParams.set("page", String(params.page));
	if (params?.per_page) searchParams.set("per_page", String(params.per_page));
	if (params?.scenario_id) searchParams.set("scenario_id", params.scenario_id);
	if (params?.min_score !== undefined)
		searchParams.set("min_score", String(params.min_score));
	if (params?.max_score !== undefined)
		searchParams.set("max_score", String(params.max_score));
	if (params?.model) searchParams.set("model", params.model);
	const qs = searchParams.toString();
	const key = `/v1/generations${qs ? `?${qs}` : ""}`;

	return useSWR<PaginatedResponse<Generation>>(key, fetcher, config);
}

export function useGeneration(id: string | null, config?: SWRConfiguration) {
	return useSWR<Generation>(
		id ? `/v1/generations/${id}` : null,
		fetcher,
		config,
	);
}

// --- Campaign hooks ---

export function useCampaigns(
	params?: { page?: number; per_page?: number; search?: string },
	config?: SWRConfiguration,
) {
	const searchParams = new URLSearchParams();
	if (params?.page) searchParams.set("page", String(params.page));
	if (params?.per_page) searchParams.set("per_page", String(params.per_page));
	if (params?.search) searchParams.set("search", params.search);
	const qs = searchParams.toString();
	const key = `/v1/campaigns${qs ? `?${qs}` : ""}`;

	return useSWR<PaginatedResponse<Campaign>>(key, fetcher, config);
}

export function useCampaign(id: string | null, config?: SWRConfiguration) {
	return useSWR<CampaignDetail>(
		id ? `/v1/campaigns/${id}` : null,
		fetcher,
		config,
	);
}

export function useCampaignStatistics(
	id: string | null,
	config?: SWRConfiguration,
) {
	return useSWR<CampaignStatistics>(
		id ? `/v1/campaigns/${id}/statistics` : null,
		fetcher,
		config,
	);
}

// --- Admin hooks ---

export function useAdminUsers(
	params?: {
		page?: number;
		per_page?: number;
		role?: string;
		is_active?: boolean;
		search?: string;
	},
	config?: SWRConfiguration,
) {
	const searchParams = new URLSearchParams();
	if (params?.page) searchParams.set("page", String(params.page));
	if (params?.per_page) searchParams.set("per_page", String(params.per_page));
	if (params?.role) searchParams.set("role", params.role);
	if (params?.is_active !== undefined)
		searchParams.set("is_active", String(params.is_active));
	if (params?.search) searchParams.set("search", params.search);
	const qs = searchParams.toString();

	return useSWR<User[]>(
		`/v1/admin/users${qs ? `?${qs}` : ""}`,
		fetcher,
		config,
	);
}

export function useAuditLogs(
	params?: {
		page?: number;
		per_page?: number;
		user_id?: string;
		action_type?: string;
	},
	config?: SWRConfiguration,
) {
	const searchParams = new URLSearchParams();
	if (params?.page) searchParams.set("page", String(params.page));
	if (params?.per_page) searchParams.set("per_page", String(params.per_page));
	if (params?.user_id) searchParams.set("user_id", params.user_id);
	if (params?.action_type) searchParams.set("action_type", params.action_type);
	const qs = searchParams.toString();

	return useSWR<PaginatedResponse<AuditLog>>(
		`/v1/admin/audit-logs${qs ? `?${qs}` : ""}`,
		fetcher,
		config,
	);
}

export function useAdminStatistics(enabled = true, config?: SWRConfiguration) {
	return useSWR<AdminStatistics>(
		enabled ? "/v1/admin/statistics" : null,
		fetcher,
		config,
	);
}

// --- Dashboard hooks ---

/** Fetches recent generations for the current user's dashboard */
export function useDashboardGenerations(config?: SWRConfiguration) {
	return useSWR<PaginatedResponse<Generation>>(
		"/v1/generations?per_page=8&page=1",
		fetcher,
		config,
	);
}

/** Fetches recent audit logs for activity feed (admin only) */
export function useDashboardActivity(
	enabled = true,
	config?: SWRConfiguration,
) {
	return useSWR<PaginatedResponse<AuditLog>>(
		enabled ? "/v1/admin/audit-logs?per_page=10&page=1" : null,
		fetcher,
		config,
	);
}

// --- Persona & Category presets ---

export function usePersonaPresets(config?: SWRConfiguration) {
	return useSWR<PersonaPreset[]>(
		"/v1/scenarios/presets/personas",
		fetcher,
		config,
	);
}

export function useCategoryPresets(config?: SWRConfiguration) {
	return useSWR<CategoryPreset[]>(
		"/v1/scenarios/presets/categories",
		fetcher,
		config,
	);
}

// --- Supported models ---

export function useSupportedModels(config?: SWRConfiguration) {
	return useSWR("/v1/generations/models", fetcher, config);
}
