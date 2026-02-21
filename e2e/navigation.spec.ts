/**
 * Sprint 5.2.5 — E2E Navigation & Route Protection Tests (Playwright)
 *
 * Covers: route protection for all dashboard routes,
 *         public page accessibility, responsive behaviour.
 */

import { test, expect } from "@playwright/test";

/* ── Protected routes that should redirect unauthenticated users ── */
const protectedRoutes = [
	"/dashboard",
	"/scenarios",
	"/scenarios/new",
	"/templates",
	"/generate",
	"/campaigns",
	"/export",
	"/admin",
];

test.describe("Route Protection", () => {
	for (const route of protectedRoutes) {
		test(`${route} redirects to login`, async ({ page }) => {
			await page.goto(route);
			await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
		});
	}
});

/* ── Public pages that should be accessible without auth ─────────── */
test.describe("Public Pages", () => {
	test("login page loads without redirect", async ({ page }) => {
		await page.goto("/login");
		await expect(page).toHaveURL(/\/login/);
		await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
	});

	test("register page loads without redirect", async ({ page }) => {
		await page.goto("/register");
		await expect(page).toHaveURL(/\/register/);
		await expect(
			page.getByRole("button", { name: /create account/i }),
		).toBeVisible();
	});
});

/* ── Responsive layout checks ──────────────────────────────────── */
test.describe("Responsive Design", () => {
	test("login page is usable on mobile viewport", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/login");

		const emailInput = page.getByLabel("Email");
		await expect(emailInput).toBeVisible();
		await expect(emailInput).toBeEnabled();

		const submitBtn = page.getByRole("button", { name: /sign in/i });
		await expect(submitBtn).toBeVisible();
	});

	test("register page is usable on tablet viewport", async ({ page }) => {
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.goto("/register");

		await expect(page.getByLabel("Full Name")).toBeVisible();
		await expect(page.getByLabel("Email")).toBeVisible();
		await expect(
			page.getByRole("button", { name: /create account/i }),
		).toBeVisible();
	});
});
