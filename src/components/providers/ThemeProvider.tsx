"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
	theme: Theme;
	resolvedTheme: "light" | "dark";
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("system");
	const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

	const applyTheme = useCallback((t: Theme) => {
		const resolved = t === "system" ? getSystemTheme() : t;
		setResolvedTheme(resolved);

		if (resolved === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	const setTheme = useCallback(
		(t: Theme) => {
			setThemeState(t);
			localStorage.setItem("phishlens-theme", t);
			applyTheme(t);
		},
		[applyTheme],
	);

	const toggleTheme = useCallback(() => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}, [resolvedTheme, setTheme]);

	// Initialize from localStorage
	useEffect(() => {
		const stored = localStorage.getItem("phishlens-theme") as Theme | null;
		const initial = stored || "system";
		setThemeState(initial);
		applyTheme(initial);
	}, [applyTheme]);

	// Listen for system theme changes
	useEffect(() => {
		if (theme !== "system") return;
		const mql = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => applyTheme("system");
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, [theme, applyTheme]);

	return (
		<ThemeContext.Provider
			value={{ theme, resolvedTheme, setTheme, toggleTheme }}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}
