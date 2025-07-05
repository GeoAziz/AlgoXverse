import type { AIStrategyAdvisorOutput } from "@/ai/flows/ai-strategy-advisor";
import type { Timestamp } from "firebase/firestore";

export type UserRole = 'owner' | 'admin' | 'trader';

export interface AppUser {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    role: UserRole;
    createdAt: Timestamp;
}

export interface Strategy {
    id: string;
    userId: string;
    strategyName?: string;
    strategyCode: string;
    analysis: AIStrategyAdvisorOutput;
    status: 'running' | 'stopped';
    approvalStatus: 'pending' | 'approved' | 'rejected';
    createdAt: Timestamp;
    user?: {
        displayName: string | null;
        email: string | null;
    }
}
