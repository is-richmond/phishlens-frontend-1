"use client";

import { useState } from "react";
import {
	Search,
	Shield,
	ShieldCheck,
	UserCheck,
	UserX,
	ChevronDown,
	MoreHorizontal,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAdminUsers } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/FormElements";
import type { User } from "@/types";

/* ────────────────────────────────────────────────────────────
   UserManagementTable — Full user list with filters & actions
   ──────────────────────────────────────────────────────────── */

export function UserManagementTable() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<string>("");
	const perPage = 20;

	/* Modal state */
	const [actionUser, setActionUser] = useState<User | null>(null);
	const [actionType, setActionType] = useState<
		"suspend" | "reactivate" | "role" | null
	>(null);
	const [processing, setProcessing] = useState(false);
	const [openMenu, setOpenMenu] = useState<string | null>(null);

	const {
		data: users,
		isLoading,
		mutate,
	} = useAdminUsers({
		page,
		per_page: perPage,
		role: roleFilter || undefined,
		is_active: statusFilter ? statusFilter === "active" : undefined,
		search: search || undefined,
	});

	/* ---- Actions ---- */

	const handleSuspend = async (user: User) => {
		setProcessing(true);
		try {
			await api.post(`/v1/admin/users/${user.id}/suspend`, {});
			mutate();
		} catch {
			// error
		} finally {
			setProcessing(false);
			setActionUser(null);
			setActionType(null);
		}
	};

	const handleReactivate = async (user: User) => {
		setProcessing(true);
		try {
			await api.post(`/v1/admin/users/${user.id}/reactivate`, {});
			mutate();
		} catch {
			// error
		} finally {
			setProcessing(false);
			setActionUser(null);
			setActionType(null);
		}
	};

	const handleRoleChange = async (user: User) => {
		const newRole = user.role === "admin" ? "researcher" : "admin";
		setProcessing(true);
		try {
			await api.patch(`/v1/admin/users/${user.id}`, { role: newRole });
			mutate();
		} catch {
			// error
		} finally {
			setProcessing(false);
			setActionUser(null);
			setActionType(null);
		}
	};

	const openAction = (user: User, type: "suspend" | "reactivate" | "role") => {
		setActionUser(user);
		setActionType(type);
		setOpenMenu(null);
	};

	const confirmAction = () => {
		if (!actionUser || !actionType) return;
		if (actionType === "suspend") handleSuspend(actionUser);
		else if (actionType === "reactivate") handleReactivate(actionUser);
		else if (actionType === "role") handleRoleChange(actionUser);
	};

	return (
		<div>
			{/* Toolbar */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5'>
				<div className='relative flex-1 w-full sm:max-w-sm'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
					<input
						type='text'
						placeholder='Search users...'
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
					/>
				</div>

				{/* Filters */}
				<div className='flex gap-2'>
					<div className='relative'>
						<select
							value={roleFilter}
							onChange={(e) => {
								setRoleFilter(e.target.value);
								setPage(1);
							}}
							className='appearance-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-3 pr-8 py-2 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500'
						>
							<option value=''>All Roles</option>
							<option value='researcher'>Researcher</option>
							<option value='admin'>Admin</option>
						</select>
						<ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none' />
					</div>
					<div className='relative'>
						<select
							value={statusFilter}
							onChange={(e) => {
								setStatusFilter(e.target.value);
								setPage(1);
							}}
							className='appearance-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-3 pr-8 py-2 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-primary-500'
						>
							<option value=''>All Statuses</option>
							<option value='active'>Active</option>
							<option value='suspended'>Suspended</option>
						</select>
						<ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none' />
					</div>
				</div>
			</div>

			{/* Table */}
			<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'>
								<th className='text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
									User
								</th>
								<th className='text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
									Institution
								</th>
								<th className='text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
									Role
								</th>
								<th className='text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
									Status
								</th>
								<th className='text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
									Joined
								</th>
								<th className='text-right px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-slate-100 dark:divide-slate-700'>
							{isLoading &&
								Array.from({ length: 5 }).map((_, i) => (
									<tr key={i} className='animate-pulse'>
										<td className='px-4 py-3'>
											<div className='h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded' />
										</td>
										<td className='px-4 py-3'>
											<div className='h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded' />
										</td>
										<td className='px-4 py-3'>
											<div className='h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full' />
										</td>
										<td className='px-4 py-3'>
											<div className='h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full' />
										</td>
										<td className='px-4 py-3'>
											<div className='h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded' />
										</td>
										<td className='px-4 py-3'>
											<div className='h-4 w-8 bg-slate-200 dark:bg-slate-700 rounded ml-auto' />
										</td>
									</tr>
								))}

							{users &&
								users.map((user) => (
									<tr
										key={user.id}
										className='hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors'
									>
										{/* User info */}
										<td className='px-4 py-3'>
											<div>
												<p className='font-medium text-slate-900 dark:text-white text-sm'>
													{user.full_name}
												</p>
												<p className='text-xs text-slate-400 dark:text-slate-500'>
													{user.email}
												</p>
											</div>
										</td>

										{/* Institution */}
										<td className='px-4 py-3 text-xs text-slate-600 dark:text-slate-300'>
											{user.institution}
										</td>

										{/* Role badge */}
										<td className='px-4 py-3'>
											{user.role === "admin" ? (
												<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400'>
													<ShieldCheck className='h-3 w-3' />
													Admin
												</span>
											) : (
												<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'>
													<Shield className='h-3 w-3' />
													Researcher
												</span>
											)}
										</td>

										{/* Status badge */}
										<td className='px-4 py-3'>
											{user.is_active ? (
												<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'>
													<UserCheck className='h-3 w-3' />
													Active
												</span>
											) : (
												<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'>
													<UserX className='h-3 w-3' />
													Suspended
												</span>
											)}
										</td>

										{/* Joined date */}
										<td className='px-4 py-3 text-xs text-slate-500 dark:text-slate-400'>
											{formatDate(user.created_at)}
										</td>

										{/* Actions dropdown */}
										<td className='px-4 py-3 text-right'>
											<div className='relative inline-block'>
												<button
													type='button'
													onClick={() =>
														setOpenMenu(openMenu === user.id ? null : user.id)
													}
													className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors'
												>
													<MoreHorizontal className='h-4 w-4' />
												</button>

												{openMenu === user.id && (
													<>
														<div
															className='fixed inset-0 z-40'
															onClick={() => setOpenMenu(null)}
														/>
														<div className='absolute right-0 mt-1 w-44 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-50 py-1'>
															{/* Role toggle */}
															<button
																type='button'
																onClick={() => openAction(user, "role")}
																className='w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2'
															>
																<Shield className='h-3.5 w-3.5' />
																{user.role === "admin"
																	? "Demote to Researcher"
																	: "Promote to Admin"}
															</button>

															{/* Suspend / Reactivate */}
															{user.is_active ? (
																<button
																	type='button'
																	onClick={() => openAction(user, "suspend")}
																	className='w-full text-left px-3 py-2 text-xs text-danger-600 dark:text-danger-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2'
																>
																	<UserX className='h-3.5 w-3.5' />
																	Suspend Account
																</button>
															) : (
																<button
																	type='button'
																	onClick={() => openAction(user, "reactivate")}
																	className='w-full text-left px-3 py-2 text-xs text-success-600 dark:text-success-400 hover:bg-green-50 dark:hover:bg-green-500/10 flex items-center gap-2'
																>
																	<UserCheck className='h-3.5 w-3.5' />
																	Reactivate Account
																</button>
															)}
														</div>
													</>
												)}
											</div>
										</td>
									</tr>
								))}

							{/* Empty state */}
							{users && users.length === 0 && (
								<tr>
									<td
										colSpan={6}
										className='px-4 py-12 text-center text-sm text-slate-400 dark:text-slate-500'
									>
										{search || roleFilter || statusFilter
											? "No users match the current filters"
											: "No users found"}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{users && users.length >= perPage && (
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
							Page {page}
						</span>
						<Button
							variant='outline'
							disabled={users.length < perPage}
							onClick={() => setPage((p) => p + 1)}
							className='text-xs'
						>
							Next
						</Button>
					</div>
				)}
			</div>

			{/* Confirmation modal */}
			{actionUser && actionType && (
				<div className='fixed inset-0 z-50 flex items-center justify-center'>
					<div
						className='absolute inset-0 bg-black/50 backdrop-blur-sm'
						onClick={() => {
							setActionUser(null);
							setActionType(null);
						}}
					/>
					<div className='relative w-full max-w-sm mx-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl p-5'>
						<h3 className='text-base font-semibold text-slate-900 dark:text-white mb-2'>
							{actionType === "suspend" && "Suspend User"}
							{actionType === "reactivate" && "Reactivate User"}
							{actionType === "role" && "Change Role"}
						</h3>
						<p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
							{actionType === "suspend" && (
								<>
									Are you sure you want to suspend{" "}
									<span className='font-medium text-slate-700 dark:text-slate-200'>
										{actionUser.email}
									</span>
									? They will be unable to log in.
								</>
							)}
							{actionType === "reactivate" && (
								<>
									Reactivate{" "}
									<span className='font-medium text-slate-700 dark:text-slate-200'>
										{actionUser.email}
									</span>
									? They will regain access to the platform.
								</>
							)}
							{actionType === "role" && (
								<>
									Change{" "}
									<span className='font-medium text-slate-700 dark:text-slate-200'>
										{actionUser.email}
									</span>
									&apos;s role from{" "}
									<span className='font-medium'>{actionUser.role}</span> to{" "}
									<span className='font-medium'>
										{actionUser.role === "admin" ? "researcher" : "admin"}
									</span>
									?
								</>
							)}
						</p>
						<div className='flex justify-end gap-2'>
							<Button
								variant='outline'
								onClick={() => {
									setActionUser(null);
									setActionType(null);
								}}
							>
								Cancel
							</Button>
							<Button
								onClick={confirmAction}
								isLoading={processing}
								className={
									actionType === "suspend"
										? "bg-danger-600 hover:bg-danger-700 focus:ring-danger-500/40"
										: actionType === "reactivate"
											? "bg-success-600 hover:bg-success-700 focus:ring-success-500/40"
											: ""
								}
							>
								{actionType === "suspend" && "Suspend"}
								{actionType === "reactivate" && "Reactivate"}
								{actionType === "role" && "Change Role"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
