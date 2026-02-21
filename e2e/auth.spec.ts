/**
 * Sprint 5.2.5 — E2E Authentication Flow Tests (Playwright)
 *
 * Covers: login page rendering, registration page rendering,
 *         navigation between auth pages, protected route redirect.
 */

import { test, expect } from "@playwright/test";

test.describe("Authentication Pages", () => {
	test("login page renders correctly", async ({ page }) => {
		await page.goto("/login");
		await expect(page.getByText("Welcome back")).toBeVisible();
		await expect(page.getByLabel("Email")).toBeVisible();
		await expect(page.getByLabel("Password")).toBeVisible();
		await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
	});

	test("register page renders correctly", async ({ page }) => {
		await page.goto("/register");
		await expect(page.getByText("Create Account")).toBeVisible();
		await expect(page.getByLabel("Full Name")).toBeVisible();
		await expect(page.getByLabel("Email")).toBeVisible();
		await expect(page.getByLabel("Institution")).toBeVisible();
		await expect(page.getByLabel("Password")).toBeVisible();
		await expect(page.getByLabel("Confirm Password")).toBeVisible();
	});

	test("navigate from login to register", async ({ page }) => {
		await page.goto("/login");
		await page.getByRole("link", { name: /register/i }).click();
		await expect(page).toHaveURL(/\/register/);
	});

	test("navigate from register to login", async ({ page }) => {
		await page.goto("/register");
		await page.getByRole("link", { name: /sign in/i }).click();
		await expect(page).toHaveURL(/\/login/);
	});

	test("protected routes redirect to login", async ({ page }) => {
		await page.goto("/dashboard");
		// Should redirect unauthenticated user to login
		await expect(page).toHaveURL(/\/login/);
	});
});

test.describe("Login Form Validation", () => {
	test("shows error for invalid credentials", async ({ page }) => {
		await page.goto("/login");
		await page.getByLabel("Email").fill("test@iitu.edu.kz");
		await page.getByLabel("Password").fill("WrongPassword1!");
		await page.getByRole("button", { name: /sign in/i }).click();

		// Wait for error alert to appear
		const alert = page.getByRole("alert");
		await expect(alert).toBeVisible({ timeout: 10_000 });
	});

	test("password visibility toggle works", async ({ page }) => {
		await page.goto("/login");
		const passwordInput = page.getByLabel("Password");
		await passwordInput.fill("TestPassword1!");

		// Initially type=password
		await expect(passwordInput).toHaveAttribute("type", "password");

		// Click toggle
		await page.getByRole("button", { name: /show password/i }).click();
		await expect(passwordInput).toHaveAttribute("type", "text");
	});
});

test.describe("Accessibility", () => {
	test("login page has proper ARIA attributes", async ({ page }) => {
		await page.goto("/login");

		// Labels are properly associated
		const emailInput = page.getByLabel("Email");
		await expect(emailInput).toHaveAttribute("aria-invalid", "false");

		// Button is accessible
		const submitBtn = page.getByRole("button", { name: /sign in/i });
		await expect(submitBtn).toBeVisible();
	});

	test("register page has accessible form elements", async ({ page }) => {
		await page.goto("/register");

		// All inputs have labels
		await expect(page.getByLabel("Full Name")).toBeVisible();
		await expect(page.getByLabel("Email")).toBeVisible();
		await expect(page.getByLabel("Institution")).toBeVisible();

		// Checkbox is accessible
		const checkbox = page.getByRole("checkbox");
		await expect(checkbox).toBeVisible();
	});

	test("login page is keyboard navigable", async ({ page }) => {
		await page.goto("/login");

		// Tab through form elements
		await page.keyboard.press("Tab");
		await page.keyboard.press("Tab"); // Email field
		const focused = page.locator(":focus");
		await expect(focused).toBeVisible();
	});
});
