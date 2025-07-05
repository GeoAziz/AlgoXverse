'use client';

import { useState } from 'react';
import type { AIStrategyAdvisorOutput } from '@/ai/flows/ai-strategy-advisor';
import StrategyForm from '@/components/advisor/strategy-form';
import ResultsDisplay from '@/components/advisor/results-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export default function AdvisorPage() {
  const [result, setResult] = useState<AIStrategyAdvisorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAnalysis = async (analysisResult: AIStrategyAdvisorOutput | null, analysisError: string | null) => {
    setResult(analysisResult);
    setError(analysisError);
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-5/6 mt-2" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
           <CardContent className="pt-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-5/6 mt-2" />
          </CardContent>
        </Card>
      </div>
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">AI Strategy Advisor</h1>
        <p className="text-muted-foreground max-w-2xl">
          Paste your strategy code below. Our AI oracle will analyze its potential and provide suggestions for optimization.
        </p>
      </div>
      <StrategyForm onAnalysisComplete={handleAnalysis} setIsLoading={setIsLoading} />
      
      {isLoading && <LoadingSkeleton />}

      {!isLoading && result && <ResultsDisplay result={result} />}

      {!isLoading && error && (
        <Card className="mt-6 border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="text-destructive p-2 bg-destructive/10 rounded-full">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-headline text-lg font-semibold text-destructive">Analysis Error</h3>
                <p className="text-destructive/80">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
