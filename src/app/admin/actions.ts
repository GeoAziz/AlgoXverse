'use server';

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { AppUser, Strategy, UserRole } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getAllUsers(): Promise<AppUser[]> {
    const usersSnapshot = await adminDb.collection('users').orderBy('createdAt', 'desc').get();
    return usersSnapshot.docs.map(doc => doc.data() as AppUser);
}

export async function updateUserRole(uid: string, role: UserRole) {
    if (role === 'owner') {
        throw new Error("Cannot assign 'owner' role.");
    }
    await adminAuth.setCustomUserClaims(uid, { role });
    await adminDb.collection('users').doc(uid).update({ role });
    revalidatePath('/admin');
    return { success: true };
}

export async function getStrategiesForApproval(): Promise<Strategy[]> {
     const snapshot = await adminDb.collection('strategies').where('approvalStatus', '==', 'pending').orderBy('createdAt', 'desc').get();
     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Strategy));
}

export async function updateStrategyApproval(strategyId: string, status: 'approved' | 'rejected') {
    await adminDb.collection('strategies').doc(strategyId).update({ approvalStatus: status });
    revalidatePath('/admin');
    revalidatePath('/'); // Revalidate home page for the user
    return { success: true };
}


export async function getSystemStats() {
    const usersPromise = adminDb.collection('users').get();
    const strategiesPromise = adminDb.collection('strategies').get();

    const [usersSnapshot, strategiesSnapshot] = await Promise.all([usersPromise, strategiesPromise]);

    const totalUsers = usersSnapshot.size;
    const totalStrategies = strategiesSnapshot.size;
    
    const runningStrategies = strategiesSnapshot.docs.filter(doc => doc.data().status === 'running').length;
    const pendingStrategies = strategiesSnapshot.docs.filter(doc => doc.data().approvalStatus === 'pending').length;

    return {
        totalUsers,
        totalStrategies,
        runningStrategies,
        pendingStrategies,
    };
}
