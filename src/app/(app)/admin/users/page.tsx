"use client";

import { Users } from "lucide-react";
import { UserApprovalSection } from "@/components/admin/UserApprovalSection";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

export default function AdminUsersPage() {
	return (
		<div>
			<div className='flex items-center gap-3 mb-6'>
				<Users className='w-7 h-7 text-primary-600' />
				<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
					User Management
				</h1>
			</div>
			<UserApprovalSection />
			<UserManagementTable />
		</div>
	);
}
