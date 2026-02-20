/**
 * PhishLens API Client
 *
 * Centralized HTTP client for communicating with the FastAPI backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

interface RequestOptions extends RequestInit {
	params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	private buildUrl(
		path: string,
		params?: Record<string, string | number | boolean | undefined>,
	): string {
		const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					url.searchParams.append(key, String(value));
				}
			});
		}
		return url.toString();
	}

	async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
		const { params, ...fetchOptions } = options;
		const url = this.buildUrl(path, params);

		const response = await fetch(url, {
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...fetchOptions.headers,
			},
			...fetchOptions,
		});

		if (!response.ok) {
			const error = await response
				.json()
				.catch(() => ({ detail: "Unknown error" }));
			throw new ApiError(response.status, error.detail || "Request failed");
		}

		if (response.status === 204) {
			return undefined as T;
		}

		return response.json();
	}

	get<T>(
		path: string,
		params?: Record<string, string | number | boolean | undefined>,
	) {
		return this.request<T>(path, { method: "GET", params });
	}

	post<T>(path: string, body?: unknown) {
		return this.request<T>(path, {
			method: "POST",
			body: JSON.stringify(body),
		});
	}

	put<T>(path: string, body?: unknown) {
		return this.request<T>(path, { method: "PUT", body: JSON.stringify(body) });
	}

	patch<T>(path: string, body?: unknown) {
		return this.request<T>(path, {
			method: "PATCH",
			body: JSON.stringify(body),
		});
	}

	delete<T>(path: string) {
		return this.request<T>(path, { method: "DELETE" });
	}
}

export class ApiError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.name = "ApiError";
	}
}

export const api = new ApiClient(API_BASE);
