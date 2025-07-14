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
import { calculateSharpeRatio } from '@/services/trading-metrics';

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

const ChartEventSchema = z.object({
  day: z.number(),
  type: z.enum(['BUY', 'SELL']),
  price: z.number(),
});

const BacktestMetricsSchema = z.object({
  totalPnl: z.number().describe('Total profit or loss in USD.'),
  winRate: z.number().describe('Percentage of winning trades (0 to 100).'),
  profitFactor: z.number().describe('Ratio of gross profit to gross loss. Greater than 1 is profitable.'),
  totalTrades: z.number().describe('Total number of trades executed.'),
  pnlData: z.array(z.object({ day: z.number(), pnl: z.number() })).describe('An array of 15-20 data points for a PnL chart over time (e.g., by day).'),
  priceData: z.array(z.object({ day: z.number(), price: z.number() })).describe('An array of corresponding price data points for a price chart over time.'),
  tradeLog: z.array(TradeLogEntrySchema).max(5).describe('A log of the 5 most significant simulated trades from the backtest.'),
  chartEvents: z.array(ChartEventSchema).describe('An array of buy and sell events to be plotted on the performance chart. The price for each event should correspond to the priceData.'),
  sharpeRatio: z.number().optional().describe('The calculated Sharpe Ratio of the strategy.'),
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


const backtestingTool = ai.defineTool(
  {
    name: 'calculateAdvancedMetrics',
    description: 'Calculates advanced trading performance metrics like the Sharpe Ratio from a series of Profit and Loss (PnL) data points. Use this to provide a quantitative assessment of the strategy\'s risk-adjusted return.',
    inputSchema: z.object({ pnlData: z.array(z.object({ day: z.number(), pnl: z.number() })) }),
    outputSchema: z.object({ sharpeRatio: z.number() }),
  },
  async ({ pnlData }) => {
    const sharpeRatio = await calculateSharpeRatio(pnlData);
    return { sharpeRatio };
  }
);

const prompt = ai.definePrompt({
  name: 'aiStrategyAdvisorPrompt',
  input: {schema: AIStrategyAdvisorInputSchema},
  output: {schema: AIStrategyAdvisorOutputSchema},
  tools: [backtestingTool],
  prompt: `You are an AI-powered trading strategy advisor. Analyze the provided trading strategy and historical market data to suggest optimizations and improvements.

Trading Strategy Code:
{{strategyCode}}

Historical Market Data:
{{historicalData}}

First, provide specific suggestions for optimizing the trading strategy. Include the rationale behind each suggestion, explaining why it may improve performance. Focus on aspects like parameter adjustments, risk management techniques, and alternative trading rules.

Second, run a plausible simulation of a backtest based on the strategy and historical data. Generate realistic performance metrics for the 'backtest' output field. This must include both 'pnlData' and a corresponding 'priceData' array that represents a plausible market price movement for the asset over the same period.

Third, use the 'calculateAdvancedMetrics' tool to calculate the Sharpe Ratio for the generated PnL data. Include this Sharpe Ratio in your analysis and in the 'backtest.sharpeRatio' output field. Your rationale should explain what this Sharpe Ratio indicates about the strategy's risk-adjusted performance.

Finally, generate a series of BUY and SELL events for the 'backtest.chartEvents' field. These events should be plotted against the 'priceData' and their prices should be consistent with it.

Output your complete analysis in the required structured format.
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
