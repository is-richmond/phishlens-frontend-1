'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { bulkGenerationApi } from '@/lib/bulk-generation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Download, ChevronLeft, ChevronRight, CheckCircle, XCircle, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DistributionModal from './DistributionModal';
import type { BulkGenerationResultsResponse } from '@/types/bulk-generation';

function fetcher<T>(path: string): Promise<T> {
  return api.get<T>(path);
}

interface BulkGenerationResultsProps {
  bulkGenerationId: string;
  onReset: () => void;
}

export default function BulkGenerationResults({
  bulkGenerationId,
  onReset,
}: BulkGenerationResultsProps) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [distributionModalOpen, setDistributionModalOpen] = useState(false);
  const [distributionSuccess, setDistributionSuccess] = useState(false);

  const { data: results, isLoading } = useSWR<BulkGenerationResultsResponse>(
    `/v1/bulk-generations/${bulkGenerationId}/results?page=${page}&per_page=${perPage}`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const handleExport = async () => {
    setExporting(true);
    setExportError('');

    try {
      await bulkGenerationApi.exportResults(bulkGenerationId);
    } catch (err: any) {
      setExportError(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleDistributionSuccess = (campaignId: string) => {
    setDistributionSuccess(true);
    setDistributionModalOpen(false);
    // Redirect to campaign view could go here
    setTimeout(() => {
      window.location.href = `/campaigns/${campaignId}`;
    }, 1500);
  };

  const filteredResults = results?.results.filter(
    (r) =>
      searchText === '' ||
      JSON.stringify(r.input_data).toLowerCase().includes(searchText.toLowerCase()) ||
      r.generated_message?.toLowerCase().includes(searchText.toLowerCase()),
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-slate-900">
            Results: {results?.pagination.total || 0} total
          </h3>
          <p className="text-sm text-slate-600">
            {results?.results.filter((r) => r.status === 'generated').length || 0} generated, {results?.results.filter((r) => r.status === 'failed').length || 0} failed
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={exporting || !results}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Export as Excel'}
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search in results..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      {/* Error */}
      {exportError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{exportError}</AlertDescription>
        </Alert>
      )}

      {/* Results Table */}
      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading results...</div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 w-12">#</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Input Data</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Generated Message</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Error</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-600">
                    No results found
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => (
                  <tr
                    key={result.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 text-slate-600">{result.row_index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {result.status === 'generated' && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        {result.status === 'failed' && (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="capitalize font-medium text-slate-700">
                          {result.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <pre className="text-xs bg-slate-50 p-2 rounded max-w-xs overflow-auto">
                        {JSON.stringify(result.input_data, null, 2)}
                      </pre>
                    </td>
                    <td className="px-4 py-3">
                      {result.generated_message ? (
                        <div className="max-w-sm">
                          <p className="text-xs text-slate-600 line-clamp-3">
                            {result.generated_message}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs mt-1 h-6 px-2 py-0"
                            onClick={() => {
                              const modal = document.createElement('div');
                              modal.innerHTML = `
                                <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                                  <div class="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-auto">
                                    <p class="whitespace-pre-wrap text-sm">${result.generated_message}</p>
                                    <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                                      onclick="this.parentElement.parentElement.remove()">Close</button>
                                  </div>
                                </div>
                              `;
                              document.body.appendChild(modal);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {result.error_message ? (
                        <p className="text-xs text-red-600 max-w-xs">{result.error_message}</p>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {results && results.pagination.total > perPage && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-slate-600">
            Page {page} of {Math.ceil(results.pagination.total / perPage)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(results.pagination.total / perPage)}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button
          variant="outline"
          onClick={onReset}
          className="flex-1"
        >
          New Campaign
        </Button>
        <Button
          onClick={() => window.print()}
          variant="outline"
          className="flex-1"
        >
          Print Results
        </Button>
        <Button
          onClick={() => setDistributionModalOpen(true)}
          className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
          disabled={!results || results.results.filter((r) => r.status === 'generated').length === 0}
        >
          <Send className="w-4 h-4" />
          Create Campaign & Send
        </Button>
      </div>

      {/* Success Alert */}
      {distributionSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Campaign created successfully! Redirecting to campaign view...
          </AlertDescription>
        </Alert>
      )}

      {/* Distribution Modal */}
      <DistributionModal
        isOpen={distributionModalOpen}
        bulkGenerationId={bulkGenerationId}
        campaignTitle={results?.results[0]?.input_data?.campaign || 'Bulk Campaign'}
        totalRecipients={results?.results.filter((r) => r.status === 'generated').length || 0}
        onClose={() => setDistributionModalOpen(false)}
        onSuccess={handleDistributionSuccess}
      />
    </div>
  );
}
