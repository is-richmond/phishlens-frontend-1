'use client';

import { useEffect, useState } from 'react';
import { bulkGenerationApi } from '@/lib/bulk-generation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { BulkGenerationProgressResponse } from '@/types/bulk-generation';

interface BulkGenerationProcessingProps {
  bulkGenerationId: string;
  onComplete: () => void;
}

export default function BulkGenerationProcessing({
  bulkGenerationId,
  onComplete,
}: BulkGenerationProcessingProps) {
  const [progress, setProgress] = useState<BulkGenerationProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generationStarted, setGenerationStarted] = useState(false);

  // Start generation on mount
  useEffect(() => {
    const startGeneration = async () => {
      try {
        await bulkGenerationApi.startGeneration(bulkGenerationId);
        setGenerationStarted(true);
      } catch (err: any) {
        setError(err.message || 'Failed to start generation');
        setLoading(false);
      }
    };

    startGeneration();
  }, [bulkGenerationId]);

  // Poll progress
  useEffect(() => {
    if (!generationStarted) return;

    const pollProgress = async () => {
      try {
        const data = await bulkGenerationApi.getProgress(bulkGenerationId);
        setProgress(data);
        setLoading(false);

        // Stop polling if completed or failed
        if (data.status === 'completed' || data.status === 'failed') {
          return false; // Stop polling
        }
        return true; // Continue polling
      } catch (err: any) {
        setError(err.message || 'Failed to fetch progress');
        return false;
      }
    };

    // Initial poll
    pollProgress();

    // Set up interval for polling
    const interval = setInterval(async () => {
      const shouldContinue = await pollProgress();
      if (!shouldContinue) {
        clearInterval(interval);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [generationStarted, bulkGenerationId]);

  // Auto-advance when done
  useEffect(() => {
    if (progress?.status === 'completed') {
      setTimeout(() => onComplete(), 1000);
    }
  }, [progress?.status, onComplete]);

  if (loading || !progress) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          </div>
          <p className="text-slate-600">Initializing bulk generation...</p>
        </div>
      </div>
    );
  }

  const progressPercent = progress.progress_percent || 0;
  const isComplete = progress.status === 'completed';
  const isFailed = progress.status === 'failed';

  return (
    <div className="space-y-6">
      {/* Status Indicator */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            {isComplete && <CheckCircle className="w-5 h-5 text-green-600" />}
            {isFailed && <AlertTriangle className="w-5 h-5 text-red-600" />}
            {!isComplete && !isFailed && (
              <div className="animate-spin">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full" />
              </div>
            )}
            <span className="font-semibold text-slate-900 capitalize">
              {progress.status === 'processing' ? 'Generating...' : progress.status}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900">{progress.generated_count}</p>
              <p className="text-xs text-slate-600">Generated</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{progress.failed_count}</p>
              <p className="text-xs text-slate-600">Failed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{progress.total_rows}</p>
              <p className="text-xs text-slate-600">Total</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-700">Progress</span>
              <span className="text-slate-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isComplete ? 'bg-green-600' : isFailed ? 'bg-red-600' : 'bg-blue-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Messages */}
          {!isComplete && !isFailed && (
            <p className="text-sm text-slate-600 text-center">
              Please wait while your messages are being generated...
            </p>
          )}

          {isComplete && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Generation complete! Proceeding to results...
              </AlertDescription>
            </Alert>
          )}

          {isFailed && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Generation failed. Please check your configuration and try again.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Back Button (disabled during processing) */}
      {(isComplete || isFailed) && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={!isFailed} // Only enable if failed
        >
          {isComplete ? 'Proceeding to results...' : 'Back'}
        </Button>
      )}
    </div>
  );
}
