// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An AI-powered strategy advisor flow.
 *
 * - analyzeStrategy - A function that analyzes a trading strategy and suggests optimizations.
 * - AIStrategyAdvisorInput - The input type for the analyzeStrategy function.
 * - AIStrategyAdvisorOutput - The return type for the analyzeStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIStrategyAdvisorInputSchema = z.object({
  strategyCode: z
    .string()
    .describe('The code or JSON representing the trading strategy.'),
  historicalData: z
    .string()
    .describe('Historical market data as a string, e.g., CSV or JSON.'),
});

export type AIStrategyAdvisorInput = z.infer<typeof AIStrategyAdvisorInputSchema>;

const AIStrategyAdvisorOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'AI-powered suggestions for optimizing the trading strategy, including specific code or parameter adjustments.'
    ),
  rationale: z
    .string()
    .describe(
      'The rationale behind the suggested optimizations, explaining why they may improve performance.'
    ),
});

export type AIStrategyAdvisorOutput = z.infer<typeof AIStrategyAdvisorOutputSchema>;

export async function analyzeStrategy(input: AIStrategyAdvisorInput): Promise<AIStrategyAdvisorOutput> {
  return aiStrategyAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiStrategyAdvisorPrompt',
  input: {schema: AIStrategyAdvisorInputSchema},
  output: {schema: AIStrategyAdvisorOutputSchema},
  prompt: `You are an AI-powered trading strategy advisor. Analyze the provided trading strategy and historical market data to suggest optimizations and improvements.

Trading Strategy Code:
{{strategyCode}}

Historical Market Data:
{{historicalData}}

Based on your analysis, provide specific suggestions for optimizing the trading strategy. Include the rationale behind each suggestion, explaining why it may improve performance. The suggestions should be actionable and clearly describe what changes the trader should make to their strategy. Focus on aspects like parameter adjustments, risk management techniques, and alternative trading rules.

Output your suggestions in a clear and concise manner.
`,
});

const aiStrategyAdvisorFlow = ai.defineFlow(
  {
    name: 'aiStrategyAdvisorFlow',
    inputSchema: AIStrategyAdvisorInputSchema,
    outputSchema: AIStrategyAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
