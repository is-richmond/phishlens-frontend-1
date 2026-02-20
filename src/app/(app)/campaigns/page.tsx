"use client";

import { useState } from "react";
import { FolderKanban } from "lucide-react";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { CampaignDetailView } from "@/components/campaigns/CampaignDetailView";
import type { Campaign } from "@/types";

export default function CampaignsPage() {
	const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
		null,
	);

	if (selectedCampaign) {
		return (
			<CampaignDetailView
				campaignId={selectedCampaign.id}
				onBack={() => setSelectedCampaign(null)}
			/>
		);
	}

	return (
		<div>
			<div className='flex items-center gap-3 mb-6'>
				<FolderKanban className='w-7 h-7 text-primary-600' />
				<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
					Campaigns
				</h1>
			</div>
			<CampaignList onViewCampaign={setSelectedCampaign} />
		</div>
	);
}
