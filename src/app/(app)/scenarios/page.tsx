"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import { ScenarioWizard } from "@/components/scenarios/ScenarioWizard";
import { ScenarioList } from "@/components/scenarios/ScenarioList";
import type { Scenario } from "@/types";

type ViewMode = "list" | "create" | "edit";

export default function ScenariosPage() {
	const searchParams = useSearchParams();
	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const [editTarget, setEditTarget] = useState<Scenario | null>(null);

	// Support ?new=1 query parameter to open wizard immediately
	useEffect(() => {
		if (searchParams.get("new") === "1") {
			setViewMode("create");
		}
	}, [searchParams]);

	function handleCreateNew() {
		setEditTarget(null);
		setViewMode("create");
	}

	function handleEdit(scenario: Scenario) {
		setEditTarget(scenario);
		setViewMode("edit");
	}

	function handleCloseWizard() {
		setEditTarget(null);
		setViewMode("list");
	}

	return (
		<div>
			{/* Page header — only shown in list mode */}
			{viewMode === "list" && (
				<div className='flex items-center gap-3 mb-6'>
					<FileText className='w-7 h-7 text-primary-600' />
					<div>
						<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
							Scenarios
						</h1>
						<p className='text-sm text-slate-500 dark:text-slate-400'>
							Configure phishing scenarios for message generation.
						</p>
					</div>
				</div>
			)}

			{/* Content */}
			{viewMode === "list" ? (
				<ScenarioList onCreateNew={handleCreateNew} onEdit={handleEdit} />
			) : (
				<ScenarioWizard
					editScenario={
						viewMode === "edit" ? (editTarget ?? undefined) : undefined
					}
					onClose={handleCloseWizard}
				/>
			)}
		</div>
	);
}
