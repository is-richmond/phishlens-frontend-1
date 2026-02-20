"use client";

import { useState, useEffect } from "react";
import {
	Users,
	Zap,
	FolderKanban,
	FileText,
	BarChart3,
	Database,
	CheckCircle2,
	XCircle,
	AlertTriangle,
	TrendingUp,
	Shield,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAdminStatistics } from "@/lib/hooks";
import { cn } from "@/lib/utils";
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
} from "recharts";

/* ────────────────────────────────────────────────────────────
   SystemHealthDashboard — Admin overview with stats & health
   ──────────────────────────────────────────────────────────── */

const PIE_COLORS = [
	"#3b82f6",
	"#8b5cf6",
	"#06b6d4",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#ec4899",
	"#6366f1",
];

/* ---- Stat Card ---- */
interface StatCardProps {
	label: string;
	value: number | string;
	icon: React.ReactNode;
	sub?: string;
	color?: string;
}

function StatCard({
	label,
	value,
	icon,
	sub,
	color = "text-primary-600",
}: StatCardProps) {
	return (
		<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4'>
			<div className='flex items-center justify-between mb-2'>
				<span className='text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
					{label}
				</span>
				<div className={cn("opacity-60", color)}>{icon}</div>
			</div>
			<p className='text-2xl font-bold text-slate-900 dark:text-white tabular-nums'>
				{value}
			</p>
			{sub && (
				<p className='text-[10px] text-slate-400 dark:text-slate-500 mt-0.5'>
					{sub}
				</p>
			)}
		</div>
	);
}

/* ---- Health indicator ---- */
function HealthBadge({ status }: { status: string }) {
	const isHealthy = status === "healthy" || status === "ok";
	return (
		<div
			className={cn(
				"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
				isHealthy
					? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
					: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400",
			)}
		>
			{isHealthy ? (
				<CheckCircle2 className='h-3.5 w-3.5' />
			) : (
				<XCircle className='h-3.5 w-3.5' />
			)}
			{isHealthy ? "Healthy" : "Unhealthy"}
		</div>
	);
}

/* ---- Main dashboard ---- */
export function SystemHealthDashboard() {
	const { data: stats, isLoading: statsLoading } = useAdminStatistics();
	const [health, setHealth] = useState<{
		status: string;
		database: string;
	} | null>(null);

	useEffect(() => {
		api
			.get<{ status: string; database: string }>("/v1/admin/health")
			.then(setHealth)
			.catch(() => setHealth({ status: "error", database: "unhealthy" }));
	}, []);

	/* Derive usage anomalies */
	const anomalies: { label: string; severity: "warning" | "danger" }[] = [];
	if (stats) {
		if (stats.users.suspended > stats.users.total * 0.2) {
			anomalies.push({
				label: `High suspension rate — ${stats.users.suspended} of ${stats.users.total} users suspended`,
				severity: "warning",
			});
		}
		if (
			stats.generations.average_score !== null &&
			stats.generations.average_score < 3
		) {
			anomalies.push({
				label: `Low average generation score: ${stats.generations.average_score}`,
				severity: "warning",
			});
		}
		if (stats.users.admins > stats.users.researchers && stats.users.total > 2) {
			anomalies.push({
				label: "More admin accounts than researchers — review roles",
				severity: "danger",
			});
		}
	}

	/* Prepare chart data */
	const scoreDistData = stats
		? Object.entries(stats.generations.score_distribution).map(
				([label, count]) => ({
					name: label.split("(")[0].trim(),
					count,
				}),
			)
		: [];

	const modelData = stats
		? Object.entries(stats.models).map(([name, count]) => ({
				name: name.replace("models/", ""),
				value: count,
			}))
		: [];

	const categoryData = stats
		? Object.entries(stats.categories).map(([name, count]) => ({
				name: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
				value: count,
			}))
		: [];

	if (statsLoading) {
		return (
			<div className='space-y-4 animate-pulse'>
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className='h-24 rounded-xl bg-slate-200 dark:bg-slate-700'
						/>
					))}
				</div>
				<div className='h-64 rounded-xl bg-slate-200 dark:bg-slate-700' />
			</div>
		);
	}

	if (!stats) return null;

	return (
		<div className='space-y-6'>
			{/* Health status */}
			<div className='flex items-center justify-between'>
				<h3 className='text-sm font-semibold text-slate-900 dark:text-white'>
					Platform Overview
				</h3>
				<div className='flex items-center gap-3'>
					{health && (
						<>
							<div className='flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400'>
								<Database className='h-3.5 w-3.5' />
								Database:
								<HealthBadge status={health.database} />
							</div>
							<HealthBadge status={health.status} />
						</>
					)}
				</div>
			</div>

			{/* Anomaly alerts */}
			{anomalies.length > 0 && (
				<div className='space-y-2'>
					{anomalies.map((a, i) => (
						<div
							key={i}
							className={cn(
								"flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium",
								a.severity === "danger"
									? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20"
									: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
							)}
						>
							<AlertTriangle className='h-3.5 w-3.5 shrink-0' />
							{a.label}
						</div>
					))}
				</div>
			)}

			{/* Stats grid */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
				<StatCard
					label='Total Users'
					value={stats.users.total}
					icon={<Users className='h-5 w-5' />}
					sub={`${stats.users.active} active · ${stats.users.suspended} suspended`}
				/>
				<StatCard
					label='Admins'
					value={stats.users.admins}
					icon={<Shield className='h-5 w-5' />}
					sub={`${stats.users.researchers} researchers`}
					color='text-purple-600'
				/>
				<StatCard
					label='Generations'
					value={stats.generations.total}
					icon={<Zap className='h-5 w-5' />}
					sub={`${stats.generations.scored} scored · ${stats.generations.unscored} unscored`}
					color='text-green-600'
				/>
				<StatCard
					label='Avg Score'
					value={stats.generations.average_score?.toFixed(1) ?? "—"}
					icon={<TrendingUp className='h-5 w-5' />}
					sub={
						stats.generations.min_score !== null
							? `Range: ${stats.generations.min_score.toFixed(1)} – ${stats.generations.max_score?.toFixed(1)}`
							: "No scores yet"
					}
					color='text-amber-600'
				/>
				<StatCard
					label='Scenarios'
					value={stats.scenarios.total}
					icon={<FileText className='h-5 w-5' />}
				/>
				<StatCard
					label='Campaigns'
					value={stats.campaigns.total}
					icon={<FolderKanban className='h-5 w-5' />}
				/>
				<StatCard
					label='Templates'
					value={stats.templates.total}
					icon={<BarChart3 className='h-5 w-5' />}
					sub={`${stats.templates.predefined} predefined · ${stats.templates.custom} custom`}
				/>
			</div>

			{/* Charts row */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
				{/* Score distribution */}
				{scoreDistData.length > 0 && (
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4'>
						<h4 className='text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3'>
							Score Distribution
						</h4>
						<ResponsiveContainer width='100%' height={180}>
							<BarChart data={scoreDistData}>
								<CartesianGrid
									strokeDasharray='3 3'
									stroke='currentColor'
									className='text-slate-200 dark:text-slate-700'
								/>
								<XAxis
									dataKey='name'
									tick={{ fontSize: 9 }}
									stroke='currentColor'
									className='text-slate-400'
								/>
								<YAxis
									allowDecimals={false}
									tick={{ fontSize: 9 }}
									stroke='currentColor'
									className='text-slate-400'
								/>
								<Tooltip
									contentStyle={{
										fontSize: 11,
										borderRadius: 8,
										border: "1px solid #e2e8f0",
									}}
								/>
								<Bar dataKey='count' fill='#3b82f6' radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}

				{/* Model distribution */}
				{modelData.length > 0 && (
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4'>
						<h4 className='text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3'>
							Model Usage
						</h4>
						<ResponsiveContainer width='100%' height={180}>
							<PieChart>
								<Pie
									data={modelData}
									cx='50%'
									cy='50%'
									innerRadius={40}
									outerRadius={70}
									dataKey='value'
									paddingAngle={2}
								>
									{modelData.map((_, i) => (
										<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										fontSize: 11,
										borderRadius: 8,
										border: "1px solid #e2e8f0",
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className='flex flex-wrap gap-x-3 gap-y-1 mt-2'>
							{modelData.map((m, i) => (
								<span
									key={m.name}
									className='inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400'
								>
									<span
										className='inline-block h-2 w-2 rounded-full'
										style={{
											backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
										}}
									/>
									{m.name}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Category distribution */}
				{categoryData.length > 0 && (
					<div className='rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4'>
						<h4 className='text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3'>
							Category Distribution
						</h4>
						<ResponsiveContainer width='100%' height={180}>
							<PieChart>
								<Pie
									data={categoryData}
									cx='50%'
									cy='50%'
									innerRadius={40}
									outerRadius={70}
									dataKey='value'
									paddingAngle={2}
								>
									{categoryData.map((_, i) => (
										<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										fontSize: 11,
										borderRadius: 8,
										border: "1px solid #e2e8f0",
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className='flex flex-wrap gap-x-3 gap-y-1 mt-2'>
							{categoryData.map((c, i) => (
								<span
									key={c.name}
									className='inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400'
								>
									<span
										className='inline-block h-2 w-2 rounded-full'
										style={{
											backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
										}}
									/>
									{c.name}
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
