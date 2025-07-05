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

const TradeLogEntrySchema = z.object({
  id: z.number().describe('A unique ID for the trade.'),
  type: z.enum(['BUY', 'SELL']).describe('The type of trade.'),
  asset: z.string().describe('The asset traded, e.g., BTC/USD.'),
  price: z.number().describe('The execution price.'),
  size: z.number().describe('The size of the trade.'),
  pnl: z.number().describe('The profit or loss from this trade, in USD.'),
  status: z.enum(['Open', 'Closed']).describe('The status of the trade.'),
});

const BacktestMetricsSchema = z.object({
  totalPnl: z.number().describe('Total profit or loss in USD.'),
  winRate: z.number().describe('Percentage of winning trades (0 to 100).'),
  profitFactor: z.number().describe('Ratio of gross profit to gross loss. Greater than 1 is profitable.'),
  totalTrades: z.number().describe('Total number of trades executed.'),
  pnlData: z.array(z.object({ day: z.number(), pnl: z.number() })).describe('An array of 15-20 data points for a PnL chart over time (e.g., by day).'),
  tradeLog: z.array(TradeLogEntrySchema).max(5).describe('A log of the 5 most significant simulated trades from the backtest.'),
});

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
  backtest: BacktestMetricsSchema.describe('Simulated backtest performance metrics based on the provided historical data.'),
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

First, provide specific suggestions for optimizing the trading strategy. Include the rationale behind each suggestion, explaining why it may improve performance. Focus on aspects like parameter adjustments, risk management techniques, and alternative trading rules.

Second, run a plausible simulation of a backtest based on the strategy and historical data. Generate realistic performance metrics for the 'backtest' output field, including PnL, win rate, profit factor, total trades, PnL data for a chart, and a log of a few significant trades. The simulation should appear credible.

Output your analysis in the required structured format.
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
