"use client";

import { cn } from "@/lib/utils";
import { formatCategory, getScoreColor } from "@/lib/utils";
import { useCampaignStatistics } from "@/lib/hooks";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";
import type { CampaignStatistics } from "@/types";

/* ────────────────────────────────────────────────────────────
   CampaignStats — Aggregate statistics with charts
   Uses recharts for bar and pie charts
   ──────────────────────────────────────────────────────────── */

interface CampaignStatsProps {
	campaignId: string;
}

const PIE_COLORS = [
	"#3b82f6",
	"#8b5cf6",
	"#06b6d4",
	"#f59e0b",
	"#10b981",
	"#ef4444",
	"#ec4899",
	"#6366f1",
];

const DIMENSION_LABELS: Record<string, string> = {
	linguistic_naturalness: "Linguistic",
	psychological_triggers: "Psychological",
	technical_plausibility: "Technical",
	contextual_relevance: "Contextual",
};

export function CampaignStats({ campaignId }: CampaignStatsProps) {
	const { data: stats, isLoading } = useCampaignStatistics(campaignId);

	if (isLoading) return <CampaignStatsSkeleton />;
	if (!stats) return null;

	// Prepare dimensional scores data for bar chart
	const dimensionalData = Object.entries(stats.dimensional_averages)
		.filter(([, v]) => v !== null)
		.map(([key, value]) => ({
			name: DIMENSION_LABELS[key] || key,
			score: value !== null ? Number(value.toFixed(1)) : 0,
		}));

	// Prepare model distribution for pie chart
	const modelData = Object.entries(stats.model_distribution).map(
		([name, value]) => ({ name, value }),
	);

	// Prepare category distribution for pie chart
	const categoryData = Object.entries(stats.category_distribution).map(
		([name, value]) => ({ name: formatCategory(name), value }),
	);

	return (
		<div className='space-y-5'>
			{/* Score summary cards */}
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
				<StatMiniCard
					label='Total'
					value={String(stats.total_generations)}
					sub={`${stats.scored_generations} scored`}
				/>
				<StatMiniCard
					label='Avg Score'
					value={stats.scores.average?.toFixed(1) ?? "—"}
					valueColor={getScoreColor(stats.scores.average)}
				/>
				<StatMiniCard
					label='Min Score'
					value={stats.scores.min?.toFixed(1) ?? "—"}
					valueColor={getScoreColor(stats.scores.min ?? null)}
				/>
				<StatMiniCard
					label='Max Score'
					value={stats.scores.max?.toFixed(1) ?? "—"}
					valueColor={getScoreColor(stats.scores.max ?? null)}
				/>
			</div>

			{/* Charts row */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
				{/* Dimensional averages bar chart */}
				{dimensionalData.length > 0 && (
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4'>
						<h4 className='text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3'>
							Dimensional Averages
						</h4>
						<ResponsiveContainer width='100%' height={200}>
							<BarChart data={dimensionalData} layout='vertical'>
								<CartesianGrid strokeDasharray='3 3' opacity={0.1} />
								<XAxis type='number' domain={[0, 10]} tick={{ fontSize: 10 }} />
								<YAxis
									type='category'
									dataKey='name'
									tick={{ fontSize: 10 }}
									width={80}
								/>
								<Tooltip
									contentStyle={{
										background: "var(--tooltip-bg, #1e293b)",
										border: "none",
										borderRadius: 8,
										fontSize: 12,
									}}
								/>
								<Bar dataKey='score' fill='#3b82f6' radius={[0, 4, 4, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}

				{/* Model distribution pie chart */}
				{modelData.length > 0 && (
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4'>
						<h4 className='text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3'>
							Model Distribution
						</h4>
						<ResponsiveContainer width='100%' height={200}>
							<PieChart>
								<Pie
									data={modelData}
									cx='50%'
									cy='50%'
									innerRadius={40}
									outerRadius={70}
									dataKey='value'
									label={({ name, percent }) =>
										`${name} (${(percent * 100).toFixed(0)}%)`
									}
									labelLine={false}
									fontSize={10}
								>
									{modelData.map((_, i) => (
										<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				)}

				{/* Category distribution pie chart */}
				{categoryData.length > 0 && (
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4'>
						<h4 className='text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3'>
							Category Distribution
						</h4>
						<ResponsiveContainer width='100%' height={200}>
							<PieChart>
								<Pie
									data={categoryData}
									cx='50%'
									cy='50%'
									innerRadius={40}
									outerRadius={70}
									dataKey='value'
									label={({ name, percent }) =>
										`${name} (${(percent * 100).toFixed(0)}%)`
									}
									labelLine={false}
									fontSize={10}
								>
									{categoryData.map((_, i) => (
										<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				)}
			</div>
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   StatMiniCard — small stat card
   ──────────────────────────────────────────────────────────── */

function StatMiniCard({
	label,
	value,
	sub,
	valueColor,
}: {
	label: string;
	value: string;
	sub?: string;
	valueColor?: string;
}) {
	return (
		<div className='rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3'>
			<p className='text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider'>
				{label}
			</p>
			<p
				className={cn(
					"text-xl font-bold tabular-nums mt-0.5",
					valueColor ?? "text-slate-900 dark:text-white",
				)}
			>
				{value}
			</p>
			{sub && (
				<p className='text-[10px] text-slate-400 dark:text-slate-500'>{sub}</p>
			)}
		</div>
	);
}

/* ────────────────────────────────────────────────────────────
   CampaignStatsSkeleton
   ──────────────────────────────────────────────────────────── */

function CampaignStatsSkeleton() {
	return (
		<div className='space-y-5 animate-pulse'>
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className='rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3'
					>
						<div className='h-2.5 w-12 bg-slate-200 dark:bg-slate-700 rounded mb-2' />
						<div className='h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded' />
					</div>
				))}
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 h-[240px]'
					/>
				))}
			</div>
		</div>
	);
}
