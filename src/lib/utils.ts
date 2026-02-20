/**
 * Utility functions for PhishLens frontend.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper conflict resolution.
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

/**
 * Format a date string with time.
 */
export function formatDateTime(dateStr: string): string {
	return new Date(dateStr).toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * Get color class for a realism score (1-10).
 */
export function getScoreColor(score: number | null): string {
	if (score === null) return "text-slate-400";
	if (score >= 7) return "text-success-500";
	if (score >= 4) return "text-warning-500";
	return "text-danger-500";
}

/**
 * Get background color class for a realism score.
 */
export function getScoreBgColor(score: number | null): string {
	if (score === null) return "bg-slate-100 dark:bg-slate-800";
	if (score >= 7) return "bg-success-50 dark:bg-success-500/10";
	if (score >= 4) return "bg-warning-50 dark:bg-warning-500/10";
	return "bg-danger-50 dark:bg-danger-500/10";
}

/**
 * Format pretext category for display.
 */
export function formatCategory(category: string): string {
	return category
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "…";
}
