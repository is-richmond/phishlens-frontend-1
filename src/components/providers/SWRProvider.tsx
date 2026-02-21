"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";

/**
 * Global SWR configuration provider.
 *
 * Disables automatic revalidation on window focus and reconnect to prevent
 * request storms that trigger backend rate limits. Data is still fetched
 * on mount and can be mutated/revalidated explicitly.
 */
export function SWRProvider({ children }: { children: ReactNode }) {
	return (
		<SWRConfig
			value={{
				revalidateOnFocus: false,
				revalidateOnReconnect: false,
				dedupingInterval: 5000,
				errorRetryCount: 3,
				errorRetryInterval: 5000,
				shouldRetryOnError: (error: unknown) => {
					// Don't retry on 401 (unauthorized) or 429 (rate limited)
					if (
						error &&
						typeof error === "object" &&
						"status" in error &&
						(error.status === 401 || error.status === 429)
					) {
						return false;
					}
					return true;
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
