"use client";

import { useState, useEffect } from "react";
import {
	ScrollText,
	Search,
	ChevronDown,
	Download,
	Clock,
	User as UserIcon,
	Activity,
	ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuditLogs } from "@/lib/hooks";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/FormElements";
import type { AuditLog } from "@/types";

/* ────────────────────────────────────────────────────────────
   AuditLogViewer — Chronological audit log with filters & export
   ──────────────────────────────────────────────────────────── */

/** Map action_type strings to readable labels & colors */
function getActionLabel(action: string) {
	const map: Record<string, { label: string; color: string }> = {
		"user.login": {
			label: "Login",
			color: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
		},
		"user.register": {
			label: "Register",
			color:
				"bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
		},
		"generation.create": {
			label: "Generate",
			color:
				"bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
		},
		"scenario.create": {
			label: "Scenario Created",
			color:
				"bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
		},
		"scenario.update": {
			label: "Scenario Updated",
			color:
				"bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
		},
		"scenario.delete": {
			label: "Scenario Deleted",
			color: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
		},
		"admin.update_user": {
			label: "User Updated",
			color:
				"bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
		},
		"admin.suspend_user": {
			label: "User Suspended",
			color: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
		},
		"admin.reactivate_user": {
			label: "User Reactivated",
			color:
				"bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
		},
		"campaign.create": {
			label: "Campaign Created",
			color: "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
		},
		"export.download": {
			label: "Export",
			color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
		},
	};
	return (
		map[action] || {
			label: action
				.replace(/\./g, " ")
				.replace(/\b\w/g, (c) => c.toUpperCase()),
			color:
				"bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400",
		}
	);
}

export function AuditLogViewer() {
	const [page, setPage] = useState(1);
	const [actionFilter, setActionFilter] = useState("");
	const [actionTypes, setActionTypes] = useState<string[]>([]);
	const [exporting, setExporting] = useState(false);
	const perPage = 30;

	const { data, isLoading } = useAuditLogs({
		page,
		per_page: perPage,
		action_type: actionFilter || undefined,
	});

	/* Load action types for dropdown */
	useEffect(() => {
		api
			.get<string[]>("/v1/admin/audit-logs/action-types")
			.then(setActionTypes)
			.catch(() => {});
	}, []);

	/* Export logs as JSON download */
	const handleExport = async () => {
		setExporting(true);
		try {
			const allLogs = await api.get<{
				items: AuditLog[];
				total: number;
			}>("/v1/admin/audit-logs?per_page=200&page=1");

			const blob = new Blob([JSON.stringify(allLogs.items, null, 2)], {
				type: "application/json",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `phishlens-audit-logs-${new Date().toISOString().slice(0, 10)}.json`;
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			// error
		} finally {
			setExporting(false);
		}
	};

	const totalPages = data ? Math.ceil(data.total / perPage) : 0;

	return (
		<div>
			{/* Toolbar */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5'>
				<div className='flex items-center gap-2'>
					<div className='relative'>
						<select
							value={actionFilter}
							onChange={(e) => {
								setActionFilter(e.target.value);
								setPage(1);
							}}
							className='appearance-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-3 pr-8 py-2 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500'
						>
							<option value=''>All Actions</option>
							{actionTypes.map((t) => (
								<option key={t} value={t}>
									{getActionLabel(t).label}
								</option>
							))}
						</select>
						<ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none' />
					</div>
					{data && (
						<span className='text-xs text-slate-400 dark:text-slate-500'>
							{data.total} total entries
						</span>
					)}
				</div>

				<Button
					variant='outline'
					onClick={handleExport}
					isLoading={exporting}
					className='text-xs'
				>
					<Download className='h-3.5 w-3.5' />
					Export Logs
				</Button>
			</div>

			{/* Log list */}
			<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden'>
				{isLoading && (
					<div className='divide-y divide-slate-100 dark:divide-slate-700'>
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className='px-4 py-3.5 animate-pulse'>
								<div className='flex items-center gap-3'>
									<div className='h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700' />
									<div className='flex-1 space-y-1.5'>
										<div className='h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded' />
										<div className='h-3 w-32 bg-slate-100 dark:bg-slate-700/50 rounded' />
									</div>
									<div className='h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full' />
								</div>
							</div>
						))}
					</div>
				)}

				{data && data.items.length > 0 && (
					<div className='divide-y divide-slate-100 dark:divide-slate-700'>
						{data.items.map((log) => {
							const action = getActionLabel(log.action_type);
							return (
								<div
									key={log.id}
									className='px-4 py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors'
								>
									<div className='flex items-start gap-3'>
										{/* Icon */}
										<div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 shrink-0 mt-0.5'>
											<Activity className='h-4 w-4 text-slate-500 dark:text-slate-400' />
										</div>

										{/* Content */}
										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-2 flex-wrap'>
												<span
													className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${action.color}`}
												>
													{action.label}
												</span>
												{log.resource_type && (
													<span className='text-[10px] text-slate-400 dark:text-slate-500'>
														{log.resource_type}
														{log.resource_id && (
															<>
																{" "}
																<span className='font-mono'>
																	{log.resource_id.slice(0, 8)}…
																</span>
															</>
														)}
													</span>
												)}
											</div>

											<div className='flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 dark:text-slate-500'>
												<span className='inline-flex items-center gap-1'>
													<Clock className='h-3 w-3' />
													{formatDateTime(log.created_at)}
												</span>
												{log.user_id && (
													<span className='inline-flex items-center gap-1'>
														<UserIcon className='h-3 w-3' />
														<span className='font-mono'>
															{log.user_id.slice(0, 8)}…
														</span>
													</span>
												)}
												{log.ip_address && (
													<span className='hidden sm:inline-flex items-center gap-1'>
														<ExternalLink className='h-3 w-3' />
														{log.ip_address}
													</span>
												)}
											</div>

											{/* Details */}
											{log.details && Object.keys(log.details).length > 0 && (
												<div className='mt-2 rounded-md bg-slate-50 dark:bg-slate-700/30 px-3 py-2'>
													<pre className='text-[10px] text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap break-all'>
														{JSON.stringify(log.details, null, 2)}
													</pre>
												</div>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{data && data.items.length === 0 && (
					<div className='py-16 text-center'>
						<ScrollText className='h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3' />
						<p className='text-sm text-slate-500 dark:text-slate-400'>
							{actionFilter
								? "No logs match the selected filter"
								: "No audit logs recorded yet"}
						</p>
					</div>
				)}

				{/* Pagination */}
				{data && totalPages > 1 && (
					<div className='flex items-center justify-center gap-2 border-t border-slate-100 dark:border-slate-700 px-4 py-3'>
						<Button
							variant='outline'
							disabled={page <= 1}
							onClick={() => setPage((p) => p - 1)}
							className='text-xs'
						>
							Previous
						</Button>
						<span className='text-xs text-slate-500 dark:text-slate-400'>
							Page {page} of {totalPages}
						</span>
						<Button
							variant='outline'
							disabled={page >= totalPages}
							onClick={() => setPage((p) => p + 1)}
							className='text-xs'
						>
							Next
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
