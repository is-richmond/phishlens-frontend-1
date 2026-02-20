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
	// AND redirect authenticated users away from auth pages
	useEffect(() => {
		if (isLoading) return;

		const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

		if (!isAuthenticated && !isPublicRoute) {
			router.push("/login");
		} else if (
			isAuthenticated &&
			(pathname === "/login" || pathname === "/register")
		) {
			router.push("/dashboard");
		}
	}, [isLoading, isAuthenticated, pathname, router]);

	// Show a loading screen while resolving auth state
	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900'>
				<div className='flex flex-col items-center gap-3'>
					<svg
						className='h-10 w-10 animate-spin text-primary-600'
						viewBox='0 0 24 24'
						fill='none'
					>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'
						/>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
						/>
					</svg>
					<p className='text-sm text-slate-500 dark:text-slate-400'>
						Loading PhishLens…
					</p>
				</div>
			</div>
		);
	}

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
