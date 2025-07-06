
'use client';

import { useState } from 'react';
import type { AIStrategyAdvisorOutput } from '@/ai/flows/ai-strategy-advisor';
import StrategyForm from '@/components/advisor/strategy-form';
import ResultsDisplay from '@/components/advisor/results-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdvisorPage() {
  const [result, setResult] = useState<AIStrategyAdvisorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
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
  
  const GuestAdvisorView = () => (
    <div className="relative">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4 text-center rounded-lg">
        <Lock className="w-16 h-16 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]"/>
        <h2 className="font-headline text-2xl font-bold text-primary">AI Advisor Locked</h2>
        <p className="text-muted-foreground max-w-sm">
          The ability to upload and analyze your own strategies is available to registered users.
        </p>
        <Link href="/auth">
            <Button size="lg" className="group transition-all hover:drop-shadow-[0_0_8px_hsl(var(--accent))]">
                Register to Unlock
            </Button>
        </Link>
      </div>
      <div className="blur-sm pointer-events-none">
        <StrategyForm onAnalysisComplete={() => {}} setIsLoading={() => {}} />
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Sample AI Analysis</CardTitle>
                <CardDescription>This is an example of the analysis Zizo_AI can provide.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm prose prose-invert prose-p:text-muted-foreground">
                    Based on the backtest, the AI suggests increasing the `longMA` parameter to 50 to capture longer trends and reduce noise. It also recommends adding a momentum indicator like RSI to confirm entry signals, potentially improving the win rate.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8"
    >
      <div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">AI Strategy Advisor</h1>
        <p className="text-muted-foreground max-w-2xl">
          Paste your strategy code below. Our AI oracle will analyze its potential and provide suggestions for optimization.
        </p>
      </div>
      
      {!user ? <GuestAdvisorView /> : (
        <>
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
        </>
      )}
      
    </motion.div>
  );
}

    