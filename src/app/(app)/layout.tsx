"use client";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { SWRProvider } from "@/components/providers/SWRProvider";
import AppShell from "@/components/layout/AppShell";

/**
 * Layout for all authenticated (app) routes.
 * Wraps pages with SWRProvider (global fetch config), AuthProvider (route protection)
 * and AppShell (sidebar + header).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<SWRProvider>
			<AuthProvider>
				<AppShell>{children}</AppShell>
			</AuthProvider>
		</SWRProvider>
	);
}
