"use client";

import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   ScoreGauge — Circular SVG gauge for realism score (1-10)
   Color coding: Red 1-3, Amber 4-6, Green 7-10
   ──────────────────────────────────────────────────────────── */

interface ScoreGaugeProps {
	score: number | null;
	/** Diameter in px (default 160) */
	size?: number;
	/** Stroke width (default 12) */
	strokeWidth?: number;
	/** Show label beneath score */
	label?: string;
}

function getScoreLevel(score: number | null): {
	label: string;
	ringColor: string;
	textColor: string;
	trailColor: string;
	bgGlow: string;
} {
	if (score === null) {
		return {
			label: "Not scored",
			ringColor: "stroke-slate-300 dark:stroke-slate-600",
			textColor: "text-slate-400 dark:text-slate-500",
			trailColor: "stroke-slate-200 dark:stroke-slate-700",
			bgGlow: "",
		};
	}
	if (score >= 7) {
		return {
			label: "High",
			ringColor: "stroke-success-500",
			textColor: "text-success-600 dark:text-success-400",
			trailColor: "stroke-success-100 dark:stroke-success-500/10",
			bgGlow: "shadow-success-500/10",
		};
	}
	if (score >= 4) {
		return {
			label: "Medium",
			ringColor: "stroke-warning-500",
			textColor: "text-warning-600 dark:text-warning-400",
			trailColor: "stroke-warning-100 dark:stroke-warning-500/10",
			bgGlow: "shadow-warning-500/10",
		};
	}
	return {
		label: "Low",
		ringColor: "stroke-danger-500",
		textColor: "text-danger-600 dark:text-danger-400",
		trailColor: "stroke-danger-100 dark:stroke-danger-500/10",
		bgGlow: "shadow-danger-500/10",
	};
}

export function ScoreGauge({
	score,
	size = 160,
	strokeWidth = 12,
	label,
}: ScoreGaugeProps) {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const percentage = score !== null ? score / 10 : 0;
	const offset = circumference - percentage * circumference;
	const level = getScoreLevel(score);

	return (
		<div className={cn("flex flex-col items-center gap-2", level.bgGlow)}>
			<div className='relative' style={{ width: size, height: size }}>
				<svg
					width={size}
					height={size}
					viewBox={`0 0 ${size} ${size}`}
					className='-rotate-90'
				>
					{/* Trail */}
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill='none'
						strokeWidth={strokeWidth}
						className={level.trailColor}
					/>
					{/* Score ring */}
					{score !== null && (
						<circle
							cx={size / 2}
							cy={size / 2}
							r={radius}
							fill='none'
							strokeWidth={strokeWidth}
							strokeDasharray={circumference}
							strokeDashoffset={offset}
							strokeLinecap='round'
							className={cn(
								level.ringColor,
								"transition-all duration-1000 ease-out",
							)}
						/>
					)}
				</svg>

				{/* Center text */}
				<div className='absolute inset-0 flex flex-col items-center justify-center'>
					{score !== null ? (
						<>
							<span
								className={cn(
									"text-3xl font-bold tabular-nums",
									level.textColor,
								)}
							>
								{score.toFixed(1)}
							</span>
							<span className='text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500'>
								out of 10
							</span>
						</>
					) : (
						<span className='text-sm font-medium text-slate-400 dark:text-slate-500'>
							N/A
						</span>
					)}
				</div>
			</div>

			{/* Labels */}
			<div className='text-center'>
				<span
					className={cn(
						"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
						score !== null
							? score >= 7
								? "bg-success-50 dark:bg-success-500/10 text-success-700 dark:text-success-400"
								: score >= 4
									? "bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400"
									: "bg-danger-50 dark:bg-danger-500/10 text-danger-700 dark:text-danger-400"
							: "bg-slate-100 dark:bg-slate-800 text-slate-500",
					)}
				>
					{level.label}
				</span>
				{label && (
					<p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
						{label}
					</p>
				)}
			</div>
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   ScoreGaugeSkeleton — loading placeholder
   ──────────────────────────────────────────────────────────── */

export function ScoreGaugeSkeleton({ size = 160 }: { size?: number }) {
	return (
		<div className='flex flex-col items-center gap-2 animate-pulse'>
			<div
				className='rounded-full bg-slate-200 dark:bg-slate-700'
				style={{ width: size, height: size }}
			/>
			<div className='h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700' />
		</div>
	);
}
