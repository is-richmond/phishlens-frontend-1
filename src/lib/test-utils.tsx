/**
 * Test utilities — shared helpers for rendering components with
 * required providers and mock data.
 */

import React, { type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";

/* ── Mock Auth Context ─────────────────────────────────────── */

export interface MockUser {
	id: string;
	email: string;
	full_name: string;
	institution: string;
	role: "researcher" | "admin";
	is_active: boolean;
	terms_accepted_at: string;
	created_at: string;
	updated_at: string;
}

export const mockResearcher: MockUser = {
	id: "00000000-0000-0000-0000-000000000001",
	email: "researcher@iitu.edu.kz",
	full_name: "Test Researcher",
	institution: "IITU",
	role: "researcher",
	is_active: true,
	terms_accepted_at: new Date().toISOString(),
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
};

export const mockAdmin: MockUser = {
	id: "00000000-0000-0000-0000-000000000002",
	email: "admin@iitu.edu.kz",
	full_name: "Test Admin",
	institution: "IITU",
	role: "admin",
	is_active: true,
	terms_accepted_at: new Date().toISOString(),
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
};

export const mockLogin = jest.fn();
export const mockRegister = jest.fn();
export const mockLogout = jest.fn();
export const mockRefreshUser = jest.fn();

/* ── Custom render with providers ──────────────────────────── */

/**
 * Render a component with all necessary providers.
 * Wraps the component in the mock AuthProvider context.
 */
export function renderWithProviders(
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper"> & {
		user?: MockUser | null;
		isLoading?: boolean;
	},
) {
	const { user = null, isLoading = false, ...renderOptions } = options || {};

	// We use a simple wrapper that provides the required auth state
	// via the jest.mock in each test file
	function Wrapper({ children }: { children: ReactNode }) {
		return <>{children}</>;
	}

	return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/* ── Re-export testing-library ─────────────────────────────── */

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
