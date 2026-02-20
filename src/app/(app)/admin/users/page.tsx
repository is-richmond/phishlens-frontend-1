import { Users } from "lucide-react";

export default function AdminUsersPage() {
	return (
		<div>
			<div className='flex items-center gap-3 mb-6'>
				<Users className='w-7 h-7 text-primary-600' />
				<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
					User Management
				</h1>
			</div>
			<p className='text-slate-500 dark:text-slate-400'>
				Admin user management — coming in Sprint 3.8.
			</p>
		</div>
	);
}
