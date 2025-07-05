'use server';

import { analyzeStrategy, AIStrategyAdvisorInput } from '@/ai/flows/ai-strategy-advisor';
import { z } from 'zod';

const inputSchema = z.string().min(10);

export async function getAIAnalysis(strategyCode: string) {
  const validatedCode = inputSchema.safeParse(strategyCode);

  if (!validatedCode.success) {
    throw new Error('Invalid strategy code provided.');
  }

  // In a real application, this data would be fetched from a reliable source.
  const mockHistoricalData = `Date,Open,High,Low,Close,Volume
2023-01-01,16541.2,16630.0,16520.0,16625.1,126000
2023-01-02,16625.2,16750.0,16570.0,16720.5,145000
2023-01-03,16720.6,16800.0,16650.0,16780.2,139000
2023-01-04,16780.1,17000.0,16750.0,16950.3,189000
2023-01-05,16950.2,17200.0,16850.0,17150.8,210000`;

  const input: AIStrategyAdvisorInput = {
    strategyCode: validatedCode.data,
    historicalData: mockHistoricalData,
  };

  try {
    const result = await analyzeStrategy(input);
    return result;
  } catch (error) {
    console.error("Error in AI Strategy Advisor flow:", error);
    // In a production environment, you might want to return a more user-friendly error.
    throw new Error("Failed to get analysis from AI advisor.");
  }
}
