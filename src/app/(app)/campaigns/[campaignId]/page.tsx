"use client";

import { useParams } from "next/navigation";
import { CampaignDetailView } from "@/components/campaigns/CampaignDetailView";

export default function CampaignDetailPage() {
	const params = useParams();
	const campaignId = params.campaignId as string;

	return (
		<CampaignDetailView
			campaignId={campaignId}
			onBack={() => window.history.back()}
		/>
	);
}
