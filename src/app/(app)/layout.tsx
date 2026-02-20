"use client";

import { AuthProvider } from "@/components/providers/AuthProvider";
import AppShell from "@/components/layout/AppShell";

/**
 * Layout for all authenticated (app) routes.
 * Wraps pages with AuthProvider (route protection) and AppShell (sidebar + header).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<AppShell>{children}</AppShell>
		</AuthProvider>
	);
}
