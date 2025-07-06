
import type { AIStrategyAdvisorOutput } from "@/ai/flows/ai-strategy-advisor";
import type { Timestamp } from "firebase/firestore";

export type UserRole = 'owner' | 'admin' | 'trader';

export interface AppUser {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    role: UserRole;
    createdAt: Timestamp;
}

export type SerializableAppUser = Omit<AppUser, 'createdAt'> & { createdAt: string };


export interface ChartEvent {
    day: number;
    type: 'BUY' | 'SELL';
    price: number;
}

export interface Strategy {
    id: string;
    userId: string;
    strategyName?: string;
    strategyCode: string;
    analysis: AIStrategyAdvisorOutput;
    status: 'running' | 'stopped';
    approvalStatus: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    user?: {
        displayName: string | null;
        email: string | null;
    }
}

export type SerializableStrategy = Omit<Strategy, 'createdAt'> & { createdAt: string };
