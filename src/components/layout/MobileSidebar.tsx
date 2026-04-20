"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import MobileOverlay from "@/components/layout/MobileOverlay";
import {
	LayoutDashboard,
	FileText,
	BookTemplate,
	Zap,
	FolderKanban,
	Users,
	ScrollText,
	Menu,
	Search,
} from "lucide-react";

const NAV_ITEMS = [
	{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ label: "Scenarios", href: "/scenarios", icon: FileText },
	{ label: "Templates", href: "/templates", icon: BookTemplate },
	{ label: "Generate", href: "/generate", icon: Zap },
	{ label: "Campaigns", href: "/campaigns", icon: FolderKanban },
	{ label: "Bulk Generation", href: "/bulk-generation", icon: Shield },
	{ label: "Settings", href: "/settings", icon: Users },
];


const ADMIN_NAV_ITEMS = [
	{ label: "Users", href: "/admin/users", icon: Users },
	{ label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
];

/**
 * Mobile sidebar with hamburger trigger and overlay panel.
 */
export default function MobileSidebar() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();
	const { user } = useAuth();
	const isAdmin = user?.role === "admin";

	return (
		<>
			{/* Hamburger button — visible only on mobile */}
			<button
				onClick={() => setOpen(true)}
				className='fixed top-4 left-4 z-30 lg:hidden p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'
				aria-label='Open menu'
			>
				<Menu className='w-5 h-5 text-slate-600 dark:text-slate-300' />
			</button>

			<MobileOverlay open={open} onClose={() => setOpen(false)}>
				{/* Logo */}
				<div className='flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-700'>
					<Link
						href='/dashboard'
						className='flex items-center gap-2'
						onClick={() => setOpen(false)}
					>
						<div className='w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center'>
							<Search className='w-4 h-4 text-white' />
						</div>
						<span className='font-bold text-lg text-slate-900 dark:text-white'>
							PhishLens
						</span>
					</Link>
				</div>

				{/* Navigation */}
				<nav className='py-4 px-2'>
					<ul className='space-y-1'>
						{NAV_ITEMS.map((item) => {
							const isActive =
								pathname === item.href || pathname.startsWith(item.href + "/");
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={() => setOpen(false)}
										className={cn(
											"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
											isActive
												? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
												: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50",
										)}
									>
										<item.icon className='w-5 h-5 shrink-0' />
										<span>{item.label}</span>
									</Link>
								</li>
							);
						})}
					</ul>

					{isAdmin && (
						<>
							<div className='my-4 mx-3 border-t border-slate-200 dark:border-slate-700' />
							<p className='px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
								Admin
							</p>
							<ul className='space-y-1'>
								{ADMIN_NAV_ITEMS.map((item) => {
									const isActive =
										pathname === item.href ||
										pathname.startsWith(item.href + "/");
									return (
										<li key={item.href}>
											<Link
												href={item.href}
												onClick={() => setOpen(false)}
												className={cn(
													"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
													isActive
														? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
														: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50",
												)}
											>
												<item.icon className='w-5 h-5 shrink-0' />
												<span>{item.label}</span>
											</Link>
										</li>
									);
								})}
							</ul>
						</>
					)}
				</nav>
			</MobileOverlay>
		</>
	);
}
