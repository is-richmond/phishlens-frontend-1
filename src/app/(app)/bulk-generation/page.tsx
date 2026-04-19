'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BulkGenerationUpload from '@/components/generation/BulkGenerationUpload';
import BulkGenerationFieldMapping from '@/components/generation/BulkGenerationFieldMapping';
import BulkGenerationProcessing from '@/components/generation/BulkGenerationProcessing';
import BulkGenerationResults from '@/components/generation/BulkGenerationResults';

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

  const steps = [
    { id: 'upload', label: 'Upload File', icon: '📤' },
    { id: 'mapping', label: 'Map Fields', icon: '🔗' },
    { id: 'processing', label: 'Generate', icon: '⚙️' },
    { id: 'results', label: 'Results', icon: '✅' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              {/* Step Indicator */}
              <div className="relative flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition ${
                    index <= currentStepIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-full top-1/2 h-1 w-12 -translate-y-1/2 transition ${
                      index < currentStepIndex ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
              <p className="mt-2 text-xs font-medium text-slate-700">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStepIndex].label}</CardTitle>
          <CardDescription>
            {currentStep === 'upload' && 'Upload an Excel file with recipient data'}
            {currentStep === 'mapping' && 'Map Excel columns to placeholder fields'}
            {currentStep === 'processing' && 'Generating messages...'}
            {currentStep === 'results' && 'View and download generated results'}
          </CardDescription>
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
