"use client";

import {
	LayoutDashboard,
	FileText,
	Zap,
	TrendingUp,
	CalendarDays,
} from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import {
	useScenarios,
	useDashboardGenerations,
	useAdminStatistics,
	useDashboardActivity,
} from "@/lib/hooks";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/StatCard";
import { RecentGenerations } from "@/components/dashboard/RecentGenerations";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

export default function DashboardPage() {
	const { user } = useAuth();
	const isAdmin = user?.role === "admin";

	// Data hooks
	const { data: scenariosData, isLoading: scenariosLoading } = useScenarios({
		per_page: 1,
	});
	const { data: generationsData, isLoading: generationsLoading } =
		useDashboardGenerations();
	const { data: statsData, isLoading: statsLoading } = useAdminStatistics({
		// Only fetch if admin
		...(isAdmin ? {} : { revalidateOnMount: false }),
	});
	const { data: activityData, isLoading: activityLoading } =
		useDashboardActivity({
			...(isAdmin ? {} : { revalidateOnMount: false }),
		});

	// Derive stats
	const totalScenarios =
		scenariosData?.total ?? statsData?.scenarios?.total ?? 0;
	const totalGenerations =
		generationsData?.total ?? statsData?.generations?.total ?? 0;
	const avgScore =
		statsData?.generations?.average_score ??
		(generationsData?.items && generationsData.items.length > 0
			? generationsData.items
					.filter((g) => g.overall_score !== null)
					.reduce((sum, g) => sum + (g.overall_score ?? 0), 0) /
				(generationsData.items.filter((g) => g.overall_score !== null).length ||
					1)
			: null);

	const isStatsLoading = scenariosLoading || generationsLoading || statsLoading;

	return (
		<div>
			{/* Page header */}
			<div className='flex items-center gap-3 mb-6'>
				<LayoutDashboard className='w-7 h-7 text-primary-600' />
				<div>
					<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
						Dashboard
					</h1>
					<p className='text-sm text-slate-500 dark:text-slate-400'>
						Welcome back, {user?.full_name?.split(" ")[0] ?? "Researcher"}
					</p>
				</div>
			</div>

			{/* Summary cards */}
			<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8'>
				{isStatsLoading ? (
					<>
						<StatCardSkeleton />
						<StatCardSkeleton />
						<StatCardSkeleton />
						<StatCardSkeleton />
					</>
				) : (
					<>
						<StatCard
							title='Total Scenarios'
							value={totalScenarios}
							subtitle='Active configurations'
							icon={<FileText className='w-5 h-5' />}
							color='primary'
						/>
						<StatCard
							title='Total Generations'
							value={totalGenerations}
							subtitle='Phishing simulations'
							icon={<Zap className='w-5 h-5' />}
							color='warning'
						/>
						<StatCard
							title='Avg. Realism Score'
							value={avgScore !== null ? avgScore.toFixed(1) : "—"}
							subtitle='Across all generations'
							icon={<TrendingUp className='w-5 h-5' />}
							color={
								avgScore !== null && avgScore >= 7
									? "success"
									: avgScore !== null && avgScore >= 4
										? "warning"
										: "danger"
							}
						/>
						<StatCard
							title='This Week'
							value={
								generationsData?.items
									? generationsData.items.filter((g) => {
											const weekAgo = new Date();
											weekAgo.setDate(weekAgo.getDate() - 7);
											return new Date(g.created_at) > weekAgo;
										}).length
									: 0
							}
							subtitle='Generations in last 7 days'
							icon={<CalendarDays className='w-5 h-5' />}
							color='success'
						/>
					</>
				)}
			</div>

			{/* Two-column layout: Recent generations + Quick actions / Activity */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Left column — Recent Generations (2/3 width) */}
				<div className='lg:col-span-2'>
					<RecentGenerations
						generations={generationsData?.items ?? []}
						isLoading={generationsLoading}
					/>
				</div>

				{/* Right column — Quick Actions + Activity Feed (1/3 width) */}
				<div className='space-y-6'>
					<QuickActions />
					{isAdmin && (
						<ActivityFeed
							logs={activityData?.items ?? []}
							isLoading={activityLoading}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
