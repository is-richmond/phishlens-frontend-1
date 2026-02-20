import Link from "next/link";

/**
 * Registration page placeholder — full implementation in Sprint 3.2.
 */
export default function RegisterPage() {
	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm'>
			<h1 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
				Create Account
			</h1>
			<p className='text-sm text-slate-500 dark:text-slate-400 mb-6'>
				Register for a research account to access the platform.
			</p>

			{/* Placeholder form — will be replaced in Sprint 3.2 */}
			<div className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
						Full Name
					</label>
					<input
						type='text'
						placeholder='Jane Researcher'
						className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
						Email
					</label>
					<input
						type='email'
						placeholder='you@university.edu'
						className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
						Institution
					</label>
					<input
						type='text'
						placeholder='University / Organization'
						className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
						Password
					</label>
					<input
						type='password'
						placeholder='••••••••'
						className='w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors'
					/>
				</div>
				<button
					type='button'
					className='w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors'
				>
					Create Account
				</button>
			</div>

			<p className='mt-6 text-center text-sm text-slate-500 dark:text-slate-400'>
				Already have an account?{" "}
				<Link
					href='/login'
					className='font-medium text-primary-600 hover:text-primary-500'
				>
					Sign In
				</Link>
			</p>
		</div>
	);
}
