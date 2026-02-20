import { Zap } from "lucide-react";

export default function GeneratePage() {
	return (
		<div>
			<div className='flex items-center gap-3 mb-6'>
				<Zap className='w-7 h-7 text-primary-600' />
				<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
					Generate
				</h1>
			</div>
			<p className='text-slate-500 dark:text-slate-400'>
				Generation interface — coming in Sprint 3.6.
			</p>
		</div>
	);
}
