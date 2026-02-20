import { ScrollText } from "lucide-react";

export default function AuditLogsPage() {
	return (
		<div>
			<div className='flex items-center gap-3 mb-6'>
				<ScrollText className='w-7 h-7 text-primary-600' />
				<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
					Audit Logs
				</h1>
			</div>
			<p className='text-slate-500 dark:text-slate-400'>
				Admin audit log viewer — coming in Sprint 3.8.
			</p>
		</div>
	);
}
