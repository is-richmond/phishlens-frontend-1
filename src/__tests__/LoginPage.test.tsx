/**
 * Sprint 5.2.2 — Login Page Tests
 *
 * Covers: form rendering, field validation, submit flow, error display,
 *         password visibility toggle, navigation link.
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
	usePathname: jest.fn(() => "/login"),
	useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock AuthProvider
const mockLogin = jest.fn();
jest.mock("@/components/providers/AuthProvider", () => ({
	useAuth: () => ({
		user: null,
		isLoading: false,
		isAuthenticated: false,
		login: mockLogin,
		register: jest.fn(),
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

import LoginPage from "@/app/(auth)/login/page";

describe("LoginPage", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the login form", () => {
		render(<LoginPage />);
		expect(screen.getByText("Welcome back")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
	});

	it("renders the submit button", () => {
		render(<LoginPage />);
		expect(
			screen.getByRole("button", { name: /sign in/i }),
		).toBeInTheDocument();
	});

	it("has a link to register page", () => {
		render(<LoginPage />);
		const link = screen.getByRole("link", { name: /register/i });
		expect(link).toHaveAttribute("href", "/register");
	});

	it("toggles password visibility", async () => {
		const user = userEvent.setup();
		render(<LoginPage />);

		const passwordInput = screen.getByLabelText("Password");
		expect(passwordInput).toHaveAttribute("type", "password");

		const toggleBtn = screen.getByRole("button", {
			name: /show password/i,
		});
		await user.click(toggleBtn);
		expect(passwordInput).toHaveAttribute("type", "text");
	});

	it("calls login on valid form submission", async () => {
		const user = userEvent.setup();
		mockLogin.mockResolvedValue(undefined);

		render(<LoginPage />);

		await user.type(screen.getByLabelText("Email"), "test@iitu.edu.kz");
		await user.type(screen.getByLabelText("Password"), "Test1234!");

		const submitBtn = screen.getByRole("button", { name: /sign in/i });
		await user.click(submitBtn);

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				email: "test@iitu.edu.kz",
				password: "Test1234!",
			});
		});
	});

	it("shows server error on failed login", async () => {
		const user = userEvent.setup();
		const { ApiError } = await import("@/lib/api");
		mockLogin.mockRejectedValue(new ApiError(401, "Invalid credentials"));

		render(<LoginPage />);

		await user.type(screen.getByLabelText("Email"), "test@iitu.edu.kz");
		await user.type(screen.getByLabelText("Password"), "Wrong1234!");
		await user.click(screen.getByRole("button", { name: /sign in/i }));

		await waitFor(() => {
			expect(screen.getByRole("alert")).toHaveTextContent(
				/invalid email or password/i,
			);
		});
	});
});
