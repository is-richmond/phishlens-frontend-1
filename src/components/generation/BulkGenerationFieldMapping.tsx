'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { bulkGenerationApi } from '@/lib/bulk-generation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { BulkGenerationDetail, FieldMapping } from '@/types/bulk-generation';

function fetcher<T>(path: string): Promise<T> {
  return api.get<T>(path);
}

interface BulkGenerationFieldMappingProps {
  bulkGenerationId: string;
  onComplete: () => void;
  onBack: () => void;
}

const COMMON_PLACEHOLDERS = [
  '[TARGET_NAME]',
  '[TARGET_EMAIL]',
  '[TARGET_DEPARTMENT]',
  '[COMPANY_NAME]',
  '[PHONE_NUMBER]',
  '[SENDER_NAME]',
  '[SENDER_EMAIL]',
  '[SENDER_TITLE]',
];

export default function BulkGenerationFieldMapping({
  bulkGenerationId,
  onComplete,
  onBack,
}: BulkGenerationFieldMappingProps) {
  const { data: bulkGen, mutate } = useSWR<BulkGenerationDetail>(
    `/bulk-generations/${bulkGenerationId}`,
    fetcher,
  );

  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(true);

  useEffect(() => {
    if (bulkGen) {
      setFieldMapping(bulkGen.field_mapping || {});
    }
  }, [bulkGen]);

  const handleMappingChange = (columnIndex: string, placeholder: string) => {
    setFieldMapping((prev) => ({
      ...prev,
      [columnIndex]: placeholder,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await bulkGenerationApi.updateFieldMapping(bulkGenerationId, fieldMapping);
      await mutate();
      setEditMode(false);
      // Wait a moment before proceeding
      setTimeout(() => onComplete(), 500);
    } catch (err: any) {
      setError(err.message || 'Failed to update mapping');
    } finally {
      setLoading(false);
    }
  };

  if (!bulkGen) {
    return <div className="text-center py-8 text-slate-600">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Column Mapping</h3>
          <p className="text-sm text-slate-600 mb-4">
            Map Excel columns to placeholder fields. Select the appropriate placeholder for each column.
          </p>

          {/* Preview Table */}
          <div className="space-y-3">
            {Object.entries(fieldMapping).map(([columnIndex, placeholder]) => (
              <div key={columnIndex} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700 min-w-[100px]">
                  Column {parseInt(columnIndex) + 1}
                </span>

                <ArrowRight className="w-4 h-4 text-slate-400" />

                {editMode ? (
                  <select
                    value={placeholder}
                    onChange={(e) => handleMappingChange(columnIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select placeholder --</option>
                    {COMMON_PLACEHOLDERS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="flex-1 px-3 py-2 text-sm text-slate-900 font-medium">
                    {placeholder || '(not mapped)'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Preview */}
        {bulkGen && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Data Preview</h3>
            <p className="text-sm text-slate-600 mb-3">
              First row of your Excel file
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-3 py-2 text-left font-semibold">
                      Column
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left font-semibold">
                      Sample Data
                    </th>
                    <th className="border border-slate-300 px-3 py-2 text-left font-semibold">
                      Maps To
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* This would show preview data from the first row */}
                  {Object.keys(fieldMapping).length > 0 && (
                    <tr>
                      <td colSpan={3} className="border border-slate-300 px-3 py-2 text-slate-600 text-xs">
                        Preview data would display here (implement if needed)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Info Alert */}
      {editMode && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            After mapping, your messages will be generated with these placeholders replaced by the actual data from each row.
          </AlertDescription>
        </Alert>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="flex-1"
        >
          Back
        </Button>
        {editMode ? (
          <Button
            type="submit"
            disabled={loading || Object.keys(fieldMapping).length === 0}
            className="flex-1"
          >
            {loading ? 'Saving...' : 'Next: Generate Messages'}
          </Button>
        ) : (
          <Button type="button" disabled className="flex-1">
            Mapping Complete ✓
          </Button>
        )}
      </div>
    </form>
  );
}
