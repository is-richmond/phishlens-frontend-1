import Link from "next/link";

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-8'>
			<div className='text-center max-w-2xl'>
				<h1 className='text-5xl font-bold text-slate-900 dark:text-white mb-4'>
					🔍 PhishLens
				</h1>
				<p className='text-xl text-slate-600 dark:text-slate-300 mb-8'>
					Phishing Message Generation Platform for Cybersecurity Research
				</p>
				<p className='text-sm text-slate-500 dark:text-slate-400 mb-12'>
					Generate realistic phishing simulations using Large Language Models.
					<br />
					For authorized security research and awareness training only.
				</p>
				<div className='flex gap-4 justify-center'>
					<Link
						href='/login'
						className='px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors'
					>
						Sign In
					</Link>
					<Link
						href='/register'
						className='px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
					>
						Register
					</Link>
				</div>
			</div>

			<footer className='absolute bottom-6 text-center text-xs text-slate-400 dark:text-slate-500'>
				⚠️ SIMULATION TOOL — AUTHORIZED SECURITY RESEARCH ONLY
			</footer>
		</main>
	);
}
