"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
	type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type {
	User,
	LoginRequest,
	RegisterRequest,
	TokenResponse,
} from "@/types";

interface AuthContextValue {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (data: LoginRequest) => Promise<void>;
	register: (data: RegisterRequest) => Promise<void>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Public routes that don't require authentication */
const PUBLIC_ROUTES = ["/", "/login", "/register"];

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [token, setToken] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	const isAuthenticated = !!user;

	/** Fetch the current user profile */
	const refreshUser = useCallback(async () => {
		try {
			const storedToken = localStorage.getItem("phishlens-token");
			if (!storedToken) {
				setUser(null);
				setIsLoading(false);
				return;
			}
			const userData = await api.get<User>(
				"/v1/auth/me",
				undefined,
				storedToken,
			);
			setUser(userData);
		} catch {
			// Token is invalid or expired
			localStorage.removeItem("phishlens-token");
			setToken(null);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	/** Login with email and password */
	const login = useCallback(
		async (data: LoginRequest) => {
			const resp = await api.post<TokenResponse>("/v1/auth/login", data);
			localStorage.setItem("phishlens-token", resp.access_token);
			setToken(resp.access_token);
			// Fetch user profile
			const userData = await api.get<User>(
				"/v1/auth/me",
				undefined,
				resp.access_token,
			);
			setUser(userData);
			router.push("/dashboard");
		},
		[router],
	);

	/** Register a new account */
	const register = useCallback(
		async (data: RegisterRequest) => {
			await api.post<User>("/v1/auth/register", data);
			// Auto-login after registration
			await login({ email: data.email, password: data.password });
		},
		[login],
	);

	/** Logout and clear session */
	const logout = useCallback(async () => {
		try {
			const storedToken = localStorage.getItem("phishlens-token");
			if (storedToken) {
				await api.post("/v1/auth/logout", undefined, storedToken);
			}
		} catch {
			// Ignore errors on logout
		}
		localStorage.removeItem("phishlens-token");
		setToken(null);
		setUser(null);
		router.push("/login");
	}, [router]);

	// Initialize on mount
	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	// Redirect unauthenticated users away from protected routes
	useEffect(() => {
		if (isLoading) return;
		if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
			router.push("/login");
		}
	}, [isLoading, isAuthenticated, pathname, router]);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated,
				login,
				register,
				logout,
				refreshUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
