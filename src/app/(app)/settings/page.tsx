"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import {
	SettingsTabs,
	ProfileForm,
	ChangePasswordForm,
	AppearanceSettings,
	type SettingsTab,
} from "@/components/settings";

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

	return (
		<div>
			{/* Page header */}
			<div className='flex items-center gap-3 mb-6'>
				<Settings className='w-7 h-7 text-primary-600' />
				<div>
					<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
						Settings
					</h1>
					<p className='text-sm text-slate-500 dark:text-slate-400'>
						Manage your account and preferences
					</p>
				</div>
			</div>

			<div className='flex flex-col md:flex-row gap-6'>
				<SettingsTabs activeTab={activeTab} onChange={setActiveTab} />

				<div className='flex-1 max-w-2xl'>
					{activeTab === "profile" && (
						<div className='space-y-6'>
							<ProfileForm />
							<ChangePasswordForm />
						</div>
					)}

					{activeTab === "appearance" && <AppearanceSettings />}
				</div>
			</div>
		</div>
	);
}
