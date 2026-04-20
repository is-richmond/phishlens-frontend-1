'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { bulkGenerationApi } from '@/lib/bulk-generation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
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
  '[DELIVERY_SERVICE]',
  '[TRACKING_NUMBER]',
  '[PACKAGE_ID]',
  '[ORDER_NUMBER]',
  '[INVOICE_NUMBER]',
  '[DATE]',
  '[TIME]',
  '[VERIFICATION_LINK]',
  '[CONFIRMATION_CODE]',
  '[REFERENCE_NUMBER]',
  '[BANK_NAME]',
  '[ACCOUNT_NUMBER]',
];

export default function BulkGenerationFieldMapping({
  bulkGenerationId,
  onComplete,
  onBack,
}: BulkGenerationFieldMappingProps) {
  const { data: bulkGen, mutate } = useSWR<BulkGenerationDetail>(
    `/v1/bulk-generations/${bulkGenerationId}`,
    fetcher,
  );

  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(true);

  useEffect(() => {
    if (bulkGen) {
      // Initialize fieldMapping with all columns
      // Use provided field_mapping or create empty entries for all columns
      const mapping: FieldMapping = {};
      bulkGen.column_headers.forEach((_, idx) => {
        mapping[String(idx)] = bulkGen.field_mapping?.[String(idx)] || '';
      });
      setFieldMapping(mapping);
      
      console.log('BulkGen loaded:', {
        filename: bulkGen.original_filename,
        columns: bulkGen.column_headers,
        columnCount: bulkGen.column_headers.length,
        previewRowsCount: bulkGen.preview_rows.length,
        previewRows: bulkGen.preview_rows,
        fieldMapping: mapping,
        totalRows: bulkGen.total_rows,
      });
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
      {/* File Summary */}
      {bulkGen && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600">Filename</p>
                <p className="font-semibold text-slate-900">{bulkGen.original_filename}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Rows</p>
                <p className="font-semibold text-slate-900">{bulkGen.total_rows}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Columns</p>
                <p className="font-semibold text-slate-900">{bulkGen.column_headers.length}</p>
              </div>
            </div>
            {bulkGen.column_headers.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 mb-2">Column Headers</p>
                <div className="flex flex-wrap gap-2">
                  {bulkGen.column_headers.map((header, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white border border-blue-200 rounded text-sm text-slate-700"
                    >
                      {header || `Column ${idx + 1}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Column Mapping</h3>
          <p className="text-sm text-slate-600 mb-4">
            Map Excel columns to placeholder fields. Select the appropriate placeholder for each column.
          </p>

          {/* Mapping Table with Preview Data */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Column</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Sample Data</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Maps To</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(fieldMapping).map(([columnIndex, placeholder], idx) => {
                  const colIdx = parseInt(columnIndex);
                  const columnHeader = bulkGen.column_headers[colIdx] || `Column ${colIdx + 1}`;
                  const sampleData = bulkGen.preview_rows[0]?.[columnHeader] || '—';
                  
                  return (
                    <tr key={columnIndex} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} >
                      <td className="px-4 py-3 border-b border-slate-200">
                        <span className="font-medium text-slate-700">{columnHeader}</span>
                      </td>
                      <td className="px-4 py-3 border-b border-slate-200 text-slate-600 max-w-xs truncate">
                        {String(sampleData).substring(0, 100)}
                      </td>
                      <td className="px-4 py-3 border-b border-slate-200">
                        {editMode ? (
                          <select
                            value={placeholder}
                            onChange={(e) => handleMappingChange(columnIndex, e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">-- Select placeholder --</option>
                            {COMMON_PLACEHOLDERS.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-900 font-medium">
                            {placeholder || '(not mapped)'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Preview */}
        {bulkGen && bulkGen.column_headers.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Data Preview</h3>
            <p className="text-sm text-slate-600 mb-3">
              First {Math.min(3, bulkGen.preview_rows.length)} rows of your Excel file
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    {bulkGen.column_headers.map((header, idx) => (
                      <th
                        key={idx}
                        className="border border-slate-300 px-3 py-2 text-left font-semibold text-xs"
                      >
                        {header || `Column ${idx + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bulkGen.preview_rows.length > 0 ? (
                    bulkGen.preview_rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        {bulkGen.column_headers.map((header, colIdx) => (
                          <td
                            key={colIdx}
                            className="border border-slate-300 px-3 py-2 text-xs text-slate-700"
                          >
                            {String(row[header] || '—').substring(0, 50)}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={bulkGen.column_headers.length} className="border border-slate-300 px-3 py-2 text-slate-600 text-xs text-center">
                        No preview data available
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
