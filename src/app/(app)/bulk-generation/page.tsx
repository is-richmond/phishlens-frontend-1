'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BulkGenerationUpload from '@/components/generation/BulkGenerationUpload';
import BulkGenerationFieldMapping from '@/components/generation/BulkGenerationFieldMapping';
import BulkGenerationProcessing from '@/components/generation/BulkGenerationProcessing';
import BulkGenerationResults from '@/components/generation/BulkGenerationResults';
import { BulkGenerationProgress } from '@/components/generation/BulkGenerationProgress';

type Step = 'upload' | 'mapping' | 'processing' | 'results';

export default function BulkGenerationPage() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [bulkGenerationId, setBulkGenerationId] = useState<string | null>(null);

  const handleUploadComplete = (id: string) => {
    setBulkGenerationId(id);
    setCurrentStep('mapping');
  };

  const handleMappingComplete = () => {
    setCurrentStep('processing');
  };

  const handleProcessingComplete = () => {
    setCurrentStep('results');
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setBulkGenerationId(null);
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'upload':
        return 'Upload an Excel file with recipient data';
      case 'mapping':
        return 'Map Excel columns to placeholder fields';
      case 'processing':
        return 'Generating messages...';
      case 'results':
        return 'View and download generated results';
      default:
        return '';
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'upload':
        return 'Upload File';
      case 'mapping':
        return 'Map Fields';
      case 'processing':
        return 'Generate';
      case 'results':
        return 'Results';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bulk Generation</h1>
        <p className="mt-1 text-sm text-slate-600">
          Generate phishing messages for multiple recipients from an Excel file
        </p>
      </div>

      {/* Progress Indicator */}
      <div>
        <BulkGenerationProgress currentStep={currentStep} />
      </div>

      {/* Steps Content */}
      <Card>
        <CardHeader>
          <CardTitle>{getStepTitle()}</CardTitle>
          <CardDescription>{getStepDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 'upload' && (
            <BulkGenerationUpload onComplete={handleUploadComplete} />
          )}
          {currentStep === 'mapping' && bulkGenerationId && (
            <BulkGenerationFieldMapping
              bulkGenerationId={bulkGenerationId}
              onComplete={handleMappingComplete}
              onBack={() => setCurrentStep('upload')}
            />
          )}
          {currentStep === 'processing' && bulkGenerationId && (
            <BulkGenerationProcessing
              bulkGenerationId={bulkGenerationId}
              onComplete={handleProcessingComplete}
            />
          )}
          {currentStep === 'results' && bulkGenerationId && (
            <BulkGenerationResults
              bulkGenerationId={bulkGenerationId}
              onReset={handleReset}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
