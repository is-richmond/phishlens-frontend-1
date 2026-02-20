"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/FormElements";

/**
 * Terms of Use modal dialog shown during registration.
 * Contains the research platform usage agreement.
 */
export function TermsModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const dialogRef = useRef<HTMLDivElement>(null);

	// Trap focus & close on Escape
	useEffect(() => {
		if (!open) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-black/50 backdrop-blur-sm'
				onClick={onClose}
			/>

			{/* Dialog */}
			<div
				ref={dialogRef}
				role='dialog'
				aria-modal='true'
				aria-label='Terms of Use'
				className='relative z-10 w-full max-w-2xl max-h-[80vh] rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col'
			>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700'>
					<h2 className='text-lg font-bold text-slate-900 dark:text-white'>
						Terms of Use — PhishLens Research Platform
					</h2>
					<button
						onClick={onClose}
						className='rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
						aria-label='Close'
					>
						<X className='w-5 h-5' />
					</button>
				</div>

				{/* Scrollable content */}
				<div className='flex-1 overflow-y-auto p-6 text-sm text-slate-600 dark:text-slate-300 space-y-4 scrollbar-thin'>
					<p className='font-semibold text-slate-900 dark:text-white'>
						By creating an account and using PhishLens, you agree to the
						following terms:
					</p>

					<section>
						<h3 className='font-semibold text-slate-800 dark:text-slate-200 mb-1'>
							1. Purpose & Scope
						</h3>
						<p>
							PhishLens is a cybersecurity research and awareness training
							platform. All generated phishing simulations are intended
							exclusively for authorized security research, academic study, and
							organizational security awareness training programs.
						</p>
					</section>

					<section>
						<h3 className='font-semibold text-slate-800 dark:text-slate-200 mb-1'>
							2. Authorized Use Only
						</h3>
						<p>
							You agree to use generated content only for legitimate
							cybersecurity research purposes. Any use of generated content for
							actual phishing attacks, fraud, social engineering against
							non-consenting parties, or any illegal activity is strictly
							prohibited and may result in immediate account termination and
							referral to law enforcement.
						</p>
					</section>

					<section>
						<h3 className='font-semibold text-slate-800 dark:text-slate-200 mb-1'>
							3. Institutional Affiliation
						</h3>
						<p>
							You confirm that you are affiliated with a recognized academic
							institution, research organization, or corporate security team.
							You agree to provide accurate institutional information during
							registration.
						</p>
					</section>

					<section>
						<h3 className='font-semibold text-slate-800 dark:text-slate-200 mb-1'>
							4. Data Handling & Privacy
						</h3>
						<p>
							All generated content is watermarked with &ldquo;[SIMULATION —
							AUTHORIZED SECURITY RESEARCH ONLY]&rdquo; and tagged with unique
							identifiers traceable to your account. Generated content is
							retained for a maximum of 12 months. Personal data is processed in
							accordance with applicable data protection regulations, including
							the Law of the Republic of Kazakhstan No. 94-V &ldquo;On Personal
							Data and Their Protection&rdquo;.
						</p>
					</section>

					<section>
						<h3 className='font-semibold text-slate-800 dark:text-slate-200 mb-1'>
							5. Audit & Monitoring
						</h3>
						<p>
							All platform activities are logged for security and compliance
							purposes. Anomalous usage patterns (exceeding 2 standard
							deviations above mean activity) may trigger automated alerts and
							manual review by administrators.
						</p>
					</section>

					<section>
						<h3 className='font-semibold text-slate-800 dark:text-slate-200 mb-1'>
							6. Content Restrictions
						</h3>
						<p>
							Generated content uses placeholder data only ([TARGET_NAME],
							[COMPANY_EMAIL], etc.) and non-functional URLs
							(example-phishing-domain.test). No real personal information or
							functional malicious URLs will be generated.
						</p>
					</section>

					<section>
						<h3 className='font-semibold text-slate-800 dark:text-slate-200 mb-1'>
							7. Account Termination
						</h3>
						<p>
							The platform administrators reserve the right to suspend or
							terminate accounts that violate these terms. Inactive accounts may
							be archived after 6 months of inactivity.
						</p>
					</section>

					<section>
						<h3 className='font-semibold text-slate-800 dark:text-slate-200 mb-1'>
							8. Limitation of Liability
						</h3>
						<p>
							PhishLens and its developers are not responsible for any misuse of
							generated content. Users assume full responsibility for ensuring
							their use complies with applicable laws and institutional
							policies.
						</p>
					</section>
				</div>

				{/* Footer */}
				<div className='p-6 border-t border-slate-200 dark:border-slate-700'>
					<Button onClick={onClose} className='w-full'>
						I Understand
					</Button>
				</div>
			</div>
		</div>
	);
}
