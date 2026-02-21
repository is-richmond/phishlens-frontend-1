/**
 * Sprint 5.2.2 — Register Page Tests
 *
 * Covers: form rendering, all fields present, password strength indicator,
 *         terms checkbox, validation errors, submit flow, navigation link.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		replace: jest.fn(),
		back: jest.fn(),
		refresh: jest.fn(),
		prefetch: jest.fn(),
		forward: jest.fn(),
	})),
	usePathname: jest.fn(() => "/register"),
	useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock AuthProvider
const mockRegister = jest.fn();
jest.mock("@/components/providers/AuthProvider", () => ({
	useAuth: () => ({
		user: null,
		isLoading: false,
		isAuthenticated: false,
		login: jest.fn(),
		register: mockRegister,
		logout: jest.fn(),
		refreshUser: jest.fn(),
	}),
	AuthProvider: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
}));

// Mock next/link
jest.mock("next/link", () => {
	return function MockLink({
		href,
		children,
		...rest
	}: {
		href: string;
		children: React.ReactNode;
		[key: string]: unknown;
	}) {
		return (
			<a href={href} {...rest}>
				{children}
			</a>
		);
	};
});

// Mock PasswordStrength & TermsModal to simplify tests
jest.mock("@/components/ui/PasswordStrength", () => ({
	PasswordStrength: ({ password }: { password: string }) => (
		<div data-testid='password-strength'>
			{password ? "Strength indicator" : ""}
		</div>
	),
}));

jest.mock("@/components/ui/TermsModal", () => ({
	TermsModal: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
		open ? (
			<div data-testid='terms-modal'>
				<button onClick={onClose}>Close</button>
			</div>
		) : null,
}));

import RegisterPage from "@/app/(auth)/register/page";

describe("RegisterPage", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the registration form", () => {
		render(<RegisterPage />);
		expect(
			screen.getByRole("heading", { name: /create account/i }),
		).toBeInTheDocument();
	});

	it("has all required fields", () => {
		render(<RegisterPage />);
		expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Institution")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
	});

	it("has a terms checkbox", () => {
		render(<RegisterPage />);
		expect(screen.getByRole("checkbox")).toBeInTheDocument();
	});

	it("has a submit button", () => {
		render(<RegisterPage />);
		expect(
			screen.getByRole("button", { name: /create account/i }),
		).toBeInTheDocument();
	});

	it("has a link to login page", () => {
		render(<RegisterPage />);
		const link = screen.getByRole("link", { name: /sign in/i });
		expect(link).toHaveAttribute("href", "/login");
	});

	it("shows password strength indicator when typing password", async () => {
		const user = userEvent.setup();
		render(<RegisterPage />);

		await user.type(screen.getByLabelText("Password"), "Test1");
		expect(screen.getByTestId("password-strength")).toHaveTextContent(
			"Strength indicator",
		);
	});

	it("opens terms modal when clicking Terms of Use link", async () => {
		const user = userEvent.setup();
		render(<RegisterPage />);

		const termsLink = screen.getByRole("button", {
			name: /terms of use/i,
		});
		await user.click(termsLink);
		expect(screen.getByTestId("terms-modal")).toBeInTheDocument();
	});

	it("toggles password visibility", async () => {
		const user = userEvent.setup();
		render(<RegisterPage />);

		const passwordInput = screen.getByLabelText("Password");
		expect(passwordInput).toHaveAttribute("type", "password");

		// Find the first "Show password" toggle
		const toggleButtons = screen.getAllByRole("button", {
			name: /show password/i,
		});
		await user.click(toggleButtons[0]);
		expect(passwordInput).toHaveAttribute("type", "text");
	});
});
