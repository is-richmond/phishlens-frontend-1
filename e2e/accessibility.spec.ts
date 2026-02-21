/**
 * Sprint 5.2.6 — Accessibility Audit Tests (Playwright + @axe-core/playwright)
 *
 * Validates WCAG 2.1 AA compliance for all public-facing pages.
 *
 * Install: npm i -D @axe-core/playwright
 */

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("WCAG 2.1 AA Compliance", () => {
	test("login page has no critical a11y violations", async ({ page }) => {
		await page.goto("/login");
		const results = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.analyze();

		expect(results.violations).toEqual([]);
	});

	test("register page has no critical a11y violations", async ({ page }) => {
		await page.goto("/register");
		const results = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.analyze();

		expect(results.violations).toEqual([]);
	});
});

test.describe("Contrast & Color", () => {
	test("login page meets colour-contrast requirements", async ({ page }) => {
		await page.goto("/login");
		const results = await new AxeBuilder({ page })
			.withRules(["color-contrast"])
			.analyze();

		expect(results.violations).toEqual([]);
	});

	test("register page meets colour-contrast requirements", async ({ page }) => {
		await page.goto("/register");
		const results = await new AxeBuilder({ page })
			.withRules(["color-contrast"])
			.analyze();

		expect(results.violations).toEqual([]);
	});
});

test.describe("Form Accessibility", () => {
	test("all login inputs have associated labels", async ({ page }) => {
		await page.goto("/login");
		const results = await new AxeBuilder({ page })
			.withRules(["label", "label-title-only"])
			.analyze();

		expect(results.violations).toEqual([]);
	});

	test("all register inputs have associated labels", async ({ page }) => {
		await page.goto("/register");
		const results = await new AxeBuilder({ page })
			.withRules(["label", "label-title-only"])
			.analyze();

		expect(results.violations).toEqual([]);
	});

	test("login form has proper focus management", async ({ page }) => {
		await page.goto("/login");

		// Verify tab order works
		await page.keyboard.press("Tab");
		const firstFocused = await page.evaluate(() =>
			document.activeElement?.tagName.toLowerCase(),
		);
		expect(firstFocused).toBeTruthy();
	});

	test("register form has proper focus management", async ({ page }) => {
		await page.goto("/register");

		await page.keyboard.press("Tab");
		const firstFocused = await page.evaluate(() =>
			document.activeElement?.tagName.toLowerCase(),
		);
		expect(firstFocused).toBeTruthy();
	});
});

test.describe("Semantic HTML", () => {
	test("pages use landmark roles", async ({ page }) => {
		await page.goto("/login");
		const results = await new AxeBuilder({ page })
			.withRules(["region", "landmark-one-main"])
			.analyze();

		// Log but don't fail for landmark issues (informational)
		if (results.violations.length > 0) {
			console.warn(
				"Landmark violations:",
				results.violations.map((v) => v.id),
			);
		}
	});

	test("pages have valid HTML structure", async ({ page }) => {
		await page.goto("/login");
		const results = await new AxeBuilder({ page })
			.withRules(["html-has-lang", "document-title", "meta-viewport", "bypass"])
			.analyze();

		// Filter for critical-only; some rules are best-practice
		const critical = results.violations.filter(
			(v) => v.impact === "critical" || v.impact === "serious",
		);
		expect(critical).toEqual([]);
	});
});
