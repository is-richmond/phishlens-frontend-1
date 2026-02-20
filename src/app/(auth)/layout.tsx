"use client";

import Link from "next/link";
import { AuthProvider } from "@/components/providers/AuthProvider";

/**
 * Layout for authentication pages (login, register).
 * Centered card layout with no sidebar/header.
 * Wraps with AuthProvider so login/register pages can use useAuth().
 */
export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthProvider>
			<div className='flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4'>
				{/* Logo */}
				<Link href='/' className='mb-8 flex items-center gap-2'>
					<span className='text-3xl'>🔍</span>
					<span className='text-2xl font-bold text-slate-900 dark:text-white'>
						PhishLens
					</span>
				</Link>

				{/* Card container */}
				<div className='w-full max-w-md'>{children}</div>

				{/* Footer */}
				<p className='mt-8 text-center text-xs text-slate-400 dark:text-slate-500'>
					⚠️ SIMULATION TOOL — AUTHORIZED SECURITY RESEARCH ONLY
				</p>
			</div>
		</AuthProvider>
	);
}
