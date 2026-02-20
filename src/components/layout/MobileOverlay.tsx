"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface MobileOverlayProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

/**
 * Mobile overlay for sidebar on small screens.
 * Renders as a full-screen overlay with slide-in animation.
 */
export default function MobileOverlay({
	open,
	onClose,
	children,
}: MobileOverlayProps) {
	// Prevent body scroll when open
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	// Close on Escape
	useEffect(() => {
		function handler(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		if (open) document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className='fixed inset-0 z-50 lg:hidden'>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-slate-900/50 backdrop-blur-sm'
				onClick={onClose}
			/>
			{/* Sidebar content */}
			<div className='absolute left-0 top-0 h-full w-60 bg-white dark:bg-slate-800 shadow-xl'>
				<div className='absolute right-2 top-4'>
					<button
						onClick={onClose}
						className='p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
						aria-label='Close menu'
					>
						<X className='w-5 h-5' />
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}
