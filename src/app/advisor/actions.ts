'use server';

import { analyzeStrategy, AIStrategyAdvisorInput, AIStrategyAdvisorOutput } from '@/ai/flows/ai-strategy-advisor';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

const inputSchema = z.string().min(10);

export async function getAIAnalysis(strategyCode: string) {
  const validatedCode = inputSchema.safeParse(strategyCode);

  if (!validatedCode.success) {
    throw new Error('Invalid strategy code provided.');
  }

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
    throw new Error("Failed to get analysis from AI advisor.");
  }
}

export async function saveStrategyAnalysis(
  userId: string,
  strategyCode: string,
  analysis: AIStrategyAdvisorOutput
) {
  if (!userId) {
    throw new Error("User must be authenticated to save a strategy.");
  }

  try {
    // Try to parse strategyCode as JSON to get a name
    let strategyName = "Unnamed Strategy";
    try {
      const parsedCode = JSON.parse(strategyCode);
      if (parsedCode.strategyName) {
        strategyName = parsedCode.strategyName;
      }
    } catch (e) {
      // It's not JSON, so we'll use the default name.
    }

    const strategyData = {
      userId,
      strategyName,
      strategyCode,
      analysis,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection('strategies').add(strategyData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving strategy to Firestore:", error);
    throw new Error("Could not save strategy analysis.");
  }
}
