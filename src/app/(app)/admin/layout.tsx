"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

/**
 * Layout for admin pages — requires admin role.
 * Non-admin users are redirected to /dashboard.
 */
export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ProtectedRoute requiredRole='admin'>{children}</ProtectedRoute>;
}
