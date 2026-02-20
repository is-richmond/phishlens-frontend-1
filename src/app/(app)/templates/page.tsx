import { BookTemplate } from "lucide-react";

export default function TemplatesPage() {
	return (
		<div>
			<div className='flex items-center gap-3 mb-6'>
				<BookTemplate className='w-7 h-7 text-primary-600' />
				<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
					Templates
				</h1>
			</div>
			<p className='text-slate-500 dark:text-slate-400'>
				Template gallery — coming in Sprint 3.5.
			</p>
		</div>
	);
}
