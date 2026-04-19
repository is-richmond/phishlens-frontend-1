/**
 * PhishLens API Client
 *
 * Centralized HTTP client for communicating with the FastAPI backend.
 * Supports JWT auth via Authorization header and token auto-injection.
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

	/** Get the stored auth token */
	private getToken(): string | null {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("phishlens-token");
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

	async request<T>(
		path: string,
		options: RequestOptions = {},
		tokenOverride?: string,
	): Promise<T> {
		const { params, ...fetchOptions } = options;
		const url = this.buildUrl(path, params);

		const token = tokenOverride || this.getToken();
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(fetchOptions.headers as Record<string, string>),
		};
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const response = await fetch(url, {
			credentials: "include",
			headers,
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
		tokenOverride?: string,
	) {
		return this.request<T>(path, { method: "GET", params }, tokenOverride);
	}

	post<T>(path: string, body?: unknown, tokenOverride?: string) {
		return this.request<T>(
			path,
			{
				method: "POST",
				body: body !== undefined ? JSON.stringify(body) : undefined,
			},
			tokenOverride,
		);
	}

	put<T>(path: string, body?: unknown) {
		return this.request<T>(path, {
			method: "PUT",
			body: JSON.stringify(body),
		});
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

	async uploadFile<T>(
		path: string,
		formData: FormData,
		tokenOverride?: string,
	): Promise<T> {
		const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
		const token = tokenOverride || this.getToken();
		const headers: Record<string, string> = {
			...(tokenOverride ? {} : {}),
		};
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const response = await fetch(url.toString(), {
			method: "POST",
			credentials: "include",
			headers,
			body: formData,
		});

		if (!response.ok) {
			const error = await response
				.json()
				.catch(() => ({ detail: "Unknown error" }));
			throw new ApiError(response.status, error.detail || "Upload failed");
		}

		return response.json();
	}

	async downloadFile(
		path: string,
		filename: string,
		tokenOverride?: string,
	): Promise<void> {
		const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
		const token = tokenOverride || this.getToken();
		const headers: Record<string, string> = {};
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const response = await fetch(url.toString(), {
			method: "GET",
			credentials: "include",
			headers,
		});

		if (!response.ok) {
			throw new ApiError(response.status, "Download failed");
		}

		const blob = await response.blob();
		const downloadUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = downloadUrl;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(downloadUrl);
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
