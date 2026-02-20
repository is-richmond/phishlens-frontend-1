"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileSidebar from "@/components/layout/MobileSidebar";

/**
 * App Shell — the main layout for authenticated pages.
 * Composes Sidebar + Header + main content area.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	return (
		<div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
			{/* Desktop sidebar */}
			<div className='hidden lg:block'>
				<Sidebar
					collapsed={sidebarCollapsed}
					onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
				/>
			</div>

			{/* Mobile sidebar */}
			<MobileSidebar />

			{/* Main content area */}
			<div
				className={cn(
					"transition-all duration-300",
					sidebarCollapsed ? "lg:ml-16" : "lg:ml-60",
				)}
			>
				<Header />
				<main className='p-6'>{children}</main>
			</div>
		</div>
	);
}
