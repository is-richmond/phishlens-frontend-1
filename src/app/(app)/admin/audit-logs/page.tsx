"use client";

import { ScrollText, BarChart3 } from "lucide-react";
import { useState } from "react";
import { AuditLogViewer } from "@/components/admin/AuditLogViewer";
import { SystemHealthDashboard } from "@/components/admin/SystemHealthDashboard";

export default function AuditLogsPage() {
	const [tab, setTab] = useState<"logs" | "dashboard">("dashboard");

	return (
		<div>
			<div className='flex items-center gap-3 mb-6'>
				<ScrollText className='w-7 h-7 text-primary-600' />
				<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
					Audit & Health
				</h1>
			</div>

			{/* Tab switcher */}
			<div className='flex gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 w-fit mb-6'>
				<button
					type='button'
					onClick={() => setTab("dashboard")}
					className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
						tab === "dashboard"
							? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
							: "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
					}`}
				>
					<BarChart3 className='h-3.5 w-3.5' />
					Dashboard
				</button>
				<button
					type='button'
					onClick={() => setTab("logs")}
					className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
						tab === "logs"
							? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
							: "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
					}`}
				>
					<ScrollText className='h-3.5 w-3.5' />
					Audit Logs
				</button>
			</div>

			{tab === "dashboard" && <SystemHealthDashboard />}
			{tab === "logs" && <AuditLogViewer />}
		</div>
	);
}
