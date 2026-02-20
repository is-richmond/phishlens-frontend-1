"use client";

import { UserX, UserCheck, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminUsers } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/FormElements";
import { useState } from "react";
import type { User } from "@/types";

/* ────────────────────────────────────────────────────────────
   UserApprovalSection — Suspended users panel for quick review
   ──────────────────────────────────────────────────────────── */

export function UserApprovalSection() {
	const {
		data: users,
		isLoading,
		mutate,
	} = useAdminUsers({ is_active: false });
	const [processingId, setProcessingId] = useState<string | null>(null);

	const handleReactivate = async (user: User) => {
		setProcessingId(user.id);
		try {
			await api.post(`/v1/admin/users/${user.id}/reactivate`, {});
			mutate();
		} catch {
			// error
		} finally {
			setProcessingId(null);
		}
	};

	if (isLoading) {
		return (
			<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 animate-pulse'>
				<div className='h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-3' />
				<div className='space-y-3'>
					{Array.from({ length: 2 }).map((_, i) => (
						<div
							key={i}
							className='h-12 bg-slate-100 dark:bg-slate-700/50 rounded-lg'
						/>
					))}
				</div>
			</div>
		);
	}

	if (!users || users.length === 0) {
		return null;
	}

	return (
		<div className='rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5 p-5 mb-6'>
			<div className='flex items-center gap-2 mb-3'>
				<AlertTriangle className='h-4 w-4 text-amber-600 dark:text-amber-400' />
				<h3 className='text-sm font-semibold text-amber-800 dark:text-amber-300'>
					Suspended Accounts ({users.length})
				</h3>
			</div>
			<p className='text-xs text-amber-600/80 dark:text-amber-400/70 mb-4'>
				These users cannot access the platform. Review and reactivate if
				appropriate.
			</p>

			<div className='space-y-2'>
				{users.map((user) => (
					<div
						key={user.id}
						className='flex items-center justify-between gap-3 rounded-lg border border-amber-200/60 dark:border-amber-500/20 bg-white dark:bg-slate-800 px-4 py-2.5'
					>
						<div className='flex items-center gap-3 min-w-0'>
							<div className='flex h-8 w-8 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 shrink-0'>
								<UserX className='h-4 w-4 text-red-500 dark:text-red-400' />
							</div>
							<div className='min-w-0'>
								<p className='text-sm font-medium text-slate-900 dark:text-white truncate'>
									{user.full_name}
								</p>
								<p className='text-[10px] text-slate-400 dark:text-slate-500 truncate'>
									{user.email} · {user.institution} · Joined{" "}
									{formatDate(user.created_at)}
								</p>
							</div>
						</div>
						<Button
							onClick={() => handleReactivate(user)}
							isLoading={processingId === user.id}
							className='shrink-0 text-[10px] h-7 px-3 bg-success-600 hover:bg-success-700 focus:ring-success-500/40'
						>
							<UserCheck className='h-3 w-3' />
							Reactivate
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}
