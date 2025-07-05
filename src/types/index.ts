import type { AIStrategyAdvisorOutput } from "@/ai/flows/ai-strategy-advisor";
import type { Timestamp } from "firebase/firestore";

export interface Strategy {
    id: string;
    userId: string;
    strategyName?: string;
    strategyCode: string;
    analysis: AIStrategyAdvisorOutput;
    status: 'running' | 'stopped';
    createdAt: Timestamp;
}
