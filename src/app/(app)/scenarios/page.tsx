import { FileText } from "lucide-react";

export default function ScenariosPage() {
	return (
		<div>
			<div className='flex items-center gap-3 mb-6'>
				<FileText className='w-7 h-7 text-primary-600' />
				<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
					Scenarios
				</h1>
			</div>
			<p className='text-slate-500 dark:text-slate-400'>
				Scenario builder — coming in Sprint 3.4.
			</p>
		</div>
	);
}
