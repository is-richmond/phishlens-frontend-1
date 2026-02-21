"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface MobileOverlayProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

/**
 * Mobile overlay for sidebar on small screens.
 * Uses a two-phase mount: `visible` keeps the DOM present while `animate`
 * drives the CSS transition so the backdrop fades and the panel slides in.
 */
export default function MobileOverlay({
	open,
	onClose,
	children,
}: MobileOverlayProps) {
	const [visible, setVisible] = useState(false);
	const [animate, setAnimate] = useState(false);

	// Opening: mount first, then trigger animation on next frame.
	// Closing: remove animation class, then unmount after transition ends.
	useEffect(() => {
		if (open) {
			setVisible(true);
			// requestAnimationFrame ensures the element is in the DOM before
			// the transition-triggering class is applied.
			requestAnimationFrame(() => {
				requestAnimationFrame(() => setAnimate(true));
			});
		} else {
			setAnimate(false);
			const timer = setTimeout(() => setVisible(false), 300); // match duration
			return () => clearTimeout(timer);
		}
	}, [open]);

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

	if (!visible) return null;

	return (
		<div className='fixed inset-0 z-50 lg:hidden'>
			{/* Backdrop */}
			<div
				className={cn(
					"absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ease-out",
					animate ? "opacity-100" : "opacity-0",
				)}
				onClick={onClose}
			/>
			{/* Sidebar content */}
			<div
				className={cn(
					"absolute left-0 top-0 h-full w-60 bg-white dark:bg-slate-800 shadow-xl transition-transform duration-300 ease-out",
					animate ? "translate-x-0" : "-translate-x-full",
				)}
			>
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
