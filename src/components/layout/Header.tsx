"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
	Sun,
	Moon,
	ChevronRight,
	LogOut,
	User as UserIcon,
	Settings,
} from "lucide-react";

/** Map routes to breadcrumb labels */
const ROUTE_LABELS: Record<string, string> = {
	dashboard: "Dashboard",
	scenarios: "Scenarios",
	templates: "Templates",
	generate: "Generate",
	campaigns: "Campaigns",
	settings: "Settings",
	admin: "Admin",
	users: "Users",
	"audit-logs": "Audit Logs",
	new: "New",
	edit: "Edit",
};

export default function Header() {
	const pathname = usePathname();
	const { user, logout } = useAuth();
	const { resolvedTheme, toggleTheme } = useTheme();
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Build breadcrumbs from pathname
	const segments = pathname.split("/").filter(Boolean);
	const breadcrumbs = segments.map((segment, index) => ({
		label: ROUTE_LABELS[segment] || segment,
		href: "/" + segments.slice(0, index + 1).join("/"),
		isLast: index === segments.length - 1,
	}));

	// Close dropdown on click outside
	useEffect(() => {
		function handler(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMenuOpen(false);
			}
		}
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	return (
		<header className='h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between pl-16 pr-6 lg:px-6 shrink-0'>
			{/* Breadcrumbs */}
			<nav className='flex items-center text-sm' aria-label='Breadcrumb'>
				{breadcrumbs.map((crumb, i) => (
					<span key={crumb.href} className='flex items-center'>
						{i > 0 && (
							<ChevronRight className='w-4 h-4 mx-1.5 text-slate-400' />
						)}
						{crumb.isLast ? (
							<span className='font-medium text-slate-900 dark:text-white'>
								{crumb.label}
							</span>
						) : (
							<a
								href={crumb.href}
								className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'
							>
								{crumb.label}
							</a>
						)}
					</span>
				))}
				{breadcrumbs.length === 0 && (
					<span className='font-medium text-slate-900 dark:text-white'>
						Dashboard
					</span>
				)}
			</nav>

			{/* Right side: theme toggle + user menu */}
			<div className='flex items-center gap-3'>
				{/* Theme toggle */}
				<button
					onClick={toggleTheme}
					className='p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
					aria-label='Toggle dark mode'
				>
					{resolvedTheme === "dark" ? (
						<Sun className='w-5 h-5' />
					) : (
						<Moon className='w-5 h-5' />
					)}
				</button>

				{/* User menu */}
				{user && (
					<div className='relative' ref={menuRef}>
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className='flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
						>
							<div className='w-8 h-8 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center'>
								<span className='text-sm font-semibold text-primary-700 dark:text-primary-400'>
									{user.full_name.charAt(0).toUpperCase()}
								</span>
							</div>
							<div className='hidden md:block text-left'>
								<p className='text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight'>
									{user.full_name}
								</p>
								<p className='text-xs text-slate-500 dark:text-slate-400 leading-tight'>
									{user.role}
								</p>
							</div>
						</button>

						{/* Dropdown */}
						{menuOpen && (
							<div className='absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-50'>
								<div className='px-4 py-3 border-b border-slate-200 dark:border-slate-700'>
									<p className='text-sm font-medium text-slate-900 dark:text-white'>
										{user.full_name}
									</p>
									<p className='text-xs text-slate-500 dark:text-slate-400 truncate'>
										{user.email}
									</p>
								</div>
								<a
									href='/settings'
									className='flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
									onClick={() => setMenuOpen(false)}
								>
									<Settings className='w-4 h-4' />
									Settings
								</a>
								<button
									onClick={() => {
										setMenuOpen(false);
										logout();
									}}
									className='w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10'
								>
									<LogOut className='w-4 h-4' />
									Log out
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</header>
	);
}
