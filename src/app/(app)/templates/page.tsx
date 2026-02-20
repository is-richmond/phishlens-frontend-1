"use client";

import { BookTemplate } from "lucide-react";
import { TemplateGallery } from "@/components/templates/TemplateGallery";

export default function TemplatesPage() {
	return (
		<div>
			<div className='flex items-center gap-3 mb-6'>
				<BookTemplate className='w-7 h-7 text-primary-600' />
				<div>
					<h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
						Templates
					</h1>
					<p className='text-sm text-slate-500 dark:text-slate-400'>
						Browse, preview, and manage prompt templates for message generation.
					</p>
				</div>
			</div>

			<TemplateGallery />
		</div>
	);
}
