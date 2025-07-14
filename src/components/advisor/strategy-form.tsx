
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAIAnalysis, saveStrategyAnalysis } from '@/app/advisor/actions';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AIStrategyAdvisorOutput } from '@/ai/flows/ai-strategy-advisor';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Upload } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import type { ChangeEvent } from 'react';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  strategyCode: z.string().min(10, {
    message: 'Strategy code must be at least 10 characters.',
  }),
});

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
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      strategyCode: defaultStrategy,
    },
  });
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        form.setValue('strategyCode', content, { shouldValidate: true });
         toast({
            title: 'File Loaded',
            description: `${file.name} has been loaded into the editor.`,
        });
      };
      reader.onerror = () => {
         toast({
            variant: 'destructive',
            title: 'File ReadError',
            description: 'Could not read the selected file.',
        });
      };
      reader.readAsText(file);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Required',
            description: 'You must be logged in to analyze a strategy.',
        });
        return;
    }

    setIsLoading(true);
    onAnalysisComplete(null, null);

    try {
      const result = await getAIAnalysis(values.strategyCode);
      if (result) {
        onAnalysisComplete(result, null);
        // After getting the result, save it to Firestore
        await saveStrategyAnalysis(user.uid, values.strategyCode, result);
        toast({
            title: 'Analysis Complete & Saved',
            description: 'Your strategy analysis has been saved to your dashboard.',
        });
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
          Paste your strategy logic below or upload a file (.json, .py, .txt). The analysis will be saved to your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="strategy-file" className="flex items-center gap-2">
                    <Upload className="w-4 h-4"/>
                    Upload Strategy File
                </Label>
                <Input id="strategy-file" type="file" className="bg-background/50 file:text-primary file:font-semibold" onChange={handleFileChange} accept=".json,.py,.txt,.csv" />
                <FormDescription>
                    The file content will be loaded into the text editor below.
                </FormDescription>
            </div>

            <FormField
              control={form.control}
              name="strategyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strategy Code Editor</FormLabel>
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
            <Button type="submit" disabled={form.formState.isSubmitting || !user} className="group transition-all hover:drop-shadow-[0_0_8px_hsl(var(--accent))]">
              <Wand2 className="w-4 h-4 mr-2 transition-transform group-hover:-rotate-12" />
              Analyze and Save Strategy
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
