import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
	return (
		<div>
			<div className='flex items-center gap-3 mb-6'>
				<LayoutDashboard className='w-7 h-7 text-primary-600' />
				<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
					Dashboard
				</h1>
			</div>
			<p className='text-slate-500 dark:text-slate-400'>
				Dashboard overview — coming in Sprint 3.3.
			</p>
		</div>
	);
}
