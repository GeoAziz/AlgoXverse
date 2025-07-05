'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAIAnalysis } from '@/app/advisor/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AIStrategyAdvisorOutput } from '@/ai/flows/ai-strategy-advisor';
import { useToast } from '@/hooks/use-toast';
import { Wand2 } from 'lucide-react';

const formSchema = z.object({
  strategyCode: z.string().min(10, {
    message: 'Strategy code must be at least 10 characters.',
  }),
});

// Default strategy code to help users get started
const defaultStrategy = `{
  "strategyName": "Simple MA Cross",
  "version": "1.0",
  "description": "A basic moving average crossover strategy.",
  "asset": "BTC/USD",
  "timeframe": "1h",
  "parameters": {
    "shortMA": 10,
    "longMA": 30
  },
  "entryConditions": {
    "and": [
      { "indicator": "MA", "period": 10, "operator": "crosses_above", "value": { "indicator": "MA", "period": 30 } }
    ]
  },
  "exitConditions": {
    "or": [
      { "indicator": "MA", "period": 10, "operator": "crosses_below", "value": { "indicator": "MA", "period": 30 } },
      { "stopLoss": 0.05 },
      { "takeProfit": 0.10 }
    ]
  }
}`;

type StrategyFormProps = {
  onAnalysisComplete: (result: AIStrategyAdvisorOutput | null, error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
};

export default function StrategyForm({ onAnalysisComplete, setIsLoading }: StrategyFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      strategyCode: defaultStrategy,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onAnalysisComplete(null, null);

    try {
      const result = await getAIAnalysis(values.strategyCode);
      if (result) {
        onAnalysisComplete(result, null);
      } else {
        throw new Error('AI analysis returned no result.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      onAnalysisComplete(null, errorMessage);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'The AI advisor could not process your request. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Strategy Input</CardTitle>
        <CardDescription>
          Paste your strategy logic below. You can use JSON or any code format.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="strategyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Strategy Code</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your strategy code here..."
                      className="min-h-[250px] font-code bg-background/50 focus-visible:ring-offset-0 focus-visible:ring-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} className="group transition-all hover:drop-shadow-[0_0_8px_hsl(var(--accent))]">
              <Wand2 className="w-4 h-4 mr-2 transition-transform group-hover:-rotate-12" />
              Analyze Strategy
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
