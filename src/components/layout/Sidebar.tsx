"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import {
	LayoutDashboard,
	FileText,
	BookTemplate,
	Zap,
	FolderKanban,
	Shield,
	Users,
	ScrollText,
	ChevronLeft,
	ChevronRight,
	Search,
} from "lucide-react";

interface NavItem {
	label: string;
	href: string;
	icon: React.ElementType;
	adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
	{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ label: "Scenarios", href: "/scenarios", icon: FileText },
	{ label: "Templates", href: "/templates", icon: BookTemplate },
	{ label: "Generate", href: "/generate", icon: Zap },
	{ label: "Campaigns", href: "/campaigns", icon: FolderKanban },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
	{ label: "Users", href: "/admin/users", icon: Users, adminOnly: true },
	{
		label: "Audit Logs",
		href: "/admin/audit-logs",
		icon: ScrollText,
		adminOnly: true,
	},
];

interface SidebarProps {
	collapsed: boolean;
	onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
	const pathname = usePathname();
	const { user } = useAuth();
	const isAdmin = user?.role === "admin";

	return (
		<aside
			className={cn(
				"fixed left-0 top-0 z-40 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col",
				collapsed ? "w-16" : "w-60",
			)}
		>
			{/* Logo */}
			<div className='flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-700 shrink-0'>
				<Link
					href='/dashboard'
					className='flex items-center gap-2 overflow-hidden'
				>
					<div className='w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0'>
						<Search className='w-4 h-4 text-white' />
					</div>
					{!collapsed && (
						<span className='font-bold text-lg text-slate-900 dark:text-white whitespace-nowrap'>
							PhishLens
						</span>
					)}
				</Link>
			</div>

			{/* Navigation */}
			<nav className='flex-1 overflow-y-auto py-4 px-2'>
				<ul className='space-y-1'>
					{NAV_ITEMS.map((item) => {
						const isActive =
							pathname === item.href || pathname.startsWith(item.href + "/");
						return (
							<li key={item.href}>
								<Link
									href={item.href}
									className={cn(
										"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
										isActive
											? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
											: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white",
									)}
									title={collapsed ? item.label : undefined}
								>
									<item.icon
										className={cn(
											"w-5 h-5 shrink-0",
											isActive
												? "text-primary-600 dark:text-primary-400"
												: "text-slate-400 dark:text-slate-500",
										)}
									/>
									{!collapsed && <span>{item.label}</span>}
								</Link>
							</li>
						);
					})}
				</ul>

				{/* Admin Section */}
				{isAdmin && (
					<>
						<div className='my-4 mx-3 border-t border-slate-200 dark:border-slate-700' />
						{!collapsed && (
							<p className='px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
								Admin
							</p>
						)}
						<ul className='space-y-1'>
							{ADMIN_NAV_ITEMS.map((item) => {
								const isActive =
									pathname === item.href ||
									pathname.startsWith(item.href + "/");
								return (
									<li key={item.href}>
										<Link
											href={item.href}
											className={cn(
												"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
												isActive
													? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
													: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white",
											)}
											title={collapsed ? item.label : undefined}
										>
											<item.icon
												className={cn(
													"w-5 h-5 shrink-0",
													isActive
														? "text-primary-600 dark:text-primary-400"
														: "text-slate-400 dark:text-slate-500",
												)}
											/>
											{!collapsed && <span>{item.label}</span>}
										</Link>
									</li>
								);
							})}
						</ul>
					</>
				)}
			</nav>

			{/* Collapse Toggle */}
			<div className='shrink-0 border-t border-slate-200 dark:border-slate-700 p-2'>
				<button
					onClick={onToggle}
					className='w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors'
					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					{collapsed ? (
						<ChevronRight className='w-5 h-5' />
					) : (
						<ChevronLeft className='w-5 h-5' />
					)}
				</button>
			</div>
		</aside>
	);
}
