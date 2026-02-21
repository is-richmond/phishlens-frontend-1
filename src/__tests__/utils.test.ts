/**
 * Sprint 5.2 — Utility Function Tests
 *
 * Pure function unit tests for lib/utils.ts
 */

import {
	cn,
	formatDate,
	formatDateTime,
	getScoreColor,
	getScoreBgColor,
	formatCategory,
	truncate,
} from "@/lib/utils";

// ── cn() — Tailwind merge ──────────────────────────────────

describe("cn()", () => {
	it("merges simple classes", () => {
		expect(cn("px-2", "py-1")).toBe("px-2 py-1");
	});

	it("resolves conflicts — last wins", () => {
		const result = cn("px-2", "px-4");
		expect(result).toBe("px-4");
	});

	it("handles conditional classes", () => {
		const result = cn("base", false && "hidden", "extra");
		expect(result).toBe("base extra");
	});

	it("returns empty string for no input", () => {
		expect(cn()).toBe("");
	});
});

// ── formatDate() ────────────────────────────────────────────

describe("formatDate()", () => {
	it("formats ISO date", () => {
		const result = formatDate("2025-06-15T12:00:00Z");
		expect(result).toContain("2025");
		expect(result).toContain("Jun");
		expect(result).toContain("15");
	});
});

// ── formatDateTime() ────────────────────────────────────────

describe("formatDateTime()", () => {
	it("includes time component", () => {
		const result = formatDateTime("2025-06-15T14:30:00Z");
		expect(result).toContain("2025");
	});
});

// ── getScoreColor() ─────────────────────────────────────────

describe("getScoreColor()", () => {
	it("returns slate for null", () => {
		expect(getScoreColor(null)).toContain("slate");
	});

	it("returns success for high score (>=7)", () => {
		expect(getScoreColor(8)).toContain("success");
	});

	it("returns warning for medium score (4-6.9)", () => {
		expect(getScoreColor(5)).toContain("warning");
	});

	it("returns danger for low score (<4)", () => {
		expect(getScoreColor(2)).toContain("danger");
	});
});

// ── getScoreBgColor() ───────────────────────────────────────

describe("getScoreBgColor()", () => {
	it("returns slate bg for null", () => {
		expect(getScoreBgColor(null)).toContain("slate");
	});

	it("returns success bg for high score", () => {
		expect(getScoreBgColor(9)).toContain("success");
	});

	it("returns warning bg for medium score", () => {
		expect(getScoreBgColor(5.5)).toContain("warning");
	});

	it("returns danger bg for low score", () => {
		expect(getScoreBgColor(1)).toContain("danger");
	});
});

// ── formatCategory() ───────────────────────────────────────

describe("formatCategory()", () => {
	it("converts underscore to title case", () => {
		expect(formatCategory("credential_phishing")).toBe("Credential Phishing");
	});

	it("handles single word", () => {
		expect(formatCategory("whaling")).toBe("Whaling");
	});

	it("handles multi-word category", () => {
		expect(formatCategory("business_email_compromise")).toBe(
			"Business Email Compromise",
		);
	});
});

// ── truncate() ──────────────────────────────────────────────

describe("truncate()", () => {
	it("returns text unchanged if short enough", () => {
		expect(truncate("Hello", 10)).toBe("Hello");
	});

	it("truncates with ellipsis", () => {
		const result = truncate("This is a very long sentence", 10);
		expect(result).toHaveLength(11); // 10 chars + "…"
		expect(result).toContain("…");
	});

	it("handles exact boundary", () => {
		expect(truncate("12345", 5)).toBe("12345");
	});
});
