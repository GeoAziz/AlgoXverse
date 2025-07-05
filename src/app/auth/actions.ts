'use server';

import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { UserRole } from '@/types';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signUpWithEmail(values: z.infer<typeof registerSchema>) {
  try {
    const { email, password } = registerSchema.parse(values);

    const usersCollection = adminDb.collection('users');
    const snapshot = await usersCollection.limit(1).get();
    const role: UserRole = snapshot.empty ? 'owner' : 'trader';
    
    const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: email.split('@')[0],
    });

    await adminAuth.setCustomUserClaims(userRecord.uid, { role });

    await adminDb.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        role: role,
        createdAt: new Date(),
    });

    return { error: null, success: true };
  } catch (e: any)
  {
    if (e.code === 'auth/email-already-exists') {
        return { error: 'An account with this email already exists.', success: false };
    }
    return { error: e.message || "An unexpected error occurred.", success: false };
  }
}
