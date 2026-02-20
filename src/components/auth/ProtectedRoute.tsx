"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * ProtectedRoute — wraps children and redirects unauthenticated users to /login.
 * Shows a loading spinner while auth state is being resolved.
 *
 * Optionally requires a specific role (e.g. "admin").
 */
export default function ProtectedRoute({
	children,
	requiredRole,
}: {
	children: ReactNode;
	requiredRole?: "admin" | "researcher";
}) {
	const { user, isLoading, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isLoading) return;

		if (!isAuthenticated) {
			router.replace("/login");
			return;
		}

		// Role check: if a specific role is required and user doesn't have it
		if (requiredRole && user?.role !== requiredRole) {
			router.replace("/dashboard");
		}
	}, [isLoading, isAuthenticated, user, requiredRole, router]);

	// Loading state
	if (isLoading) {
		return (
			<div className='flex min-h-[50vh] items-center justify-center'>
				<div className='flex flex-col items-center gap-3'>
					<svg
						className='h-8 w-8 animate-spin text-primary-600'
						viewBox='0 0 24 24'
						fill='none'
					>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'
						/>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
						/>
					</svg>
					<p className='text-sm text-slate-500 dark:text-slate-400'>Loading…</p>
				</div>
			</div>
		);
	}

	// Not authenticated — will redirect
	if (!isAuthenticated) return null;

	// Wrong role — will redirect
	if (requiredRole && user?.role !== requiredRole) return null;

	return <>{children}</>;
}
