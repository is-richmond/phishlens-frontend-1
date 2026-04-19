'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertCircle, Mail, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bulkGenerationApi } from '@/lib/bulk-generation';

interface DistributionModalProps {
  isOpen: boolean;
  bulkGenerationId: string;
  campaignTitle?: string;
  totalRecipients: number;
  onClose: () => void;
  onSuccess: (campaignId: string) => void;
}

export default function DistributionModal({
  isOpen,
  bulkGenerationId,
  campaignTitle = 'Bulk Campaign',
  totalRecipients,
  onClose,
  onSuccess,
}: DistributionModalProps) {
  const [campaignName, setCampaignName] = useState(`Distribution: ${campaignTitle}`);
  const [sendImmediately, setSendImmediately] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle escape key and backdrop close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDistribute = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await bulkGenerationApi.distribute(bulkGenerationId, {
        campaign_name: campaignName,
        send_immediately: sendImmediately,
      });

      onSuccess(response.campaign_id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create distributions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Create Campaign & Send"
        className="relative z-10 w-full max-w-[500px] max-h-[90vh] rounded-xl bg-white border border-slate-200 shadow-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Create Campaign & Send</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Convert {totalRecipients} generated messages into a distribution campaign
          </p>

          {/* Campaign Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Campaign Name</label>
            <Input
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g., Employee Phishing Awareness - Q2 2026"
              className="w-full"
              disabled={loading}
            />
            <p className="text-xs text-slate-600">Give your campaign a descriptive name</p>
          </div>

          {/* Send Immediately Checkbox */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="send-immediately"
                checked={sendImmediately}
                onChange={(e) => setSendImmediately(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="send-immediately" className="text-sm font-medium cursor-pointer text-slate-900">
                Send immediately
              </label>
            </div>
            <p className="text-xs text-slate-600 ml-7">
              {sendImmediately
                ? 'Emails will be sent right away (requires email provider configuration)'
                : 'Emails will be queued and ready for sending via the campaigns interface'}
            </p>
          </div>

          {/* Info Alert */}
          {sendImmediately && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Make sure SMTP or SendGrid is configured in your server settings to send emails.
              </p>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Summary */}
          <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 space-y-1">
            <p className="font-medium">Campaign Summary:</p>
            <ul className="space-y-0.5 text-xs text-slate-600">
              <li>• <strong>Recipients:</strong> {totalRecipients}</li>
              <li>• <strong>Status:</strong> {sendImmediately ? 'Sending in background' : 'Pending (ready to send)'}</li>
              <li>• <strong>Campaign:</strong> {campaignName || 'Unnamed'}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDistribute}
            disabled={loading || !campaignName.trim()}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Create Campaign
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

