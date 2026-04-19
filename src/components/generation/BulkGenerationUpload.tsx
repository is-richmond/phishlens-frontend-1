'use client';

import { useState } from 'react';
import { bulkGenerationApi } from '@/lib/bulk-generation';
import { useScenarios, useTemplates } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Scenario, Template } from '@/types';

interface BulkGenerationUploadProps {
  onComplete: (bulkGenerationId: string) => void;
}

export default function BulkGenerationUpload({
  onComplete,
}: BulkGenerationUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Fetch scenarios and templates (with authentication)
  const { data: scenariosData } = useScenarios({ per_page: 100 });
  const { data: templatesData } = useTemplates({ per_page: 100 });

  const scenarios = scenariosData?.items || [];
  const templates = templatesData?.items || [];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const droppedFile = files[0];
      if (droppedFile.name.endsWith('.xlsx')) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Please upload an .xlsx file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      if (selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload an .xlsx file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a campaign title');
      return;
    }

    if (!selectedScenario) {
      setError('Please select a scenario');
      return;
    }

    setLoading(true);

    try {
      const response = await bulkGenerationApi.uploadFile(
        file,
        title,
        selectedScenario,
        selectedTemplate || undefined,
        description || undefined,
      );

      onComplete(response.bulk_generation_id);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campaign Details */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Campaign Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Q1 2026 Security Training Phishing"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Optional description of the campaign"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="scenario">Scenario *</Label>
            <select
              id="scenario"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              required
            >
              <option value="">Select a scenario</option>
              {scenarios?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="template">Template (Optional)</Label>
            <select
              id="template"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Use default template</option>
              {templates?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Excel File (.xlsx) *</Label>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer block">
            <Upload className="mx-auto w-8 h-8 text-slate-400 mb-2" />
            <p className="font-medium text-slate-900">Drag & drop your Excel file</p>
            <p className="text-sm text-slate-600">or click to browse</p>
            {file && <p className="mt-2 text-sm text-green-600">Selected: {file.name}</p>}
          </label>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading || !file || !title || !selectedScenario}
        className="w-full"
      >
        {loading ? 'Uploading...' : 'Next: Map Fields'}
      </Button>
    </form>
  );
}
