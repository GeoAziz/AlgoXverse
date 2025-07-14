
'use server';

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { AppUser, SerializableAppUser, SerializableStrategy, Strategy, UserRole } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getAllUsers(): Promise<SerializableAppUser[]> {
    if (!adminDb) {
        console.error("Firebase Admin DB not initialized");
        return [];
    }
    const usersSnapshot = await adminDb.collection('users').orderBy('createdAt', 'desc').get();
    return usersSnapshot.docs.map(doc => {
        const user = doc.data() as AppUser;
        return {
            ...user,
            createdAt: user.createdAt.toDate().toISOString(),
        };
    });
}

export async function updateUserRole(uid: string, role: UserRole) {
    if (!adminAuth || !adminDb) {
        throw new Error("Firebase Admin not initialized");
    }
    if (role === 'owner') {
        throw new Error("Cannot assign 'owner' role.");
    }
    await adminAuth.setCustomUserClaims(uid, { role });
    await adminDb.collection('users').doc(uid).update({ role });
    revalidatePath('/admin');
    return { success: true };
}

export async function getStrategiesForApproval(): Promise<SerializableStrategy[]> {
     if (!adminDb) {
        console.error("Firebase Admin DB not initialized");
        return [];
    }
     const snapshot = await adminDb.collection('strategies').where('approvalStatus', '==', 'pending').orderBy('createdAt', 'desc').get();
     return snapshot.docs.map(doc => {
        const strategy = { id: doc.id, ...doc.data() } as Strategy;
        return {
            ...strategy,
            createdAt: strategy.createdAt.toDate().toISOString(),
        }
     });
}

export async function getStrategyById(strategyId: string): Promise<SerializableStrategy | null> {
    if (!adminDb) {
        console.error("Firebase Admin DB not initialized");
        return null;
    }
    const doc = await adminDb.collection('strategies').doc(strategyId).get();
    if (!doc.exists) {
        return null;
    }
    const strategy = { id: doc.id, ...doc.data() } as Strategy;
    return {
        ...strategy,
        createdAt: strategy.createdAt.toDate().toISOString(),
    };
}


export async function updateStrategyApproval(strategyId: string, status: 'approved' | 'rejected') {
    if (!adminDb) {
        throw new Error("Firebase Admin not initialized");
    }
    await adminDb.collection('strategies').doc(strategyId).update({ approvalStatus: status });
    revalidatePath('/admin');
    revalidatePath('/'); // Revalidate home page for the user
    return { success: true };
}


export async function getSystemStats() {
    if (!adminDb) {
        throw new Error("Firebase Admin not initialized");
    }
    const usersPromise = adminDb.collection('users').get();
    const strategiesPromise = adminDb.collection('strategies').get();
    const approvedStrategiesPromise = adminDb.collection('strategies').where('approvalStatus', '==', 'approved').get();

    const [usersSnapshot, strategiesSnapshot, approvedStrategiesSnapshot] = await Promise.all([usersPromise, strategiesPromise, approvedStrategiesPromise]);

    const totalUsers = usersSnapshot.size;
    const totalStrategies = strategiesSnapshot.size;
    const totalAdmins = usersSnapshot.docs.filter(doc => doc.data().role === 'admin').length;
    
    const runningStrategies = approvedStrategiesSnapshot.docs.filter(doc => doc.data().status === 'running').length;
    const pendingStrategies = strategiesSnapshot.docs.filter(doc => doc.data().approvalStatus === 'pending').length;

    return {
        totalUsers,
        totalStrategies,
        runningStrategies,
        pendingStrategies,
        totalAdmins
    };
}
